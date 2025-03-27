import { setupTypeAcquisition } from '@typescript/ata';
import typescript from 'typescript';
type AddExtraLibs = (code: string, path: string) => void;
export const createAta = (addExtraLibs: AddExtraLibs) => {
  const ata = setupTypeAcquisition({
    projectName: 'Babel Plugin Playground',
    typescript: typescript,
    logger: console,
    delegate: {
      receivedFile(code, path) {
        addExtraLibs(code, path);
      },
    },
  });

  return ata;
};
