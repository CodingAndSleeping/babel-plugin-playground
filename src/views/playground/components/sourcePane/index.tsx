import { FC, useContext } from 'react';
import Editor, { EditorProps } from '@monaco-editor/react';
import { playgroundContext } from '../../context';
import { debounce } from 'lodash-es';
const SourcePane: FC = () => {
  const { sourceCode, setSourceCode, language } = useContext(playgroundContext);

  const onChange: EditorProps['onChange'] = (value: string | undefined) => {
    if (!value) return;

    setSourceCode(value || '');
  };

  return (
    <div style={{ height: '100%' }}>
      <Editor
        language={language} // 编辑器语言
        value={sourceCode || ''} // 编辑器内容
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
