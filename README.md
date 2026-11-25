# Poketech

Poketech é uma Pokédex interativa com desafio diário, progresso, favoritos, histórico, conquistas, cries e seleção de personagem. O frontend é React + TypeScript + Vite. A API REST opcional vive no mesmo repositório em `server/`.

## Desenvolvimento local

```bash
npm install
npm run dev
```

Para usar a API local em outra sessão:

```bash
npm run api
```

Copie `.env.example` para `.env.local` e configure:

```env
VITE_POKETECH_API_URL=http://localhost:8787
VITE_POKETECH_PROFILE_ID=demo
```

Sem a API disponível, o frontend mantém fallback em `localStorage`.

## Validação

```bash
npm run lint
npm run build
```

## Deploy do frontend na Vercel

O projeto está preparado para Vercel com `vercel.json`. Use a raiz do repositório como diretório do projeto; o build é `npm run build` e a saída é `dist`.

Configure estas variáveis no projeto da Vercel:

```env
VITE_POKETECH_API_URL=https://SEU-BACKEND-REST
VITE_POKETECH_PROFILE_ID=demo
```

`VITE_POKETECH_API_URL` deve apontar para a API publicada separadamente, por exemplo no Render. O servidor `server/index.mjs` não é executado pela hospedagem estática do frontend na Vercel.

A publicação ainda não foi executada. Antes de publicar, confirme a URL final da API e o `CORS_ORIGIN` correspondente.

## API REST

- `GET /health`
- `GET /api/v1/profiles/:profileId`
- `PUT /api/v1/profiles/:profileId`
- `GET /api/v1/profiles/:profileId/progress`
- `GET /api/v1/profiles/:profileId/achievements`
- `PUT /api/v1/profiles/:profileId/favorites/:pokemonId`
- `POST /api/v1/profiles/:profileId/games`
- `GET /api/v1/daily-challenge`

O contrato completo está em [`rest-api-contract.md`](./rest-api-contract.md), e as instruções da API estão em [`server/README.md`](./server/README.md).
