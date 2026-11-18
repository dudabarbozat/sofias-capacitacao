/* Conteúdo fictício da demo: trilhas, módulos, teste vocacional e níveis.
   Nenhuma empresa, pessoa ou número aqui é real. */

export type TrilhaId = "A" | "D" | "T";
export type Ilustracao = "lampada" | "conversa" | "grafico" | "blocos" | "engrenagem" | "escudo";

export interface Card { frente: string; verso: string }
export interface Questao { pergunta: string; opcoes: string[]; certa: number; explicacao: string }
export interface Midia { titulo: string; minutos: number; mb: number }
export interface Modulo {
  id: string;
  titulo: string;
  resumo: string;
  minutos: number;
  video: Midia;
  podcast: Midia;
  artigo: string[];
  cards: Card[];
  quiz: Questao[];
}
export interface Trilha {
  id: TrilhaId;
  nome: string;
  parceira: string;
  descricao: string;
  cargaHoras: number;
  modulos: Modulo[];
}
export interface Opcao { texto: string; pontos?: Partial<Record<TrilhaId, number>>; meta?: number; offline?: boolean }
export interface Pergunta { texto: string; tipo: "vocacional" | "raciocínio" | "rotina"; opcoes: Opcao[] }
export interface Nivel { n: number; nome: string; xp: number }
export interface Evento { id: string; tipo: string; titulo: string; data: string; patrocinio: string }

