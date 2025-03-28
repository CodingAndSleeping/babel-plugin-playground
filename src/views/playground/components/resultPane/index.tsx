import { FC, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useStore } from '@/store';
import Message from './message';

type WorkerMessage = {
  type: 'CODE' | 'ERROR';
  result: string;
};

const ResultPane: FC = () => {
  const resultCode = useStore((state) => state.resultCode);
  const theme = useStore((state) => state.theme);

  const worker = useStore((state) => state.worker);
  const setResultCode = useStore((state) => state.setResultCode);

  const [error, setError] = useState('');

  useEffect(() => {
    worker.addEventListener('message', (e: MessageEvent<WorkerMessage>) => {
      const { type, result } = e.data;

      if (type === 'CODE') {
        setResultCode(result);
        setError('');
      } else if (type === 'ERROR') {
        setError(result);
        setResultCode('');
      }
    });
  }, [worker, setResultCode]);

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
