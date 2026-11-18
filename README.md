# sofias-capacitacao

Protótipo da Sofias, um PWA de capacitação online e offline para jovens mulheres de 15 a 25 anos que não estudam nem trabalham. Cobre o fluxo da usuária (cadastro, teste vocacional, trilha gamificada, prática, certificado) e o painel da empresa parceira. Usa Next.js e APIs públicas abertas do IBGE.

Demo: https://dudabarbozat.github.io/sofias-capacitacao/

Portfólio pessoal. Projeto criado entre 2020 e 2023 e reimplementado em 2026 com Next.js e APIs públicas.

## Contexto

Problema: jovens mulheres na condição "nem-nem" (NEET) têm mais dificuldade de entrar no mercado de trabalho por causa de maternidade, trabalho doméstico e carga mental.

Proposta original: um PWA gratuito para as usuárias. Após o cadastro, um teste vocacional e psicocognitivo direciona para uma trilha de capacitações oferecidas por empresas parceiras, com artigos, podcasts, vídeo-aulas curtas, flash cards e testes, gamificação por níveis e certificado digital ao final. Vídeos e podcasts podem ser baixados para uso offline. Os dados da jornada ficam disponíveis para as empresas, que acompanham métricas e divulgam vagas. IA aparecia só no roadmap, para organizar dados de desempenho e sugerir boas práticas. Receita prevista: capacitações vendidas às empresas, eventos patrocinados e anúncios antes dos vídeos.

Equipe:

- Eduarda Barboza (design e marketing)
- Bianca Medeiros (desenvolvimento mobile e front-end)
- Jhennifer Pimentel (marketing)
- Paulo Carmo (UX e design)
- Rodrigo Timóteo (desenvolvimento back-end e negócios)

Números usados no pitch:

| Indicador | Valor |
|---|---|
| Jovens NEET no mundo | 267 milhões |
| Mulheres entre elas | 181 milhões |
| América Latina | 28,9% contra 14,6% |
| Pesquisa própria | 77 respostas em cerca de 24h |
| Custo mensal | R$ 47.100,00 |
| Receita mensal | R$ 38.000,00 |
| Saldo em 5 anos | R$ 119.232,16 (positivo a partir do 4º ano) |

## Stack

- Next.js 15 (App Router, `output: "export"`), React 19, TypeScript estrito.
- CSS Modules e `globals.css` com os tokens da identidade do pitch.
- Fontes via `next/font/google`: Montserrat e Ubuntu (app), Poppins (painel), League Spartan (certificado).
- Chart.js com react-chartjs-2 no painel.
- Service worker próprio (`public/sw.js`) e `manifest.webmanifest`: o app é instalável e abre sem internet.
- Sem backend. Estado em `localStorage`; o botão "Restaurar dados de exemplo" volta à conta de exemplo.

## Telas

- `/` sem conta: "Escolha uma área para criar conta" (mockup do pitch). Escolher uma área, o teste ou a localização abre o cadastro: nome, estado e município do IBGE, com validação inline. "acessar" entra com a conta de exemplo.
- `/` com conta: "Navegue" (mockup do pitch). Orientação curta na primeira visita, botão "continue de onde parou", busca, recomendados, atalhos por formato e eventos patrocinados com inscrição.
- `/teste/`: 10 perguntas, uma por vez, com barra de progresso.
- `/resultado/`: área recomendada, explicação ("por que essa área" e próximos passos) e a regra de pontuação visível.
- `/estudos/` "Estudos" (mockup do pitch): módulo atual, nível e XP, módulos liberados em sequência com download offline real, sugestões de outras áreas.
- `/modulo/<id>/`: vídeo-aula e podcast, leitura, flash cards, teste e a aba "Praticar" (revisão extra e pergunta aberta com retorno automático).
- `/conteudos/<formato>/`: podcasts, apostilas, artigos, vídeos e eventos.
- `/certificado/`: certificado com código de verificação, pronto para imprimir ou salvar em PDF.
- `/offline/`: servida pelo service worker quando a página pedida não foi baixada.
- `/empresa/`: painel da empresa (mockup do pitch). Filtros de região e período; gráfico de usuárias ativas; mapa por estado com a malha do IBGE, colorido pela aderência, com tabela alternativa; médias de uso e duração; vagas com candidatas compatíveis; perfis anonimizados; publicação de vaga; exportação CSV da aderência por UF e das jornadas.

Regra do teste: cada opção soma pontos a uma ou mais áreas (Atendimento e vendas, Rotinas administrativas, Suporte de TI); as duas perguntas de raciocínio só pontuam quando certas. Vence a maior soma; empate é decidido pela pergunta 8 e, se ela não resolver, pela ordem fixa das áreas. As perguntas 9 e 10 definem a meta diária e se o uso offline é sugerido. XP: leitura +20, flash cards +30, cada acerto +15, teste sem erros +20; cinco níveis com cortes em 0, 60, 130, 200 e 260 XP.

## APIs

