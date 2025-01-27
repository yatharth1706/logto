import { formatNumberWithComma } from '@/utils/number';

import * as styles from './index.module.scss';

type Props = {
  label?: string;
  payload?: Array<{ payload: { count: number; date: string } }>;
};

const ChartTooltip = ({ label, payload }: Props) => {
  if (!label || !payload?.[0]) {
    return null;
  }

  return (
    <div className={styles.chartTooltip}>
      <div className={styles.value}>{formatNumberWithComma(payload[0].payload.count)}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
};

export default ChartTooltip;
