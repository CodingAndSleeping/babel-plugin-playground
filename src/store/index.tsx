import { initSourceCode, initPluginCode, initResultCode } from './initCode';

import { create } from 'zustand';

import Worker from '@/views/playground/worker/compile.ts?worker';
import { uncompress } from '@/utils';

export type State = {
  sourceCode: string;
  pluginCode: string;
  resultCode: string;

  worker: Worker;

  theme: 'light' | 'dark';
};

export type Action = {
  setSourceCode: (code: string) => void;
  setPluginCode: (code: string) => void;
  setResultCode: (code: string) => void;
  setTheme: (theme: State['theme']) => void;
};

function getCodeFromUrl() {
  let code = {
    sourceCode: '',
    pluginCode: '',
    resultCode: '',
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
  const { sourceCode, pluginCode, resultCode } = getCodeFromUrl();
  return {
    sourceCode: sourceCode || initSourceCode,
    pluginCode: pluginCode || initPluginCode,
    resultCode: resultCode || initResultCode,

    worker: new Worker(),

    theme: (localStorage.getItem('theme') as State['theme']) || 'light',

    setSourceCode: (code: string) => set(() => ({ sourceCode: code })),
    setPluginCode: (code: string) => set(() => ({ pluginCode: code })),
    setResultCode: (code: string) => set(() => ({ resultCode: code })),
    setTheme: (theme: State['theme']) => {
      set(() => ({ theme }));

      localStorage.setItem('theme', theme);
    },
  };
});

// type PlaygroundContextType = {
//   sourceCode: string;
//   setSourceCode: (code: string) => void;

//   pluginCode: string;
//   setPluginCode: (code: string) => void;

//   resultCode: string;
//   setResultCode: (code: string) => void;

//   language: string;
//   setLanguage: (lang: string) => void;
// };

// // eslint-disable-next-line react-refresh/only-export-components
// export const playgroundContext = createContext<PlaygroundContextType>(
//   {} as PlaygroundContextType,
// );

// export const PlaygoundProvier: FC<PropsWithChildren> = ({ children }) => {
//   const [sourceCode, setSourceCode] = useState<string>(sc);

//   const [pluginCode, setPluginCode] = useState<string>(pc);

//   const [resultCode, setResultCode] = useState<string>(rc);

//   const [language, setLanguage] = useState<string>('javascript');

//   return (
//     <playgroundContext.Provider
//       value={{
//         sourceCode,
//         setSourceCode,
//         pluginCode,
//         setPluginCode,
//         resultCode,
//         setResultCode,
//         language,
//         setLanguage,
//       }}
//     >
//       {children}
//     </playgroundContext.Provider>
//   );
// };