export const trilhas: Record<TrilhaId, Trilha> = {
  A: {
    id: 'A',
    nome: 'Atendimento e vendas',
    parceira: 'Rede Ponto Certo Varejo',
    descricao: 'Comunicação com clientes, resolução de problemas e noções de metas de venda. Prepara para vagas de atendente, operadora de caixa e vendedora.',
    cargaHoras: 12,
    modulos: [
      {
        id: 'a1',
        titulo: 'Conversar com o cliente',
        resumo: 'Escuta ativa, linguagem clara e como abrir um atendimento.',
        minutos: 25,
        video: { titulo: 'Os primeiros 30 segundos do atendimento', minutos: 4, mb: 38 },
        podcast: { titulo: 'Conversa: o que eu aprendi no balcão', minutos: 12, mb: 11 },
        artigo: [
          'Atender bem começa antes de falar. Olhar para a pessoa, cumprimentar e esperar ela terminar a frase já mostram que você está disponível. Isso se chama escuta ativa: prestar atenção no que é dito e no que fica nas entrelinhas.',
          'Depois de ouvir, confirme o que entendeu com as suas palavras: "Então você quer trocar o tamanho, é isso?". Essa confirmação evita retrabalho e faz o cliente se sentir respeitado.',
          'Prefira frases curtas e evite termos internos da empresa. Se não souber a resposta, diga que vai verificar e volte com a informação. Prometer o que não pode cumprir custa mais caro do que dizer "vou confirmar".'
        ],
        cards: [
          { frente: 'Escuta ativa', verso: 'Prestar atenção total ao que a pessoa diz, sem interromper, e confirmar o que entendeu.' },
          { frente: 'Confirmação', verso: 'Repetir o pedido com suas palavras para checar se entendeu certo.' },
          { frente: 'Quando não souber', verso: 'Diga que vai verificar, combine um prazo e volte com a resposta.' }
        ],
        quiz: [
          { pergunta: 'Um cliente explica um problema longo. O que fazer primeiro?', opcoes: ['Interromper para ganhar tempo', 'Ouvir até o fim e confirmar o que entendeu', 'Chamar a gerência'], certa: 1, explicacao: 'Ouvir até o fim e confirmar evita respostas para a pergunta errada.' },
          { pergunta: 'Você não sabe se o produto tem garantia. A melhor resposta é:', opcoes: ['"Tem sim, pode ficar tranquila."', '"Não sei."', '"Vou confirmar e já te respondo."'], certa: 2, explicacao: 'Assumir o compromisso de verificar é honesto e mantém a confiança.' }
        ]
      },
      {
        id: 'a2',
        titulo: 'Quando o cliente está insatisfeito',
        resumo: 'Como receber uma reclamação sem levar para o lado pessoal.',
        minutos: 30,
        video: { titulo: 'Reclamação não é ataque', minutos: 5, mb: 46 },
        podcast: { titulo: 'Três atendimentos difíceis e o que funcionou', minutos: 15, mb: 14 },
        artigo: [
          'Uma reclamação quase sempre é sobre o problema, não sobre você. Respirar antes de responder e manter o tom de voz baixo ajudam a conversa a não escalar.',
          'Use a sequência reconhecer, resolver, registrar. Reconheça o incômodo ("entendo que isso atrapalhou seu dia"), apresente o que pode ser feito agora e registre o caso para que não se repita.',
          'Se a solução não estiver ao seu alcance, explique o próximo passo e quem vai cuidar disso. O cliente aceita esperar quando sabe o que vai acontecer.'
        ],
        cards: [
          { frente: 'Reconhecer', verso: 'Mostrar que entendeu o incômodo antes de propor solução.' },
          { frente: 'Resolver', verso: 'Oferecer o que pode ser feito agora, com clareza.' },
          { frente: 'Registrar', verso: 'Anotar o caso para a equipe evitar que se repita.' }
        ],
        quiz: [
          { pergunta: 'Qual é a ordem recomendada diante de uma reclamação?', opcoes: ['Resolver, registrar, reconhecer', 'Reconhecer, resolver, registrar', 'Registrar, reconhecer, resolver'], certa: 1, explicacao: 'Primeiro a pessoa precisa se sentir ouvida; depois vem a solução e o registro.' },
          { pergunta: 'A solução depende de outro setor. O que dizer?', opcoes: ['Que não é com você', 'Qual é o próximo passo e quem vai cuidar', 'Que vai resolver hoje, mesmo sem saber'], certa: 1, explicacao: 'Explicar o caminho reduz a ansiedade de quem espera.' }
        ]
      },
      {
        id: 'a3',
        titulo: 'Metas e indicadores de venda',
        resumo: 'Ticket médio, conversão e como ler a própria meta.',
        minutos: 30,
        video: { titulo: 'Ticket médio em 4 minutos', minutos: 4, mb: 35 },
        podcast: { titulo: 'Meta não é pressão: como acompanhar a sua', minutos: 11, mb: 10 },
        artigo: [
          'Toda loja acompanha alguns números. Os mais comuns são o ticket médio (quanto cada cliente gasta, em média) e a taxa de conversão (quantas pessoas que entraram compraram).',
          'Exemplo: em um dia, 40 pessoas foram atendidas e 10 compraram, somando R$ 1.200. A conversão foi de 25% e o ticket médio, R$ 120.',
          'Saber ler esses números ajuda a conversar com a liderança e a perceber o que funciona no seu atendimento, como sugerir um item complementar no momento certo.'
        ],
        cards: [
          { frente: 'Ticket médio', verso: 'Valor total vendido dividido pelo número de vendas.' },
          { frente: 'Conversão', verso: 'Vendas divididas por atendimentos, em porcentagem.' },
          { frente: 'Venda complementar', verso: 'Sugerir um item que combina com o que o cliente já escolheu.' }
        ],
        quiz: [
          { pergunta: 'Foram 8 vendas somando R$ 640. Qual o ticket médio?', opcoes: ['R$ 64', 'R$ 80', 'R$ 640'], certa: 1, explicacao: 'R$ 640 divididos por 8 vendas dão R$ 80.' },
          { pergunta: '50 atendimentos e 10 vendas. Qual a conversão?', opcoes: ['20%', '10%', '50%'], certa: 0, explicacao: '10 de 50 é 20%.' }
        ]
      }
    ]
  },
  D: {
    id: 'D',
    nome: 'Rotinas administrativas',
    parceira: 'Contábil Ipê Serviços',
    descricao: 'Organização de documentos, planilhas, contas a pagar e receber e comunicação por e-mail. Prepara para auxiliar administrativa e recepcionista.',
    cargaHoras: 14,
    modulos: [
      {
        id: 'd1',
        titulo: 'Documentos e planilhas',
        resumo: 'Como nomear arquivos, organizar pastas e montar uma planilha simples.',
        minutos: 30,
        video: { titulo: 'Uma planilha que qualquer pessoa entende', minutos: 5, mb: 44 },
        podcast: { titulo: 'Organização que dura mais de uma semana', minutos: 13, mb: 12 },
        artigo: [
          'Um arquivo bem nomeado economiza minutos todos os dias. Um padrão simples funciona: data no formato ano-mês-dia, assunto e versão. Exemplo: 2026-03-10_contrato-fornecedor_v2.',
          'Em planilhas, cada coluna deve guardar um tipo de informação e cada linha, um registro. Evite mesclar células e deixe a primeira linha só para os títulos.',
          'Antes de enviar uma planilha, confira totais, ordene os dados e congele a linha de títulos. Quem recebe vai agradecer.'
        ],
        cards: [
          { frente: 'Data no nome do arquivo', verso: 'Use ano-mês-dia para os arquivos ficarem em ordem.' },
          { frente: 'Uma coluna, um tipo', verso: 'Não misture datas, nomes e valores na mesma coluna.' },
          { frente: 'Congelar painéis', verso: 'Mantém os títulos visíveis ao rolar a planilha.' }
        ],
        quiz: [
          { pergunta: 'Qual nome de arquivo segue o padrão recomendado?', opcoes: ['contrato final AGORA.pdf', '2026-03-10_contrato-fornecedor_v2.pdf', 'doc1.pdf'], certa: 1, explicacao: 'Data, assunto e versão deixam o arquivo fácil de achar.' },
          { pergunta: 'Na planilha, o que deve ficar na primeira linha?', opcoes: ['Os títulos das colunas', 'O total geral', 'Observações'], certa: 0, explicacao: 'A primeira linha com títulos permite filtrar e ordenar.' }
        ]
      },
      {
        id: 'd2',
        titulo: 'Contas a pagar e a receber',
        resumo: 'Fluxo de caixa básico, vencimentos e conciliação.',
        minutos: 35,
        video: { titulo: 'Fluxo de caixa sem mistério', minutos: 6, mb: 52 },
        podcast: { titulo: 'O dia a dia do financeiro de uma empresa pequena', minutos: 14, mb: 13 },
        artigo: [
          'Contas a pagar são compromissos da empresa: aluguel, fornecedores, impostos. Contas a receber são valores que clientes devem à empresa. As duas listas juntas formam o fluxo de caixa.',
          'Organize as contas por data de vencimento e confira toda semana o que vence nos próximos dias. Atraso gera juros e multa.',
          'Conciliar é comparar o que está na planilha com o extrato do banco. Se os valores não batem, algo foi lançado errado ou ficou de fora.'
        ],
        cards: [
          { frente: 'Contas a pagar', verso: 'O que a empresa deve: fornecedores, aluguel, impostos.' },
          { frente: 'Contas a receber', verso: 'O que clientes devem à empresa.' },
          { frente: 'Conciliação', verso: 'Comparar os lançamentos com o extrato bancário.' }
        ],
        quiz: [
          { pergunta: 'Um boleto de fornecedor entra em qual lista?', opcoes: ['Contas a receber', 'Contas a pagar', 'Nenhuma'], certa: 1, explicacao: 'É um valor que a empresa deve pagar.' },
          { pergunta: 'A planilha mostra R$ 5.000 e o extrato, R$ 4.800. O que fazer?', opcoes: ['Ajustar a planilha para R$ 4.800', 'Procurar o lançamento que não bate', 'Ignorar a diferença'], certa: 1, explicacao: 'A conciliação serve justamente para achar a origem da diferença.' }
        ]
      },
      {
        id: 'd3',
        titulo: 'E-mail e comunicação interna',
        resumo: 'Escrever mensagens claras e registrar combinados.',
        minutos: 25,
        video: { titulo: 'Assunto, pedido e prazo', minutos: 4, mb: 33 },
        podcast: { titulo: 'Mensagens que não geram dúvida', minutos: 10, mb: 9 },
        artigo: [
          'Um bom e-mail de trabalho cabe na tela do celular. O assunto diz do que se trata, o primeiro parágrafo diz o que você precisa e até quando.',
          'Depois de uma reunião ou ligação, mande um resumo curto com o que foi combinado. Isso evita o "eu achei que era outra coisa".',
          'Antes de enviar, releia: o nome está certo? O anexo foi junto? O prazo está claro?'
        ],
        cards: [
          { frente: 'Assunto', verso: 'Resume o tema em poucas palavras. Ex.: "Nota fiscal de março pendente".' },
          { frente: 'Pedido e prazo', verso: 'Diga o que precisa e até quando, já no começo.' },
          { frente: 'Resumo do combinado', verso: 'Mensagem curta após reunião com decisões e responsáveis.' }
        ],
        quiz: [
          { pergunta: 'Onde deve aparecer o pedido principal do e-mail?', opcoes: ['No final, depois do contexto', 'No começo da mensagem', 'Só no assunto'], certa: 1, explicacao: 'Quem lê no celular precisa entender o pedido logo de cara.' },
          { pergunta: 'Para que serve o resumo depois da reunião?', opcoes: ['Registrar decisões e responsáveis', 'Mostrar que você estava lá', 'Substituir a reunião'], certa: 0, explicacao: 'O registro evita interpretações diferentes do que foi decidido.' }
        ]
      }
    ]
  },
  T: {
    id: 'T',
    nome: 'Suporte de TI',
    parceira: 'Nuvem Sul Tecnologia',
    descricao: 'Fundamentos de computadores e redes, atendimento de chamados e segurança digital. Prepara para analista de suporte júnior e help desk.',
    cargaHoras: 16,
    modulos: [
      {
        id: 't1',
        titulo: 'Como um computador funciona',
        resumo: 'Hardware, software e rede, sem jargão.',
        minutos: 35,
        video: { titulo: 'Por dentro do computador', minutos: 6, mb: 55 },
        podcast: { titulo: 'Primeiro emprego em suporte', minutos: 14, mb: 13 },
        artigo: [
          'Hardware é a parte física: processador, memória, disco. Software são os programas, do sistema operacional aos aplicativos. Rede é o que conecta os aparelhos entre si e à internet.',
          'Quando algo não funciona, pergunte em qual dessas camadas está o problema. A tela não liga? Provavelmente hardware ou energia. O programa fecha sozinho? Software. Nada carrega? Rede.',
          'Esse raciocínio por camadas é a base do suporte técnico e evita trocar peças sem necessidade.'
        ],
        cards: [
          { frente: 'Hardware', verso: 'Componentes físicos: processador, memória, disco, cabos.' },
          { frente: 'Software', verso: 'Programas, incluindo o sistema operacional.' },
          { frente: 'Rede', verso: 'Conexão entre aparelhos e com a internet.' }
        ],
        quiz: [
          { pergunta: 'Todos os sites param de abrir, mas o computador funciona. Camada provável?', opcoes: ['Hardware', 'Rede', 'Teclado'], certa: 1, explicacao: 'Se nada carrega e o resto funciona, a suspeita é a conexão.' },
          { pergunta: 'O sistema operacional é:', opcoes: ['Hardware', 'Software', 'Rede'], certa: 1, explicacao: 'É o software principal que gerencia o computador.' }
        ]
      },
      {
        id: 't2',
        titulo: 'Atendimento de chamados',
        resumo: 'Registrar, priorizar e resolver pedidos de suporte.',
        minutos: 30,
        video: { titulo: 'Anatomia de um bom chamado', minutos: 5, mb: 41 },
        podcast: { titulo: 'Help desk: rotina e prioridades', minutos: 12, mb: 11 },
        artigo: [
          'Chamado é o registro de um pedido de ajuda. Um bom chamado diz quem pediu, o que aconteceu, desde quando e o que já foi tentado.',
          'Prioridade depende de impacto e urgência. Um caixa parado numa loja aberta é mais urgente do que uma impressora de reserva com defeito.',
          'O prazo combinado para responder ou resolver se chama SLA. Cumprir o SLA, ou avisar antes de estourar, é o que constrói confiança na equipe de suporte.'
        ],
        cards: [
          { frente: 'Chamado', verso: 'Registro de um pedido de suporte com contexto e histórico.' },
          { frente: 'Prioridade', verso: 'Combinação de impacto (quantos afeta) e urgência (quanto tempo pode esperar).' },
          { frente: 'SLA', verso: 'Prazo combinado para responder ou resolver um chamado.' }
        ],
        quiz: [
          { pergunta: 'Qual chamado deve ser atendido primeiro?', opcoes: ['Troca de papel de parede', 'Sistema de vendas fora do ar na loja', 'Mouse reserva com defeito'], certa: 1, explicacao: 'Alto impacto e alta urgência vêm primeiro.' },
          { pergunta: 'SLA significa, na prática:', opcoes: ['Prazo combinado de atendimento', 'Tipo de cabo de rede', 'Senha do administrador'], certa: 0, explicacao: 'É o acordo de prazo entre suporte e quem pede ajuda.' }
        ]
      },
      {
        id: 't3',
        titulo: 'Segurança digital básica',
        resumo: 'Senhas, golpes por mensagem e cuidados com dados.',
        minutos: 30,
        video: { titulo: 'Como reconhecer um golpe por mensagem', minutos: 5, mb: 43 },
        podcast: { titulo: 'Dados pessoais no trabalho', minutos: 11, mb: 10 },
        artigo: [
          'A maior parte dos ataques começa com uma mensagem convincente: um link urgente, um boleto, um pedido de código. Desconfie de pressa e de pedidos fora do padrão.',
          'Senhas fortes são longas. Uma frase com quatro palavras sem relação é mais segura e mais fácil de lembrar do que uma palavra curta cheia de símbolos. Ative a verificação em duas etapas sempre que possível.',
          'Dados de clientes e colegas são responsabilidade de quem tem acesso. Não envie planilhas com dados pessoais por aplicativos pessoais.'
        ],
        cards: [
          { frente: 'Phishing', verso: 'Mensagem falsa que tenta roubar senhas ou dados.' },
          { frente: 'Verificação em duas etapas', verso: 'Pede um segundo código além da senha.' },
          { frente: 'Senha forte', verso: 'Longa, única para cada serviço, de preferência uma frase.' }
        ],
        quiz: [
          { pergunta: 'Chega uma mensagem do "banco" pedindo o código recebido por SMS. Você:', opcoes: ['Envia, porque parece oficial', 'Não envia e confirma pelo canal oficial', 'Encaminha para colegas'], certa: 1, explicacao: 'Bancos não pedem códigos por mensagem.' },
          { pergunta: 'Qual senha é mais segura?', opcoes: ['Ab#1', 'janela-cacto-ponte-azul', '12345678'], certa: 1, explicacao: 'Comprimento pesa mais do que símbolos.' }
        ]
      }
    ]
  }
};

