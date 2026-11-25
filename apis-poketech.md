# APIs e integrações do Poketech

## Resumo

O frontend usa o catálogo local dos 151 Pokémon como fonte principal. A PokéAPI é consultada sob demanda na página de detalhes. Imagens e cries são carregados de arquivos públicos do repositório oficial da PokeAPI no GitHub. O sorter do backend é opcional e entra por uma variável de ambiente.

Não foram encontradas chaves de API, tokens ou credenciais expostas no código analisado.

## 1. PokéAPI — detalhes do Pokémon

Endpoint base:

```text
https://pokeapi.co/api/v2/pokemon
```

Requisição usada:

```http
GET https://pokeapi.co/api/v2/pokemon/{name}
```

Exemplo:

```text
https://pokeapi.co/api/v2/pokemon/pikachu
```

Uso no frontend:

- Busca ID.
- Busca sprites.
- Busca arte oficial.
- Busca tipos.
- Busca altura e peso.
- Busca estatísticas base.
- Traduz tipos e nomes das estatísticas para português.

Arquivo responsável:

```text
src/services/pokemonService.ts
```

A requisição usa `AbortController` com timeout aproximado de 1,6 segundos. Se a PokéAPI falhar, o frontend usa os dados do catálogo local e exibe detalhes básicos sem quebrar a página.

## 2. Imagens dos Pokémon — PokeAPI GitHub

As imagens não são chamadas por uma API REST. São arquivos estáticos públicos do repositório de sprites da PokeAPI.

Sprite menor:

```text
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png
```

Arte oficial:

```text
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png
```

Uso:

- Cards da Pokédex.
- Silhuetas dos Pokémon não descobertos usando filtro CSS.
- Arte colorida dos Pokémon acertados.
- Página de detalhes.

Arquivo de origem do catálogo:

```text
src/data/pokemon.ts
```

## 3. Cries dos Pokémon — PokeAPI GitHub

Os cries também são arquivos estáticos públicos, em formato `.ogg`.

Cry atual:

```text
https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/{id}.ogg
```

Cry clássico:

```text
https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/{id}.ogg
```

Uso no frontend:

- Reproduzido somente depois do clique do usuário em um card.
- O áudio anterior é pausado antes de iniciar o próximo.
- O som não toca quando a preferência está desligada.
- Volume atual configurado em `0.72`.
- Erros de reprodução não interrompem a navegação para detalhes.

Arquivo responsável:

```text
src/services/pokemonCry.ts
```

## 4. Sorter do backend — integração opcional

O endpoint não está fixo no código. Ele é configurado por:

```text
VITE_POKEDEX_SORTER_URL
```

Quando a variável estiver configurada e houver pelo menos um Pokémon acertado, o frontend envia:

```http
POST {VITE_POKEDEX_SORTER_URL}
Content-Type: application/json
```

Payload:

```json
{
  "matchedPokemonIds": [25, 1, 4],
  "limit": 151
}
```

O frontend aceita três formatos de resposta:

### Lista direta de IDs

```json
[25,  Pikachu_ID, 4]
```

Substitua `Pikachu_ID` pelo número inteiro real do Pokémon.

### Objeto com `pokemonIds`

```json
{
  "pokemonIds": [25, 1, 4]
}
```

### Objeto com `results`

```json
{
  "results": [
    { "pokemonId": 25 },
    { "pokemonId": 1 },
    { "pokemonId": 4 }
  ]
}
```

Arquivo responsável:

```text
src/services/pokedexSorter.ts
```

Se o endpoint não estiver configurado, retornar erro ou retornar formato inválido, o frontend usa fallback local: Pokémon acertados primeiro e depois ordem numérica.

## 5. Dados locais e armazenamento do navegador

O catálogo dos 151 Pokémon é local e não depende de uma chamada de rede para montar o grid.

Acertos salvos em:

```text
poketech:matched-pokemon-ids
```

Formato aproximado:

```json
[1, 4, 25]
```

Preferências de áudio salvas em:

```text
poketech:audio-preferences
```

Formato:

```json
{
  "enabled": true,
  "version": "latest"
}
```

Esses itens são `localStorage`, não APIs externas.

## 6. Tenor

O projeto possui referências de pesquisa do Tenor em:

```text
public/gifs/SOURCES.md
```

As URLs registradas são páginas de busca/referência, não uma integração com a API do Tenor. Os GIFs usados pelo frontend estão armazenados localmente em `public/gifs/`.

## 7. O que o outro repositório precisa implementar

Para importar a mesma lógica, o outro frontend precisa ter:

1. Um cliente ou serviço para `GET /api/v2/pokemon/{name}` da PokéAPI.
2. O catálogo local dos 151 Pokémon para fallback e montagem inicial.
3. As URLs de sprites e artes oficiais.
4. O serviço de cries com versões `latest` e `legacy`.
5. Persistência de acertos e preferências no `localStorage`.
6. Um adaptador opcional para `VITE_POKEDEX_SORTER_URL`.
7. Fallback local quando o backend não estiver disponível.
8. Tratamento de timeout e erros sem quebrar a navegação.

## Arquivos analisados

```text
src/data/pokemon.ts
src/services/pokemonService.ts
src/services/pokedexSorter.ts
src/services/pokemonCry.ts
src/pages/PokemonDetails/index.tsx
src/components/PokemonCard/index.tsx
public/gifs/SOURCES.md
```
