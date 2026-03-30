# Miits

Landing (HTML/CSS/JS) com lista de espera e envio opcional ao Google Forms (`js/google-form-config.js`).

## Site no GitHub Pages

1. Envie o código para o GitHub (`main`), a partir **desta pasta** (raiz do repositório):

   ```bash
   git add -A && git status
   git commit -m "Landing Miits"
   git push origin main
   ```

2. No repositório **GitHub** → **Settings** → **Pages** (menu lateral).

3. Em **Build and deployment** → **Source**: escolha **Deploy from a branch**.

4. **Branch**: `main`, pasta **`/ (root)`** → **Save**.

5. Em alguns minutos o site fica em:

   **`https://vinicamel.github.io/miits/`**

   (troque `vinicamel` pelo seu usuário, se for outro.)

6. Domínio próprio (opcional): na mesma tela de Pages, em **Custom domain**, e configure o DNS conforme o guia do GitHub.

Arquivo **`.nojekyll`** evita que o GitHub trate o site como Jekyll e ignore arquivos com `_` no nome.
