import { FC, useCallback, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useStore } from '@/store';
import Message from './message';

type WorkerMessage = {
  type: 'CODE' | 'ERROR';
  result: string;
};

const ResultPane: FC = () => {
  const { resultCode, theme, worker, setResultCode } = useStore(
    (state) => state,
  );

  const [error, setError] = useState('');

  const handleMessage = useCallback(
    (e: MessageEvent<WorkerMessage>) => {
      const { type, result } = e.data;

      if (type === 'CODE') {
        setResultCode(result);
        setError('');
      } else if (type === 'ERROR') {
        setError(result);
        setResultCode('');
      }
    },
    [setResultCode],
  );

  useEffect(() => {
    worker.addEventListener('message', handleMessage);

    return () => {
      worker.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {resultCode ? (
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
      ) : (
        <Message type="error" content={error}></Message>
      )}
    </div>
  );
};

export default ResultPane;
