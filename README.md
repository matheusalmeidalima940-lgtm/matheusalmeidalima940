# Patinhas do Bem — Campanha de doação pet

Landing page responsiva para apresentar uma campanha de apoio a cães e gatos e orientar doações via Pix.

## Estrutura

- `index.html` — conteúdo da página
- `css/style.css` — identidade visual e responsividade
- `js/app.js` — seleção de valores e cópia da chave Pix
- `assets/` — imagens próprias/licenciadas da campanha

## Como executar

Abra `index.html` no navegador. Não é necessário instalar dependências.

## Configuração obrigatória antes de divulgar

Edite o objeto `CAMPAIGN` no início de `js/app.js`:

- `pixKey`: chave Pix verdadeira e autorizada pelo responsável.
- `pixOwner`: nome do titular/beneficiário para conferência.
- `whatsapp`: contato oficial, se desejado.
- `goal`: meta real da campanha, caso seja divulgada.

A chave Pix aparece na página e pode ser copiada. O site não recebe, processa nem confirma pagamentos. O doador deve conferir o nome do destinatário no aplicativo bancário antes de transferir.

## Transparência e uso responsável

- Identifique claramente a pessoa ou organização responsável pela arrecadação.
- Explique finalidade, período e destinação das contribuições.
- Publique comprovantes e atualizações reais, preservando dados pessoais.
- Não apresente metas, números ou resultados ilustrativos como fatos reais.
- Obtenha autorização para utilizar imagens e informações dos animais.

As imagens atuais são referências externas do Unsplash. Para produção, prefira fotos autorizadas salvas em `assets/` e atualize os caminhos no HTML.

## Publicação

Pode ser publicado no GitHub Pages usando a branch `main` e a pasta raiz.