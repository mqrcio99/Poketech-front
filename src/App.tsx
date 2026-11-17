// import { Header } from './components/Header';
// import { Footer } from './components/Footer';
import './styles/theme.css';
import './styles/global.css';
import { MainRouter } from './routers/MainRouter';
import { BrowserRouter } from 'react-router';

function App() {
  return (
    <>
      <BrowserRouter>
        <MainRouter />
      </BrowserRouter>
    </>
  );
}

export default App;
