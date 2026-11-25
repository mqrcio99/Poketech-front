# Contrato REST do Poketech

O frontend já possui fallback local para funcionar sem login e sem backend. Quando `VITE_POKETECH_API_URL` estiver configurada, as ações de favoritos e partidas também são enviadas ao backend.

## Base

```text
VITE_POKETECH_API_URL
```

Exemplo local:

```text
http://localhost:3000
```

O frontend usa atualmente o perfil temporário `demo`, configurável por `VITE_POKETECH_PROFILE_ID`.

## 1. Consultar progresso

```http
GET /api/v1/profiles/{profileId}/progress
```

Resposta esperada:

```json
{
  "matchedPokemonIds": [1, 4, 25],
  "favoritePokemonIds": [25],
  "history": [
    {
      "date": "2026-11-24",
      "pokemonId": 25,
      "attempts": 3,
      "won": true,
      "completedAt": "2026-11-24T22:00:00.000Z"
    }
  ]
}
```

Todos os IDs precisam ser inteiros positivos. O frontend deve continuar funcionando caso o endpoint esteja indisponível.

## 2. Favoritos

Adicionar ou remover favorito:

```http
PUT /api/v1/profiles/{profileId}/favorites/{pokemonId}
Content-Type: application/json
```

Payload:

```json
{
  "favorite": true
}
```

Resposta:

```json
{
  "favorite": true
}
```

## 3. Registrar partida

```http
POST /api/v1/profiles/{profileId}/games
Content-Type: application/json
```

Payload:

```json
{
  "date": "2026-11-24",
  "pokemonId": 25,
  "attempts": 3,
  "won": true,
  "completedAt": "2026-11-24T22:00:00.000Z"
}
```

Resposta:

```json
{
  "saved": true
}
```

## 4. Desafio diário

Endpoint recomendado para o backend evoluir a regra sem depender do cálculo local:

```http
GET /api/v1/daily-challenge?date=2026-11-24
```

Resposta:

```json
{
  "date": "2026-11-24",
  "pokemonId": 25,
  "attemptLimit": 5
}
```

Enquanto esse endpoint não existir, o frontend calcula o Pokémon do dia de forma determinística a partir da data.

## 5. Conquistas

As conquistas podem ser calculadas pelo backend a partir de `matchedPokemonIds` e `history`, ou continuar sendo calculadas no frontend durante a primeira versão:

```http
GET /api/v1/profiles/{profileId}/achievements
```

Resposta recomendada:

```json
[
  {
    "id": "first-discovery",
    "title": "Primeiro registro",
    "description": "Descubra seu primeiro Pokémon.",
    "unlocked": true
  }
]
```

## Regras técnicas

- Retornar JSON em todas as respostas de sucesso.
- Usar `401` quando o perfil exigir login no futuro.
- Usar `404` para Pokémon inexistente.
- Usar `422` para payload inválido.
- Usar `500` apenas em falhas internas.
- Não enviar segredo para o frontend.
- Permitir CORS para a origem local do Vite durante o desenvolvimento.
- Manter os endpoints versionados em `/api/v1`.
- O frontend não deve quebrar se a API estiver fora do ar; nesse caso, mantém o estado local e tenta sincronizar novamente na próxima ação.


## 6. Perfil e personagem

Consultar o perfil salvo:

```http
GET /api/v1/profiles/{profileId}
```

Atualizar nome e personagem:

```http
PUT /api/v1/profiles/{profileId}
Content-Type: application/json
```

Payload:

```json
{
  "name": "Márcio",
  "characterId": "pikachu",
  "avatarTone": "pink"
}
```

`name` aceita de 2 a 18 caracteres. `characterId` aceita `pikachu`, `ash`, `misty`, `brock` ou `team-rocket`. `avatarTone` aceita `blue` ou `pink`.

Resposta:

```json
{
  "profile": {
    "name": "Márcio",
    "characterId": "pikachu",
    "avatarTone": "pink"
  }
}
```

As partidas podem incluir opcionalmente `characterId`, permitindo que o histórico futuro mostre com qual personagem a descoberta foi feita.
