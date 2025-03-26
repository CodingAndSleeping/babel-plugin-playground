import { FC, useContext } from 'react';
import Editor, { EditorProps } from '@monaco-editor/react';
import { playgroundContext } from '../../context';
const ResultPane: FC = () => {
  const { resultCode, language } = useContext(playgroundContext);

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
        language={language} // 编辑器语言
        value={resultCode || ''} // 编辑器内容
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
