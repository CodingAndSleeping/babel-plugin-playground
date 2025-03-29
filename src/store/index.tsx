import { initSourceCode, initPluginCode } from './initCode';

import { create } from 'zustand';

import Worker from '@/views/playground/worker/compile.ts?worker';
import { uncompress } from '@/utils';

export type State = {
  sourceCode: string;
  pluginCode: string;

  worker: Worker;

  theme: 'light' | 'dark';
};

export type Action = {
  setSourceCode: (code: string) => void;
  setPluginCode: (code: string) => void;

  setTheme: (theme: State['theme']) => void;
};

function getCodeFromUrl() {
  let code = {
    sourceCode: '',
    pluginCode: '',
  };
  try {
    const codeObj = uncompress(window.location.hash.slice(1));
    if (codeObj) code = JSON.parse(codeObj);
  } catch (e) {
    console.error(e);
  }
  return code;
}

export const useStore = create<State & Action>()((set) => {
  const { sourceCode, pluginCode } = getCodeFromUrl();
  return {
    sourceCode: sourceCode || initSourceCode,
    pluginCode: pluginCode || initPluginCode,

    worker: new Worker(),

    theme: (localStorage.getItem('theme') as State['theme']) || 'light',

    setSourceCode: (code: string) => set(() => ({ sourceCode: code })),
    setPluginCode: (code: string) => set(() => ({ pluginCode: code })),
    setTheme: (theme: State['theme']) => {
      set(() => ({ theme }));
      localStorage.setItem('theme', theme);
    },
  };
});
