# Fontes dos áudios

A PokéAPI documenta dois cries por Pokémon: `latest` e `legacy`, com URLs no objeto do Pokémon. Fonte: https://pokeapi.co/docs/v2

O repositório oficial PokeAPI/cries informa que os arquivos estão em `.ogg`, são organizados por ID e cobrem Pokémon das gerações 1 a 9. Fonte: https://github.com/PokeAPI/cries

Padrão usado no frontend:
- Atual: https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/{id}.ogg
- Clássico: https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/{id}.ogg
