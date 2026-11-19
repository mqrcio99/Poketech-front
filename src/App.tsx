import './styles/theme.css';
import './styles/global.css';
import { BrowserRouter } from 'react-router';
import { MainRouter } from './routers/MainRouter';
export default function App(){return <BrowserRouter><MainRouter/></BrowserRouter>;}
