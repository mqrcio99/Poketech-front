# Poketech API

API REST do Poketech, mantida no mesmo repositório do frontend.

## Desenvolvimento local

Em um terminal:

```bash
npm run api:dev
```

A API inicia em `http://localhost:8787` por padrão.

Em outro terminal:

```bash
npm run dev -- --host 0.0.0.0 --port 5173
```

O frontend usa a API quando `VITE_POKETECH_API_URL` está configurada. O arquivo `.env.local` de desenvolvimento pode conter:

```env
VITE_POKETECH_API_URL=http://localhost:8787
VITE_POKETECH_PROFILE_ID=demo
```

## Rotas

- `GET /health`
- `GET /api/v1/profiles/:profileId/progress`
- `GET /api/v1/profiles/:profileId/achievements`
- `PUT /api/v1/profiles/:profileId/favorites/:pokemonId`
- `POST /api/v1/profiles/:profileId/games`
- `GET /api/v1/daily-challenge?date=YYYY-MM-DD`

## Persistência

Durante o protótipo, os perfis são gravados em `server/data/profiles.json`. Essa pasta é ignorada pelo Git para não versionar dados de usuário.

Para produção no Render, substituir o adaptador de arquivo por Postgres ou outro armazenamento persistente. O contrato HTTP pode permanecer igual.

## Render

Configuração inicial sugerida:

- Root directory: raiz do repositório.
- Build command: `npm ci`.
- Start command: `npm run api`.
- Environment: `PORT` fornecida pelo Render; opcionalmente `CORS_ORIGIN` com a origem da Vercel.
- Health check path: `/health`.
