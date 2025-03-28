import { FC } from 'react';
import Editor, { EditorProps } from '@monaco-editor/react';

import { debounce } from 'lodash-es';
import { useStore } from '@/store';
const SourcePane: FC = () => {
  const sourceCode = useStore((state) => state.sourceCode);
  const setSourceCode = useStore((state) => state.setSourceCode);
  const theme = useStore((state) => state.theme);
  const onChange: EditorProps['onChange'] = (value: string | undefined) => {
    if (!value) return;

    setSourceCode(value || '');
  };

  return (
    <div style={{ height: '100%' }}>
      <Editor
        language="typescript" // 编辑器语言
        path="source.tsx"
        value={sourceCode} // 编辑器内容
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
        }}
        onChange={debounce(onChange, 500)}
      ></Editor>
    </div>
  );
};

export default SourcePane;
