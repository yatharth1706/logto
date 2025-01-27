import { ConnectorType } from '@logto/schemas';
import { has } from '@silverhand/essentials';
import { object, record, string, unknown } from 'zod';

import RequestError from '#src/errors/RequestError/index.js';
import koaGuard from '#src/middleware/koa-guard.js';
import assertThat from '#src/utils/assert-that.js';
import { notImplemented } from '#src/utils/connectors/consts.js';

import type { RouterInitArgs } from '../routes/types.js';
import type { AuthedMeRouter } from './types.js';

/**
 * This social API route is meant for linking social accounts in Logto Cloud AC.
 * Thus it does NOT support connectors rely on the session (jti based) storage. E.g. Apple connector and all standard connectors.
 * This is because Logto Cloud AC only supports Google and GitHub social sign-in, both of which do not rely on session storage.
 */
export default function socialRoutes<T extends AuthedMeRouter>(
  ...[router, tenant]: RouterInitArgs<T>
) {
  const {
    libraries: {
      connectors: { getLogtoConnectorById },
    },
    queries: {
      users: { findUserById, updateUserById, deleteUserIdentity, hasUserWithIdentity },
    },
  } = tenant;

  router.post(
    '/social-authorization-uri',
    koaGuard({
      body: object({ connectorId: string(), state: string(), redirectUri: string() }),
    }),
    async (ctx, next) => {
      const { connectorId, state, redirectUri } = ctx.guard.body;
      assertThat(state && redirectUri, 'session.insufficient_info');

      const connector = await getLogtoConnectorById(connectorId);
      assertThat(connector.type === ConnectorType.Social, 'connector.unexpected_type');

      const {
        headers: { 'user-agent': userAgent },
      } = ctx.request;

      const redirectTo = await connector.getAuthorizationUri(
        {
          state,
          redirectUri,
          connectorId,
          connectorFactoryId: connector.metadata.id,
          /**
           * Passing empty jti only works for connectors not relying on session storage.
           * E.g. Google and GitHub
           */
          jti: '',
          headers: { userAgent },
        },
        /**
         * Same as above, passing `notImplemented` only works for connectors not relying on session storage.
         * E.g. Google and GitHub
         */
        notImplemented
      );

      ctx.body = { redirectTo };

      return next();
    }
  );

  router.post(
    '/link-social-identity',
    koaGuard({
      body: object({
        connectorId: string(),
        connectorData: record(string(), unknown()),
      }),
    }),
    async (ctx, next) => {
      const { id: userId } = ctx.auth;
      const { connectorId, connectorData } = ctx.guard.body;

      const [connector, user] = await Promise.all([
        getLogtoConnectorById(connectorId),
        findUserById(userId),
      ]);

      assertThat(
        connector.type === ConnectorType.Social,
        new RequestError({
          code: 'session.invalid_connector_id',
          status: 422,
          connectorId,
        })
      );

      const { target } = connector.metadata;

      assertThat(
        !has(user.identities, target),
        new RequestError({
          code: 'user.social_account_exists_in_profile',
          status: 422,
        })
      );

      /**
       * Same as above, passing `notImplemented` only works for connectors not relying on session storage.
       * E.g. Google and GitHub
       */
      const socialUserInfo = await connector.getUserInfo(connectorData, notImplemented, {
        get: notImplemented,
        set: notImplemented,
      });

      assertThat(
        !(await hasUserWithIdentity(target, socialUserInfo.id)),
        new RequestError({
          code: 'user.identity_already_in_use',
          status: 422,
        })
      );

      await updateUserById(userId, {
        identities: {
          ...user.identities,
          [target]: {
            userId: socialUserInfo.id,
            details: socialUserInfo,
          },
        },
      });

      ctx.status = 204;

      return next();
    }
  );

  router.delete(
    '/social-identity/:connectorId',
    koaGuard({
      params: object({
        connectorId: string(),
      }),
    }),
    async (ctx, next) => {
      const { id: userId } = ctx.auth;
      const { connectorId } = ctx.guard.params;

      const [connector, user] = await Promise.all([
        getLogtoConnectorById(connectorId),
        findUserById(userId),
      ]);

      const { target } = connector.metadata;

      assertThat(
        has(user.identities, target),
        new RequestError({ code: 'user.identity_not_exist', status: 404 })
      );

      await deleteUserIdentity(userId, target);

      ctx.status = 204;

      return next();
    }
  );
}
