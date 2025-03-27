import { FC } from 'react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import styles from './index.module.scss';
import Header from './components/header';
import SourcePane from './components/sourcePane';
import PluginPane from './components/pluginPane';
import ResultPane from './components/resultPane';

const Playground: FC = () => {
  return (
    <div className={styles['main']}>
      <Header></Header>
      <Allotment className={styles['main-content']}>
        <Allotment.Pane>
          <SourcePane></SourcePane>
        </Allotment.Pane>
        <Allotment.Pane>
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
