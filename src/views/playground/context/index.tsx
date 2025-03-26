import { createContext, FC, PropsWithChildren, useState } from 'react';
import {
  sourceCode as sc,
  pluginCode as pc,
  resultCode as rc,
} from './initCode';

type PlaygroundContextType = {
  sourceCode: string;
  setSourceCode: (code: string) => void;

  pluginCode: string;
  setPluginCode: (code: string) => void;

  resultCode: string;
  setResultCode: (code: string) => void;

  language: string;
  setLanguage: (lang: string) => void;
};

export const playgroundContext = createContext<PlaygroundContextType>(
  {} as PlaygroundContextType,
);

export const PlaygoundProvier: FC<PropsWithChildren> = ({ children }) => {
  const [sourceCode, setSourceCode] = useState<string>(sc);

  const [pluginCode, setPluginCode] = useState<string>(pc);

  const [resultCode, setResultCode] = useState<string>(rc);

  const [language, setLanguage] = useState<string>('javascript');

  return (
    <playgroundContext.Provider
      value={{
        sourceCode,
        setSourceCode,
        pluginCode,
        setPluginCode,
        resultCode,
        setResultCode,
        language,
        setLanguage,
      }}
    >
      {children}
    </playgroundContext.Provider>
  );
};