export const teste: Pergunta[] = [
  { texto: 'Num dia de trabalho, o que te deixaria mais satisfeita?', tipo: 'vocacional', opcoes: [
    { texto: 'Ajudar alguém a resolver um problema conversando', pontos: { A: 2 } },
    { texto: 'Deixar tudo organizado e em dia', pontos: { D: 2 } },
    { texto: 'Descobrir por que algo não funciona e consertar', pontos: { T: 2 } }
  ] },
  { texto: 'Um aparelho deu problema em casa. Você costuma:', tipo: 'vocacional', opcoes: [
    { texto: 'Pedir ajuda e explicar com detalhes o que aconteceu', pontos: { A: 1 } },
    { texto: 'Procurar o manual e seguir passo a passo', pontos: { D: 1, T: 1 } },
    { texto: 'Pesquisar e tentar resolver sozinha', pontos: { T: 2 } }
  ] },
  { texto: 'Com qual tarefa você se sente mais à vontade?', tipo: 'vocacional', opcoes: [
    { texto: 'Falar com pessoas que ainda não conheço', pontos: { A: 2 } },
    { texto: 'Conferir números e listas', pontos: { D: 2 } },
    { texto: 'Aprender a usar um aplicativo novo', pontos: { T: 2 } }
  ] },
  { texto: 'Em um trabalho em grupo, você costuma ser quem:', tipo: 'vocacional', opcoes: [
    { texto: 'Puxa a conversa e mantém todo mundo junto', pontos: { A: 2 } },
    { texto: 'Divide as tarefas e controla os prazos', pontos: { D: 2 } },
    { texto: 'Resolve a parte mais técnica', pontos: { T: 2 } }
  ] },
  { texto: 'Qual número continua a sequência: 2, 4, 8, 16, ...', tipo: 'raciocínio', opcoes: [
    { texto: '24', pontos: {} },
    { texto: '32', pontos: { T: 1, D: 1 } },
    { texto: '18', pontos: {} }
  ] },
  { texto: 'Uma compra custou R$ 37 e a cliente pagou com R$ 50. Qual é o troco?', tipo: 'raciocínio', opcoes: [
    { texto: 'R$ 23', pontos: {} },
    { texto: 'R$ 17', pontos: {} },
    { texto: 'R$ 13', pontos: { A: 1, D: 1 } }
  ] },
  { texto: 'Em que tipo de lugar você se imagina trabalhando?', tipo: 'vocacional', opcoes: [
    { texto: 'Loja ou balcão, com movimento', pontos: { A: 2 } },
    { texto: 'Escritório, com rotina previsível', pontos: { D: 2 } },
    { texto: 'Em casa ou onde der, no computador', pontos: { T: 2 } }
  ] },
  { texto: 'O que você quer desenvolver primeiro?', tipo: 'vocacional', opcoes: [
    { texto: 'Falar com segurança', pontos: { A: 2 } },
    { texto: 'Organização e planilhas', pontos: { D: 2 } },
    { texto: 'Lógica e tecnologia', pontos: { T: 2 } }
  ] },
  { texto: 'Quanto tempo por dia você consegue estudar, sendo realista?', tipo: 'rotina', opcoes: [
    { texto: 'Uns 15 minutos', meta: 15 },
    { texto: 'Por volta de 30 minutos', meta: 30 },
    { texto: 'Uma hora ou mais', meta: 60 }
  ] },
  { texto: 'Como é o seu acesso à internet?', tipo: 'rotina', opcoes: [
    { texto: 'Wi-Fi em casa, funciona bem', offline: false },
    { texto: 'Só no celular, com pacote de dados', offline: true },
    { texto: 'Instável ou só em alguns lugares', offline: true }
  ] }
];

