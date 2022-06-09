import classNames from 'classnames';
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { TFuncKey, useTranslation } from 'react-i18next';

import Copy from '@/icons/Copy';

import Tooltip from '../Tooltip';
import * as styles from './index.module.scss';

type Props = {
  value: string;
  className?: string;
  variant?: 'text' | 'contained' | 'border' | 'icon';
};

type CopyState = TFuncKey<'translation', 'admin_console.copy'>;

const CopyToClipboard = ({ value, className, variant = 'contained' }: Props) => {
  const copyIconReference = useRef<HTMLDivElement>(null);
  const [copyState, setCopyState] = useState<CopyState>('pending');
  const { t } = useTranslation(undefined, { keyPrefix: 'admin_console.copy' });

  useEffect(() => {
    copyIconReference.current?.addEventListener('mouseleave', () => {
      setCopyState('pending');
    });
  }, []);

  const copy: MouseEventHandler<HTMLDivElement> = async () => {
    setCopyState('copying');
    await navigator.clipboard.writeText(value);
    setCopyState('copied');
  };

  return (
    <div
      className={classNames(styles.container, styles[variant], className)}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <div className={styles.row}>
        {variant === 'icon' ? null : value}
        <div ref={copyIconReference} className={styles.copyIcon} onClick={copy}>
          <Copy />
        </div>
        <Tooltip
          anchorRef={copyIconReference}
          content={t(copyState)}
          className={classNames(copyState === 'copied' && styles.successfulTooltip)}
        />
      </div>
    </div>
  );
};

export default CopyToClipboard;
