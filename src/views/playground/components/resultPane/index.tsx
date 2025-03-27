import { FC } from 'react';
import Editor, { EditorProps } from '@monaco-editor/react';
import { useStore } from '@/store';

const ResultPane: FC = () => {
  const resultCode = useStore((state) => state.resultCode);
  const theme = useStore((state) => state.theme);
  const onMount: EditorProps['onMount'] = (editor, monaco) => {
    // editor 挂载时的回调函数
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyL,
      () => {
        editor.getAction('editor.action.formatDocument')?.run();
      },
    );

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      esModuleInterop: true,
    });
  };

  return (
    <div style={{ height: '100%' }}>
      <Editor
        language="javascript" // 编辑器语言
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
        onMount={onMount}
      ></Editor>
    </div>
  );
};

export default ResultPane;
