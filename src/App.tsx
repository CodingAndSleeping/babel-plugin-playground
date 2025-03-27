import './App.scss';
import { useStore } from './store';
import Playground from './views/playground';

function App() {
  const theme = useStore((state) => state.theme);
  return (
    <div className={`app ${theme}`}>
      <Playground></Playground>
    </div>
  );
}

export default App;
