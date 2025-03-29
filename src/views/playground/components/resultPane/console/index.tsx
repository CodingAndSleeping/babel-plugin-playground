import { FC, memo } from 'react';
import styles from './index.module.scss';

import JsonView from 'react-json-view';
import { useStore } from '@/store';

type Props = {
  contents: any[];
};

const Console: FC<Props> = ({ contents }) => {
  const { theme } = useStore((state) => state);

  return (
    <div className={styles['console']}>
      <div className={styles['console-header']}>
        <span>控制台</span>
      </div>
      <div className={styles['console-content']}>
        {contents.map((content, index) => (
          <div className={styles['console-item']} key={index}>
            {content.map((item: any, index: number) =>
              typeof item === 'object' ? (
                <JsonView
                  src={item}
                  key={index}
                  collapsed
                  name={false}
                  displayDataTypes={false}
                  enableClipboard={false}
                  displayObjectSize={false}
                  theme={theme === 'dark' ? 'railscasts' : 'rjv-default'}
                />
              ) : (
                <p key={index}>{item.toString()}</p>
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(Console);
