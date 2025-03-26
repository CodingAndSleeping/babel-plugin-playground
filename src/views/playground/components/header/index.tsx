import { FC, useContext } from 'react';
import styles from './index.module.scss';
import babelImg from '@/assets/imgs/babel.svg';
import githubImg from '@/assets/imgs/github.svg';
import moonImg from '@/assets/imgs/moon.svg';
import { playgroundContext } from '../../context';
import { transform } from '@babel/standalone';
const Header: FC = () => {
  const { sourceCode, pluginCode, setResultCode } =
    useContext(playgroundContext);

  const onClick = async () => {
    const url = URL.createObjectURL(
      new Blob([pluginCode], { type: 'application/javascript' }),
    );

    console.log(url);

    try {
      const result = await import(url);

      // console.log(result.default());

      // console.log(result);

      const { code } = transform(sourceCode, {
        presets: ['react', 'typescript'],
        filename: 'index.js',
        plugins: [result.default],
      });

      if (code) {
        setResultCode(code);
      }
    } catch (e) {
      console.error(e);
    }
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
        <img src={moonImg} alt="moon"></img>
        <img src={githubImg} alt="github"></img>
      </div>
    </div>
  );
};

export default Header;
