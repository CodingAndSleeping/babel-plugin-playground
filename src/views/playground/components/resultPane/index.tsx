import { FC, useCallback, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Allotment } from 'allotment';

import { useStore } from '@/store';
import Message from './message';
import Console from './console';
import styles from './index.module.scss';

const ResultPane: FC = () => {
  const {
    sourceCode,
    pluginCode,
    theme,
    worker,
    consoleContents,
    setConsoleContents,
  } = useStore((state) => state);

  const [resultCode, setResultCode] = useState('');
  const [error, setError] = useState('');

  const handleMessage = useCallback(
    (e: MessageEvent) => {
      const { type, result } = e.data;

      if (type === 'CODE') {
        setResultCode(result);
        setError('');
      } else if (type === 'ERROR') {
        setError(result);
      } else if (type === 'CONSOLE') {
        setConsoleContents(result);
      }
    },
    [setResultCode],
  );

  useEffect(() => {
    worker.addEventListener('message', handleMessage);

    worker.postMessage({ type: 'CODE', sourceCode, pluginCode });

    return () => {
      worker.removeEventListener('message', handleMessage);
    };
  }, [worker, handleMessage]);

  return (
    <div className={styles['result']}>
      <Allotment vertical>
        <Allotment.Pane preferredSize={'70%'}>
          <div className={styles['result-content']}>
            <Editor
              language="javascript" // 编辑器语言
              path="result.js"
              value={resultCode || ''} // 编辑器内容
              theme={`vs-${theme}`}
              options={{
                fontSize: 14,
                scrollBeyondLastLine: false, // 允许滚动到最后一行
                minimap: {
                  enabled: false, // 禁用 minimap
                },
                scrollbar: {
                  verticalScrollbarSize: 6, // 垂直滚动条大小
                  horizontalScrollbarSize: 6, // 水平滚动条大小
                },
                readOnly: true, // 只读模式
              }}
            ></Editor>
          </div>
        </Allotment.Pane>
        <Allotment.Pane>
          <div className={styles['result-console']}>
            {error ? (
              <Message type="error" content={error}></Message>
            ) : (
              <Console contents={consoleContents}></Console>
            )}
          </div>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};

export default ResultPane;
