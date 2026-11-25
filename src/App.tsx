import './styles/theme.css';
import './styles/global.css';
import { BrowserRouter } from 'react-router';
import { MainRouter } from './routers/MainRouter';
import { PlayerProfileProvider } from './contexts/PlayerProfileContext';
export default function App(){return <PlayerProfileProvider><BrowserRouter><MainRouter/></BrowserRouter></PlayerProfileProvider>;}
