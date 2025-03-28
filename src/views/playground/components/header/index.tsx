import { FC } from 'react';
import styles from './index.module.scss';
import babelImg from '@/assets/imgs/babel.svg';
import githubImg from '@/assets/imgs/github.svg';
import githubWhiteImg from '@/assets/imgs/github-white.svg';
import sunImg from '@/assets/imgs/sun.svg';
import moonImg from '@/assets/imgs/moon.svg';
import { useStore } from '@/store';

const Header: FC = () => {
  const sourceCode = useStore((state) => state.sourceCode);
  const pluginCode = useStore((state) => state.pluginCode);
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);

  const worker = useStore((state) => state.worker);
  const onClick = async () => {
    worker.postMessage({ type: 'CODE', sourceCode, pluginCode });
  };

  return (
    <div className={styles['header']}>
      <div className={styles['logo-area']}>
        <img src={babelImg} alt="babel" />
        <span>Babel Plugin Playground</span>
      </div>

      <div className={styles['control-area']}>
        <button type="button" onClick={onClick}>
          运行
        </button>
      </div>
      <div className={styles['menu-area']}>
        <img
          src={theme === 'light' ? moonImg : sunImg}
          alt="moon"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        ></img>
        <img
          src={theme === 'light' ? githubImg : githubWhiteImg}
          alt="github"
          onClick={() =>
            window.open(
              'https://github.com/CodingAndSleeping/babel-plugin-playground',
            )
          }
        ></img>
      </div>
    </div>
  );
};

export default Header;
