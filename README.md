# Miits

Landing (HTML/CSS/JS) com lista de espera e envio opcional ao Google Forms (`js/google-form-config.js`).

## Site no GitHub Pages (deploy pela branch `main`)

O site é **estático**: não precisa de GitHub Actions. O GitHub publica os arquivos da raiz do repositório direto.

### Ativar o Pages (uma vez — isso evita o erro 404 de “deployment”)

1. Abra: **https://github.com/vinicamel/miits/settings/pages**
2. Em **Build and deployment** → **Source**, escolha **Deploy from a branch** (não “GitHub Actions”).
3. **Branch**: `main` · pasta **`/ (root)`** → **Save**.

Pronto: cada `git push` na `main` atualiza o site em alguns minutos.

### URL

**https://vinicamel.github.io/miits/**

(troque `vinicamel` pelo seu usuário, se for outro.)

### Observações

- Repositório **privado** no plano free: GitHub Pages pode não estar disponível; use repo **público** para a landing ou veja [About GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages).
- Arquivo **`.nojekyll`** evita que o GitHub trate o site como Jekyll.
