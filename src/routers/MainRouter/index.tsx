import { Route, Routes } from 'react-router';
import { SiteLayout } from '../../components/SiteLayout';
import { Pokedex } from '../../pages/Pokedex';
import { PokemonDetails } from '../../pages/PokemonDetails';
import { Principal } from '../../pages/Principal';
import { NotFound } from '../../pages/NotFound';
export function MainRouter(){return <Routes><Route path="/" element={<SiteLayout><Principal/></SiteLayout>}/><Route path="/Principal" element={<SiteLayout><Principal/></SiteLayout>}/><Route path="/Pokedex" element={<SiteLayout><Pokedex/></SiteLayout>}/><Route path="/pokemon/:name" element={<SiteLayout><PokemonDetails/></SiteLayout>}/><Route path="*" element={<SiteLayout><NotFound/></SiteLayout>}/></Routes>;}
