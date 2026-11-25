# Prompt para importar a lógica UX/UI do Poketech

Você é um desenvolvedor frontend sênior responsável por importar para este projeto toda a lógica de UX/UI já implementada no Poketech. Não crie uma nova experiência do zero e não substitua o visual atual por um dashboard genérico. Preserve a identidade de Pokédex moderna, limpa, nostálgica e responsiva.

## Contexto do projeto

O Poketech é uma aplicação React + TypeScript + Vite, com CSS Modules e `lucide-react`. A aplicação possui uma tela de jogo de adivinhação, uma Pokédex com os 151 Pokémon, páginas de detalhes, tema claro/escuro e integração preparada para um sorter do backend.

A experiência visual deve combinar:

- Protótipo original de Pokédex.
- Interface moderna de tech-lab/editorial dashboard.
- Fundo claro ou escuro conforme o tema.
- Azul elétrico como cor de assinatura.
- Cards com profundidade e bordas azuis.
- Tipografia sans-serif para títulos e fonte monoespaçada para números, estados e rótulos técnicos.
- Microinterações discretas, sem excesso de texto, modais ou banners.
- Sensação de dispositivo físico, especialmente nos botões e controles de áudio.

## Objetivo principal

Importar e preservar toda a lógica UX/UI já implementada, incluindo:

1. Tela inicial com Pokédex fechada.
2. Abertura da Pokédex por uma ação explícita do usuário.
3. Pokédex aberta com painel lateral e catálogo em grid.
4. Busca por nome ou número.
5. Ordenação por número, nome e similaridade.
6. Progresso visual por bolinhas.
7. Silhuetas pretas para Pokémon ainda não descobertos.
8. Arte colorida para Pokémon acertados.
9. Destaques para acertos e recomendações de similaridade.
10. Tema claro/escuro.
11. Cry reproduzido ao clicar em um card.
12. Controle para ativar ou silenciar os cries.
13. Alternância entre áudio atual e clássico.
14. Persistência das preferências de áudio no navegador.
15. Interrupção do cry anterior antes de reproduzir outro.
16. Navegação normal para os detalhes do Pokémon após o clique.

## Estrutura funcional esperada

### 1. Tela fechada

Antes de abrir, exibir a Pokédex fechada com:

- Imagem do dispositivo fechado.
- Pequeno tratamento de brilho ou scan já existente no projeto.
- Rótulo curto `POKÉDEX`.
- Chamada objetiva, como `Pronta para abrir?`.
- Botão físico `Abrir Pokédex` com ícone de livro.

A Pokédex não deve abrir automaticamente. A abertura deve ocorrer somente após o clique do usuário.

### 2. Tela aberta

Ao abrir, exibir:

- Painel lateral com a imagem da Pokédex e botão de fechar.
- Área principal com cabeçalho `CATÁLOGO`.
- Título `Pokédex 151`.
- Contagem de resultados encontrados.
- Barra de progresso com bolinhas.
- Dock compacto de áudio.
- Barra de busca e ordenação.
- Grid responsivo dos cards.

O painel não deve ser substituído por uma tela cheia genérica. Manter a composição visual parecida com o protótipo original.

### 3. Progresso por bolinhas

Usar uma sequência discreta de bolinhas como régua visual de progresso.

Regras:

- Cada bolinha representa um acerto.
- Bolinhas correspondentes aos acertos ficam ativas em azul.
- As demais permanecem no estado neutro.
- Mostrar texto curto, por exemplo `Acertos`, `1 acerto` ou `2 acertos`.
- Não transformar o progresso em um painel de números ou texto excessivo.
- O progresso deve continuar visível mesmo quando a busca ou a ordenação mudar.

### 4. Cards dos Pokémon

Cada card deve preservar:

- Número do Pokémon no canto superior.
- Imagem da arte oficial.
- Tipo ou rótulo auxiliar curto.
- Nome do Pokémon.
- Ícone discreto de navegação.
- Borda azul e fundo compatível com o tema.
- Estados de hover, foco e clique.
- Layout responsivo.

O card deve continuar sendo um link navegável para `/pokemon/:name` ou para a rota equivalente já existente.

Ao clicar no card, executar nesta ordem lógica:

1. Solicitar a reprodução do cry selecionado.
2. Manter a navegação para a página de detalhes.
3. Não abrir modal intermediário.
4. Não interromper a navegação por causa de erro de áudio.

### 5. Pokémon não descobertos

Pokémon ainda não acertados devem continuar como silhuetas pretas.

Aplicar à imagem:

```css
filter: brightness(0) saturate(100%) drop-shadow(0 9px 7px rgba(0, 0, 0, .28));
opacity: .9;
```

Regras:

- Não exibir a arte colorida antes do acerto.
- Manter o nome e o número disponíveis conforme o comportamento atual.
- Não usar blur excessivo.
- Não esconder o card inteiro.
- A silhueta deve continuar reconhecível e visualmente integrada ao fundo.

