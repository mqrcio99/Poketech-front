import { Route, Routes } from 'react-router';
import { NotFound } from '../../pages/NotFound';
import { Pokedex } from '../../pages/Pokedex';
import { Principal } from '../../pages/Principal';

export function MainRouter() {
  return (
    <Routes>
      <Route path='/' element=<Principal /> />{' '}
      {/* essa linha so ta aqui para quando abrir o projeto ele nao entrar na pagina 404 */}
      <Route path='/Pokedex' element=<Pokedex /> />
      <Route path='/Principal' element=<Principal /> />
      <Route path='*' element=<NotFound /> />
    </Routes>
  );
}
