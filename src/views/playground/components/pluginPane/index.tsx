import { FC } from 'react';
import Editor, { EditorProps } from '@monaco-editor/react';

import { debounce } from 'lodash-es';
import { useStore } from '@/store';
import { createAta } from './ata';
const PluginPane: FC = () => {
  const { pluginCode, setPluginCode, theme } = useStore((state) => state);
  const onMount: EditorProps['onMount'] = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      editor.getAction('editor.action.formatDocument')?.run();
    });

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      esModuleInterop: true,
    });

    const ata = createAta((code, path) => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        code,
        `file://${path}`,
      );
    });

    ata('import * as Babel from "@babel/core";');
  };

  const onChange: EditorProps['onChange'] = (value: string | undefined) => {
    if (!value) return;

    setPluginCode(value || '');
  };
  return (
    <div style={{ height: '100%' }}>
      <Editor
        language="typescript" // 编辑器语言
        path="plugin.ts"
        value={pluginCode || ''} // 编辑器内容
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
        onMount={onMount}
      ></Editor>
    </div>
  );
};

export default PluginPane;
