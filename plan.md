# Plano — frontend moderno do Poketech

## Direção visual

Escolha: dashboard editorial / tech-lab. A interface usa fundo profundo, azul elétrico como assinatura, cards com profundidade e tipografia sans-serif com mono para números. A navegação será arejada e responsiva, com foco no jogo e na descoberta dos Pokémon.

## Entregas

- Catálogo local dos 151 Pokémon para desenvolvimento offline.
- Busca por nome ou número.
- Cards e detalhes modernos.
- Tela inicial do jogo com tentativas dinâmicas locais.
- Tema claro/escuro.
- Rotas internas para home, Pokédex, detalhes e 404.
- Camada de serviço preparada para substituir mock por backend.
- Grid da Pokédex com bordas azuis, padrão de bolinhas e responsividade.
- Registro local dos Pokémon acertados no jogo para destacar os cards já descobertos.
- Ordenação preparada para três modos: número, nome e similaridade com os acertos.
- Contrato de integração opcional com o sorter do backend via `VITE_POKEDEX_SORTER_URL`, mantendo fallback local até o endpoint existir.

## UX/UI do grid

A Pokédex aberta mantém o painel lateral do protótipo e concentra o catálogo em um grid de cards com bastante respiro. O padrão de bolinhas funciona como uma régua de progresso discreta: cada bolinha representa um acerto e muda para azul quando o usuário descobre um Pokémon. Cards acertados recebem um realce visual; resultados retornados pelo sorter recebem um marcador sutil de similaridade, sem transformar a tela em um painel de texto.

O controle de ordenação alterna entre `Nº`, `A–Z` e `SIM`. O modo `SIM` usa os IDs retornados pelo backend quando `VITE_POKEDEX_SORTER_URL` estiver configurada. Sem essa variável, o frontend mantém os acertos no topo e preserva a ordem por número, deixando a integração pronta sem quebrar o catálogo offline.
