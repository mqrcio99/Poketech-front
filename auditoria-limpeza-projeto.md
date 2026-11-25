# Auditoria de limpeza e estabilidade — Poketech

Data: 25/11/2026
Branch analisada: `feat/frontend-modern-pokedex`

## Resultado dos testes

- `npm run lint`: passou.
- `npm run build`: passou (`tsc -b` + `vite build`).
- Não foram encontrados imports quebrados durante a auditoria.
- O lockfile está presente e consistente.
- Nenhum arquivo rastreado foi alterado durante a revisão.
- O único arquivo não rastreado no momento é `github-pages-avaliacao.md`, um documento da análise anterior.

## Limpeza segura candidata

### 1. Componentes sem uso

Os arquivos abaixo não aparecem em imports ou rotas atuais:

- `src/components/MainPokedex/index.tsx`: componente vazio, com dois `<div>` sem conteúdo.
- `src/components/BotaoTrocaCor/index.tsx` e `styles.module.css`: implementação antiga de troca de tema. O cabeçalho atual usa `src/hooks/useTheme.ts`.
- `src/components/404/index.tsx`, `styles.module.css`, `Luxio404.png` e `Poketech.code-workspace`: implementação antiga de 404. O roteador usa `src/pages/NotFound`.

Recomendação: remover esses itens em uma limpeza controlada, desde que não sejam mantidos como referência visual/histórica.

### 2. Saída gerada

`dist/` contém a saída do Vite e está corretamente ignorada pelo Git. Não deve ser editada nem versionada. A duplicação dos arquivos de `public/` dentro de `dist/` é esperada após o build.

### 3. Ambiente local

`.env.local` está ignorado e contém apenas variáveis do frontend. Não foram encontrados tokens ou segredos rastreados. `.env.example` está disponível para orientar outros ambientes.

## Riscos importantes encontrados

### Manifesto de rotas incompleto

`src/routers/MainRouter/index.tsx` possui as rotas `/`, `/Principal`, `/Pokedex` e `/pokemon/:name`, enquanto `public/manus-routes.json` não declara `/Principal`.

Recomendação: sincronizar o manifesto ou remover a rota `/Principal` se ela for apenas um alias legado.

### Persistência local da API

`server/index.mjs` grava em `server/data/profiles.json`, mas `server/data` está no `.gitignore`. Em ambientes com filesystem efêmero, reinícios ou novos deploys podem apagar perfis, favoritos e histórico.

Recomendação: manter como protótipo local, mas usar Postgres ou disco persistente antes de produção.

### API aberta por padrão

A API usa `CORS_ORIGIN='*'` por padrão e aceita o `profileId` diretamente pela URL, sem autenticação. Qualquer cliente que conheça um ID pode ler ou alterar o perfil.

Recomendação: manter aberto apenas no desenvolvimento local; em produção definir CORS restrito e adicionar autenticação/identidade de perfil.

### Body sem limite

A função `body()` acumula todo o corpo da requisição em memória antes de analisar o JSON.

Recomendação: adicionar limite de bytes e responder `413 Payload Too Large` para requisições acima do limite.

### Script explícito de typecheck ausente

O typecheck roda dentro de `npm run build`, mas não existe `npm run typecheck`.

Recomendação: adicionar um script explícito, por exemplo `tsc -b --pretty false`, para facilitar CI e manutenção.

## Próxima limpeza recomendada

1. Remover os componentes antigos e o arquivo `.code-workspace` deslocado dentro de `src/components/404`.
2. Sincronizar `public/manus-routes.json` com o roteador.
3. Adicionar `npm run typecheck`.
4. Depois, tratar segurança e persistência da API separadamente, sem misturar essa limpeza visual com uma mudança de arquitetura.
5. Não adicionar workflow ou configuração de GitHub Pages neste momento.