| API | Uso |
|---|---|
| [IBGE Localidades](https://servicodados.ibge.gov.br/api/docs/localidades) `/api/v1/localidades/estados` e `/estados/{UF}/municipios` | Estados e municípios do cadastro |
| [IBGE Malhas v3](https://servicodados.ibge.gov.br/api/docs/malhas?versao=3) `/api/v3/malhas/paises/BR?intrarregiao=UF` (GeoJSON, qualidade mínima) | Mapa por estado do painel |

As duas respondem com `Access-Control-Allow-Origin: *` e são chamadas direto do navegador, com timeout. Se a lista de estados falhar, o cadastro usa uma lista guardada no app e avisa; se os municípios falharem, aparece "tentar de novo" e o campo aceita texto livre; se a malha falhar, o painel mostra o erro com nova tentativa e os números seguem na tabela.

## Regras que geram texto

Nada aqui usa IA; são regras fixas em `src/lib/regras.ts`:

- "Por que essa área": cita as respostas que mais pontuaram para a área vencedora e monta os próximos passos com a meta diária e a situação de internet informadas no teste.
- Revisão extra: inverte os flash cards do módulo (definição na frente, termo no verso) e monta questões de associação com os termos do módulo.
- Pergunta aberta: compara a resposta com pontos-chave fixos de cada módulo (`abertas` em `src/lib/conteudo.ts`) e lista o que apareceu e o que faltou.

## Offline

O service worker guarda o app na primeira visita (rede primeiro para páginas, cache primeiro para `/_next/static`). "Baixar" na tela de estudos salva a página do módulo, o payload de navegação e os scripts dela na Cache Storage; sem internet, esses módulos abrem normalmente e o resto cai em `/offline/`. Para testar: abra o app, baixe um módulo, desligue a rede no DevTools e recarregue. O service worker só é registrado no build de produção.

## O que é simulado

- Mídias: não há arquivos de vídeo ou podcast; a reprodução e o anúncio de 5 segundos antes do vídeo são simulados.
- Empresas, vagas, eventos, usuárias e todos os números do painel são fictícios, gerados por função determinística com semente fixa. A linha "Você (demo)" vem do progresso salvo no navegador.
- Inscrição em eventos e verificação pública do certificado (o código é um hash do nome, da trilha e da data).
- Não há backend, autenticação nem envio de dados; as únicas chamadas externas são ao IBGE.

## Identidade visual

Cores, fontes e logo vêm do pitch. O logo em `public/img/` foi extraído do PDF; favicon e ícones do PWA são recortes dele.

- Slides: roxo `#4e138b`, roxo escuro `#4f0f61`, amarelo `#ffc759`, lilás `#a699b4`, creme `#f7f4eb`.
- Mockups do app: fundo `#f4f2f9`, cards `#7539b8` a `#6934a2`, texto `#03002f`, barra inferior `#ebe2fe`.
- Mockup do painel: linha `#17003d`, amarelo `#ffc346`.

Diferenças em relação aos mockups: ilustrações de banco de imagem viraram formas simples em SVG; fotos e logos de terceiros viraram nomes fictícios; números em amarelo sobre fundo claro usam `#9a6a00` e os botões amarelos usam seta escura, por contraste.

## Como rodar

```
npm ci
npm run dev
```

Acesse http://localhost:3000/. Para testar o build estático com o mesmo prefixo do GitHub Pages:

```
NEXT_PUBLIC_BASE_PATH=/sofias-capacitacao npm run build
mkdir -p teste && cp -r out teste/sofias-capacitacao
python -m http.server 8000 --directory teste
```

e acesse http://localhost:8000/sofias-capacitacao/. `npm run typecheck` roda o `tsc --noEmit`.

## Publicação

`.github/workflows/pages.yml` publica no GitHub Pages a cada push na `main`: `npm ci`, `npm run build` com `NEXT_PUBLIC_BASE_PATH=/sofias-capacitacao`, `out/.nojekyll` e deploy com `actions/deploy-pages`. Em Settings > Pages, a fonte precisa ser "GitHub Actions".

## Estrutura

```
.
├── .github/workflows/pages.yml
├── public/
│   ├── img/                logo, símbolo, favicon e ícones do PWA
│   ├── manifest.webmanifest
│   └── sw.js               service worker
├── src/
│   ├── app/
│   │   ├── (app)/          rotas do app da usuária (layout com a moldura de celular)
│   │   ├── empresa/        painel da empresa
│   │   ├── globals.css     tokens e componentes compartilhados
│   │   └── layout.tsx      fontes, metadados, manifest
│   ├── components/
│   │   ├── telas/          uma tela por arquivo
│   │   ├── painel/         painel, gráfico e mapa por UF
│   │   └── ...             moldura, ícones, diálogo, avisos
│   └── lib/
│       ├── conteudo.ts     trilhas, módulos, teste, níveis (fictícios)
│       ├── empresas.ts     empresas, UFs e dados do painel (fictícios)
│       ├── estado.ts       localStorage, pontuação, XP
│       ├── ibge.ts         cliente das APIs do IBGE
│       ├── regras.ts       explicação do resultado, revisão extra, retorno da resposta aberta
│       ├── formatos.ts     formatos de conteúdo
│       ├── offline.ts      download de módulos e service worker
│       └── csv.ts          exportação CSV
├── next.config.ts
├── package.json
├── LICENSE
└── README.md
```

## Licença

MIT. Ver [LICENSE](LICENSE).