export const niveis: Nivel[] = [
  { n: 1, nome: 'Primeiros passos', xp: 0 },
  { n: 2, nome: 'Em movimento', xp: 60 },
  { n: 3, nome: 'Constância', xp: 130 },
  { n: 4, nome: 'Domínio', xp: 200 },
  { n: 5, nome: 'Pronta para a vaga', xp: 260 }
];

export const eventos: Evento[] = [
  { id: 'e1', tipo: 'bate-papo', titulo: 'Posições de liderança', data: '26/11', patrocinio: 'Rede Ponto Certo Varejo' },
  { id: 'e2', tipo: 'workshop', titulo: 'Planilhas na prática', data: '03/12', patrocinio: 'Contábil Ipê Serviços' },
  { id: 'e3', tipo: 'aula especial', titulo: 'Primeiros passos em nuvem', data: '10/12', patrocinio: 'Nuvem Sul Tecnologia' }
];

export const divulgacao: { tipo: string; nome: string }[] = [
  { tipo: 'Instituição', nome: 'Instituto Recomeço' },
  { tipo: 'Organização', nome: 'Coletivo Elas Trabalham' },
  { tipo: 'Governo', nome: 'Secretaria Municipal de Emprego' },
  { tipo: 'Associação', nome: 'Associação Vizinhas' }
];