### 6. Pokémon acertados

Quando o usuário acertar um Pokémon:

- Remover o filtro de silhueta.
- Exibir a arte colorida original.
- Aplicar destaque visual no card.
- Usar borda verde para indicar o acerto.
- Exibir um ícone de confirmação.
- Preservar o nome e a navegação.

O destaque deve ser claro, mas não pode quebrar a paleta azul principal nem deixar o grid poluído.

### 7. Similaridade

A ordenação deve possuir três estados:

- `Nº`: ordem numérica.
- `A–Z`: ordem alfabética.
- `SIM`: ordem por similaridade.

Quando o modo `SIM` estiver ativo:

- Usar a ordem retornada pelo sorter do backend se `VITE_POKEDEX_SORTER_URL` estiver configurada.
- Manter fallback local quando o endpoint não existir ou falhar.
- Não quebrar o catálogo offline.
- Exibir um marcador sutil nos resultados recomendados.
- Não adicionar explicações longas em cada card.
- Pokémon já acertados devem manter prioridade visual adequada.

### 8. Busca

A busca deve:

- Aceitar nome ou número.
- Atualizar o grid sem recarregar a página.
- Preservar o modo de ordenação atual.
- Mostrar `Nenhum resultado.` quando não houver correspondência.
- Usar um campo compacto com ícone de busca.
- Continuar acessível com `aria-label`.

### 9. Áudio nostálgico

O áudio deve ser uma microinteração opcional, não uma trilha sonora contínua.

#### Reprodução

Ao clicar em um card, reproduzir o cry correspondente ao ID do Pokémon usando os arquivos oficiais:

- Áudio atual:
  `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/{id}.ogg`
- Áudio clássico:
  `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/{id}.ogg`

Regras:

- Nunca usar autoplay.
- Reproduzir somente depois de uma ação explícita do usuário.
- Interromper o áudio anterior antes de começar outro.
- Não reproduzir áudio se o usuário tiver desativado o som.
- Erros de carregamento ou reprodução não podem impedir a navegação.
- Usar volume moderado, atualmente `0.72`.

#### Estado padrão

O estado inicial deve ser:

```ts
{
  enabled: true,
  version: 'latest'
}
```

#### Persistência

Salvar as preferências usando `localStorage` com a chave:

```text
poketech:audio-preferences
```

Formato persistido:

```ts
{
  enabled: boolean,
  version: 'latest' | 'legacy'
}
```

Se o valor salvo estiver inválido, usar os padrões com segurança:

- `enabled: true`, exceto quando o valor salvo for explicitamente `false`.
- `version: 'latest'`, exceto quando o valor salvo for exatamente `'legacy'`.

### 10. Dock de áudio

Adicionar ou preservar uma dock compacta acima da busca, com aparência de equipamento físico.

Conteúdo esperado:

- Ícone de áudio.
- Rótulo `CRIES`.
- Botão `SOM ON` quando o som estiver ativado.
- Botão `SOM OFF` quando o som estiver desativado.
- Botão `ATUAL` quando a versão atual estiver selecionada.
- Botão `CLÁSSICO` quando a versão legacy estiver selecionada.

Comportamento:

- `SOM ON/OFF` alterna `enabled` e salva imediatamente no `localStorage`.
- `ATUAL/CLÁSSICO` alterna `version` e salva imediatamente no `localStorage`.
- Os botões devem ter `aria-label`, `title` e estados visuais compreensíveis.
- O som não deve tocar ao trocar a preferência; somente o próximo clique em um card usará a nova versão.
- Os controles devem ocupar pouco espaço e não competir com a busca.

### 11. Linguagem visual dos controles

Os controles de áudio devem parecer pequenos botões físicos de uma Pokédex clássica:

- Borda azul.
- Fundo compatível com o tema.
- Rótulos curtos em caixa alta.
- Ícones `Volume2` e `VolumeX` ou equivalentes.
- Hover com realce azul.
- Estado ativo facilmente identificável.
- Efeito de pressão no `:active`, como pequeno deslocamento vertical.
- Transições rápidas e discretas.
- Nenhuma animação contínua chamativa.

Exemplo de interação:

```css
.audioButton:active {
  transform: translateY(1px);
}
```

### 12. Microinterações

Preservar e importar microinterações sem exagero:

- Cards sobem levemente no hover.
- Imagem do Pokémon aumenta e gira alguns graus no hover.
- Ícone de navegação desloca alguns pixels no hover.
- Botões físicos respondem ao clique.
- Bordas e sombras reforçam o foco.
- Transições devem ser suaves e curtas.

Evitar:

- Confetes.
- Animações permanentes.
- Banners de sucesso grandes.
- Modais para cada cry.
- Sons automáticos.
- Excesso de texto explicativo.

