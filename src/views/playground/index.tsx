import { FC, useEffect } from 'react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import styles from './index.module.scss';
import Header from './components/header';
import SourcePane from './components/sourcePane';
import PluginPane from './components/pluginPane';
import ResultPane from './components/resultPane';
import { compress } from '@/utils';
import { useStore } from '@/store';

const Playground: FC = () => {
  const { sourceCode, pluginCode } = useStore((state) => state);

  useEffect(() => {
    const hash = compress(JSON.stringify({ sourceCode, pluginCode }));
    window.location.hash = hash || '';
  }, [sourceCode, pluginCode]);

  return (
    <div className={styles['main']}>
      <Header></Header>
      <Allotment className={styles['main-content']}>
        <Allotment.Pane preferredSize={'25%'}>
          <SourcePane></SourcePane>
        </Allotment.Pane>
        <Allotment.Pane preferredSize={'50%'}>
          <PluginPane></PluginPane>
        </Allotment.Pane>

        <Allotment.Pane>
          <ResultPane></ResultPane>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};

export default Playground;
