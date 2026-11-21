# Sofias — capacitação para jovens mulheres

PWA de capacitação online e offline para jovens mulheres que não estudam nem trabalham, com teste vocacional, trilha gamificada, certificado e um painel para as empresas parceiras.

**Demo:** https://dudabarbozat.github.io/sofias-capacitacao/

Projeto de pitch em equipe, criado entre 2020 e 2023 e reconstruído em 2026 como protótipo navegável.

## Para quem

Jovens mulheres de 15 a 25 anos fora da escola e do mercado de trabalho, e empresas que oferecem capacitações e buscam candidatas.

## Funcionalidades

- **Cadastro** com estados e municípios do IBGE.
- **Teste vocacional** de 10 perguntas, com a área recomendada e a regra de pontuação visível.
- **Trilha gamificada** com níveis e XP: vídeo-aula, podcast, leitura, flash cards, teste e prática com retorno automático.
- **Uso offline:** app instalável e módulos baixados abrem sem internet (service worker próprio).
- **Certificado** com código de verificação, pronto para imprimir.
- **Painel da empresa** com usuárias ativas, mapa de aderência por estado, vagas com candidatas compatíveis, perfis anonimizados e exportação CSV.

## Stack

Next.js 15 (exportação estática) · React 19 · TypeScript · Chart.js · Service Worker

| API | Uso |
|-----|-----|
| [IBGE Localidades](https://servicodados.ibge.gov.br/api/docs/localidades) | Estados e municípios |
| [IBGE Malhas v3](https://servicodados.ibge.gov.br/api/docs/malhas?versao=3) | Mapa por estado no painel |

Sem backend e sem chaves de API.

## Como rodar

```bash
npm ci
npm run dev
```

O service worker só é registrado no build de produção (`npm run build`).

## Limitações do protótipo

Empresas, vagas, eventos, usuárias e números do painel são fictícios. Não há arquivos de vídeo ou podcast, autenticação nem verificação pública do certificado. Os dados ficam no navegador.

## Equipe

- Eduarda Barboza — design e marketing
- Bianca Medeiros — mobile e front-end
- Jhennifer Pimentel — marketing
- Paulo Carmo — UX e design
- Rodrigo Timóteo — back-end e negócios

## Licença

Código sob [MIT](LICENSE).
