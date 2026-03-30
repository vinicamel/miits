# Miits

Landing (HTML/CSS/JS) com lista de espera e envio opcional ao Google Forms (`js/google-form-config.js`).

## Site no GitHub Pages (recomendado: GitHub Actions)

Este repositório inclui um workflow em `.github/workflows/deploy-pages.yml` que publica o site a cada push na `main`.

### O que fazer no GitHub (uma vez)

1. Abra o repositório no GitHub → **Settings** (aba do repositório, não da sua conta).
2. No menu lateral esquerdo, clique em **Pages** (em **Code and automation**).
3. Em **Build and deployment** (ou só **Source** / **GitHub Pages**), em **Source**, escolha **GitHub Actions** — não “Deploy from a branch”.
4. Se não aparecer **GitHub Actions** ainda, faça um **push** da `main` (ou use **Actions** → abra o workflow **Deploy GitHub Pages** → **Run workflow**) para rodar uma vez; depois volte em **Settings → Pages** e selecione **GitHub Actions**.

### Se não existir a seção “Build and deployment”

- Confirme que você é **admin** do repositório.
- Repositório **público**: Pages no plano free funciona.
- Repositório **privado**: Pages pode exigir plano pago; nesse caso use um repo público só para a landing ou veja [documentação](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages).

### URL do site

Após o deploy com sucesso (aba **Actions** com ✓ verde):

**`https://vinicamel.github.io/miits/`**

(troque `vinicamel` pelo seu usuário.)

### Alternativa sem Actions

Em **Settings → Pages**, se existir **Deploy from a branch**: branch **`main`**, pasta **`/ (root)`**.

Arquivo **`.nojekyll`** evita que o GitHub trate o site como Jekyll.