### 13. Temas claro e escuro

Manter os dois temas existentes.

O tema claro deve preservar:

- Fundo claro.
- Cards claros.
- Bordas azuis.
- Texto escuro.
- Contraste suficiente.

O tema escuro deve preservar:

- Fundo profundo.
- Cards escuros com leve variação de superfície.
- Bordas azuis visíveis.
- Texto claro.
- Silhuetas pretas ainda distinguíveis por contorno, brilho ou contraste do container.

Não hardcodar cores que quebrem um dos temas sem necessidade. Preferir as variáveis CSS já existentes.

### 14. Responsividade

A experiência precisa funcionar em desktop, tablet e celular:

- Grid com número de colunas adaptável.
- Dock de áudio quebrando ou compactando em telas pequenas.
- Botões fáceis de tocar no mobile.
- Texto sem cortes.
- Imagens sem distorção.
- Painel lateral podendo se reorganizar abaixo ou acima do catálogo em telas estreitas.
- Preservar foco e acessibilidade por teclado.

### 15. Acessibilidade

Preservar ou adicionar:

- `aria-label` em controles sem texto suficiente.
- `title` nos estados de áudio e nos marcadores.
- Foco visível.
- Botões reais para ações.
- Links reais para navegação.
- `alt` apropriado nas imagens.
- Não depender somente de cor para indicar acerto, áudio ligado ou áudio desligado.

## Arquivos e responsabilidades esperadas

Organize a importação respeitando a estrutura existente:

- `src/pages/Pokedex/index.tsx`: estado da abertura, busca, ordenação, progresso e controles de áudio.
- `src/pages/Pokedex/styles.module.css`: layout da Pokédex, dock de áudio, botões físicos, responsividade e microinterações.
- `src/components/PokemonCard/index.tsx`: card, estados `matched`/`undiscovered`/`similar`, reprodução do cry e navegação.
- `src/components/PokemonCard/styles.module.css`: silhueta, sombra da silhueta, hover, foco, bordas e destaque de acerto.
- `src/services/pokemonCry.ts`: URLs dos cries, preferência, persistência, mute e interrupção do áudio anterior.
- `src/services/pokemonService.ts`: catálogo, acertos locais, busca e ordenação.
- `src/services/pokedexSorter.ts`: integração opcional com sorter do backend e fallback local.
- `src/pages/Principal/index.tsx`: jogo de adivinhação e registro dos Pokémon acertados.
- `plan.md`: manter as decisões de UX/UI documentadas.
- `TODO.md`: manter concluídos os itens de grid, acertos, cries e controles nostálgicos; não marcar backend ou testes como concluídos sem implementação real.

## Critérios de aceitação

Considere a importação concluída somente quando:

- A Pokédex abre a partir da tela fechada por ação do usuário.
- O catálogo dos 151 Pokémon aparece em grid responsivo.
- Busca e ordenação funcionam sem recarregar a página.
- O modo `SIM` possui integração opcional com fallback local.
- Pokémon não descobertos aparecem como silhuetas pretas com sombra própria.
- Pokémon acertados aparecem coloridos, com confirmação visual.
- O progresso por bolinhas é mantido.
- O tema claro/escuro continua funcionando.
- O clique no card reproduz o cry e navega para detalhes.
- O som não toca automaticamente.
- `SOM ON/OFF` funciona e persiste.
- `ATUAL/CLÁSSICO` funciona e persiste.
- O áudio anterior é interrompido antes do próximo.
- Falhas de áudio não quebram a navegação.
- A interface não fica poluída com textos, banners ou modais.
- O layout continua utilizável em telas pequenas.
- `npm run lint` e `npm run build` passam.

## Restrições importantes

- Não substituir React, TypeScript, Vite, CSS Modules ou `lucide-react` sem necessidade.
- Não remover as silhuetas dos Pokémon não acertados.
- Não remover o tema claro/escuro.
- Não adicionar autoplay.
- Não criar uma trilha sonora contínua.
- Não esconder os controles de áudio atrás de um modal.
- Não publicar na Vercel automaticamente.
- Não alterar a branch de trabalho sem autorização.
- Não considerar uma funcionalidade do backend concluída apenas porque existe um fallback local.
- Reutilizar imagens, rotas, serviços e variáveis CSS existentes antes de criar duplicações.
- Fazer mudanças incrementais e manter a estrutura do código limpa.

## Instrução final

Implemente ou importe essa experiência usando os arquivos e serviços existentes. Antes de alterar qualquer comportamento, inspecione o código atual e preserve o que já funciona. Se alguma integração do backend ainda não existir, mantenha o fallback local e documente o ponto de conexão. Ao final, apresente um resumo objetivo das alterações, os arquivos modificados e o resultado de `npm run lint` e `npm run build`.
