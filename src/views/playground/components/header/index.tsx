import { FC } from 'react';
import styles from './index.module.scss';
import babelImg from '@/assets/imgs/babel.svg';
import githubImg from '@/assets/imgs/github.svg';
import githubWhiteImg from '@/assets/imgs/github-white.svg';
import sunImg from '@/assets/imgs/sun.svg';
import moonImg from '@/assets/imgs/moon.svg';
import shareImg from '@/assets/imgs/share.svg';
import shareWhiteImg from '@/assets/imgs/share-white.svg';
import { useStore } from '@/store';

const Header: FC = () => {
  const {
    sourceCode,
    pluginCode,
    theme,
    setTheme,
    worker,
    clearConsoleContents,
  } = useStore((state) => state);
  const handleRun = async () => {
    clearConsoleContents();

    worker.postMessage({ type: 'CODE', sourceCode, pluginCode });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href); // 将文本写入剪贴板
      alert('Sharable URL has been copied to clipboard.');
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  return (
    <div className={styles['header']}>
      <div className={styles['logo-area']}>
        <img src={babelImg} alt="babel" />
        <span>Babel Plugin Playground</span>
      </div>

      <div className={styles['control-area']}>
        <button type="button" onClick={handleRun}>
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
          src={theme === 'light' ? shareImg : shareWhiteImg}
          alt="share"
          onClick={handleShare}
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