export const ordemTrilhas: TrilhaId[] = ["A", "D", "T"];

export const xpRegras = { artigo: 20, cards: 30, acerto: 15, quizCompleto: 20 } as const;

export const ilustracoes: Record<string, Ilustracao> = { a1: "conversa", a2: "lampada", a3: "grafico", d1: "blocos", d2: "grafico", d3: "conversa", t1: "engrenagem", t2: "lampada", t3: "escudo" };
export const ilustracaoArea: Record<TrilhaId, Ilustracao> = { A: "conversa", D: "grafico", T: "engrenagem" };

/* Pergunta aberta de cada módulo. Os pontos-chave servem ao retorno automático da resposta. */
export const abertas: Record<string, { pergunta: string; pontosChave: { termo: string; ideia: string }[] }> = {
  a1: { pergunta: "Um cliente chega irritado porque esperou na fila. Como você começaria o atendimento?", pontosChave: [{ termo: "escut", ideia: "ouvir sem interromper" }, { termo: "confirm", ideia: "confirmar o que entendeu" }, { termo: "desculp", ideia: "reconhecer a espera" }] },
  a2: { pergunta: "Descreva, em poucas linhas, como você lidaria com uma reclamação que não pode resolver sozinha.", pontosChave: [{ termo: "reconhe", ideia: "reconhecer o incômodo" }, { termo: "próximo passo", ideia: "explicar o próximo passo" }, { termo: "regist", ideia: "registrar o caso" }] },
  a3: { pergunta: "Explique para uma colega o que é ticket médio e por que ele importa.", pontosChave: [{ termo: "divid", ideia: "dividir o total pelo número de vendas" }, { termo: "média", ideia: "falar em média por cliente" }, { termo: "complement", ideia: "relacionar com venda complementar" }] },
  d1: { pergunta: "Como você organizaria a pasta de documentos de uma pequena empresa?", pontosChave: [{ termo: "data", ideia: "usar data no nome" }, { termo: "pasta", ideia: "separar por pastas" }, { termo: "vers", ideia: "controlar versões" }] },
  d2: { pergunta: "O saldo da planilha não bate com o extrato do banco. O que você faria?", pontosChave: [{ termo: "concili", ideia: "conciliar lançamento a lançamento" }, { termo: "extrato", ideia: "comparar com o extrato" }, { termo: "lançamento", ideia: "procurar o lançamento faltante" }] },
  d3: { pergunta: "Escreva o primeiro parágrafo de um e-mail pedindo uma nota fiscal atrasada.", pontosChave: [{ termo: "prazo", ideia: "dar um prazo" }, { termo: "nota", ideia: "dizer qual documento" }, { termo: "obrigad", ideia: "manter a cordialidade" }] },
  t1: { pergunta: "A internet caiu no escritório. Por onde você começaria a investigar?", pontosChave: [{ termo: "rede", ideia: "pensar na camada de rede" }, { termo: "cabo", ideia: "checar cabos e roteador" }, { termo: "outro", ideia: "testar em outro aparelho" }] },
  t2: { pergunta: "Como você decidiria qual de dois chamados atender primeiro?", pontosChave: [{ termo: "impacto", ideia: "avaliar o impacto" }, { termo: "urg", ideia: "avaliar a urgência" }, { termo: "sla", ideia: "considerar o SLA" }] },
  t3: { pergunta: "Uma colega recebeu um link estranho pedindo a senha do e-mail. O que você orientaria?", pontosChave: [{ termo: "não", ideia: "não clicar nem informar a senha" }, { termo: "oficial", ideia: "confirmar pelo canal oficial" }, { termo: "duas etapas", ideia: "ativar a verificação em duas etapas" }] },
};

export function todosModulos(): { m: Modulo; t: Trilha; idx: number }[] {
  return ordemTrilhas.flatMap((k) => trilhas[k].modulos.map((m, idx) => ({ m, t: trilhas[k], idx })));
}

export function acharModulo(id: string): { m: Modulo; t: Trilha; idx: number } | null {
  return todosModulos().find((x) => x.m.id === id) ?? null;
}
