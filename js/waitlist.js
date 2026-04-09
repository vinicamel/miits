/**
 * Lista de espera — localStorage + opcional Google Forms.
 *
 * GOOGLE FORMS — passo a passo:
 * 1) Google Forms: Nome, E-mail, Telefone (resposta curta). A modalidade vai no texto do telefone.
 * 2) Clique em Enviar (olho) para abrir o formulário publicado, clique com o botão direito →
 *    “Exibir código-fonte da página” (ou F12 → Elements) e procure por entry. seguido de números
 *    nos <input name="entry...."> — anote um ID por pergunta.
 *    Alternativa: no editor do Formulário, menu ⋮ → “Obter link pré-preenchido”, preencha e gere o link;
 *    a URL terá entry.XXXXX=valor para cada campo.
 * 3) O ID longo do formulário está na URL do editor:
 *    .../forms/d/ID_DO_EDITAR/viewform — o envio usa outro formato:
 *    https://docs.google.com/forms/d/e/ID_PUBLICADO/formResponse
 *    O “ID publicado” aparece na URL ao clicar em Enviar → ícone de link: .../d/e/XXXXXXXX/formResponse
 * 4) Preencha js/google-form-config.js (formResponseUrl, entries.name/email/phone) e defina enabled: true.
 *
 * O envio ao Google usa POST clássico (form + iframe oculto), mais confiável que fetch+no-cors no localhost.
 * Mantemos o backup no localStorage (nome, e-mail, modalidade e telefone separados).
 */
(function () {
  /** POST application/x-www-form-urlencoded via formulário real — compatível com Google Forms em qualquer origem. */
  function postFormToIframe(actionUrl, params) {
    var iframeName = "miits_gf_" + String(Date.now());
    var iframe = document.createElement("iframe");
    iframe.name = iframeName;
    iframe.style.cssText = "position:absolute;width:0;height:0;border:0;visibility:hidden";
    iframe.setAttribute("aria-hidden", "true");
    iframe.title = "Envio ao Google Forms";
    document.body.appendChild(iframe);

    var f = document.createElement("form");
    f.method = "POST";
    f.action = actionUrl;
    f.target = iframeName;
    f.acceptCharset = "UTF-8";
    f.style.display = "none";

    params.forEach(function (value, key) {
      var input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      f.appendChild(input);
    });

    document.body.appendChild(f);
    f.submit();
    document.body.removeChild(f);

    window.setTimeout(function () {
      try {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      } catch (_) {}
    }, 8000);
  }
  const form = document.getElementById("waitlist-form");
  const successEl = document.getElementById("form-success");
  const STORAGE_KEY = "miits_waitlist_entries";

  if (!form || !successEl) {
    return;
  }

  const elFullName = document.getElementById("fullName");
  const elEmail = document.getElementById("email");
  const elModality = document.getElementById("modality");
  const elPhone = document.getElementById("phone");

  if (!elFullName || !elEmail || !elModality || !elPhone) {
    return;
  }

  elModality.addEventListener("change", function () {
    if (elModality.value) elModality.classList.remove("error");
  });

  function clearErrors() {
    [elFullName, elEmail, elModality, elPhone].forEach(function (el) {
      el.classList.remove("error");
    });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  /** Telefone BR: vazio é válido (opcional); se preenchido, mínimo 10 dígitos */
  function validatePhone(phone) {
    var trimmed = phone.trim();
    if (!trimmed) return true;
    var digits = trimmed.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 13;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    var name = elFullName.value.trim();
    var email = elEmail.value.trim();
    var modality = elModality.value.trim();
    var phone = elPhone.value.trim();

    var valid = true;
    if (!name || name.length < 2) {
      elFullName.classList.add("error");
      valid = false;
    }
    if (!validateEmail(email)) {
      elEmail.classList.add("error");
      valid = false;
    }
    if (!modality) {
      elModality.classList.add("error");
      valid = false;
    }
    if (!validatePhone(phone)) {
      elPhone.classList.add("error");
      valid = false;
    }
    if (!valid) return;

    var entry = {
      name: name,
      email: email,
      modality: modality,
      phone: phone.trim() || null,
      createdAt: new Date().toISOString(),
    };

    /** Texto único para a coluna Telefone no Google (modalidade + número, se houver). */
    var phoneForGoogle = "Modalidade: " + modality;
    if (phone.trim()) {
      phoneForGoogle += " · " + phone.trim();
    }

    var cfg = window.MIITS_GOOGLE_FORM;
    if (
      cfg &&
      cfg.enabled &&
      cfg.formResponseUrl &&
      cfg.entries &&
      cfg.entries.name &&
      cfg.entries.email
    ) {
      var params = new URLSearchParams();
      params.append(cfg.entries.name, name);
      params.append(cfg.entries.email, email);
      if (cfg.entries.phone) {
        params.append(cfg.entries.phone, phoneForGoogle);
      }
      postFormToIframe(cfg.formResponseUrl, params);
    } else if (typeof console !== "undefined" && console.warn) {
      console.warn(
        "[Miits] Envio ao Google desativado ou js/google-form-config.js não carregou (verifique o caminho e a ordem dos <script>)."
      );
    }

    try {
      var prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      prev.push(entry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prev));
    } catch (_) {
      /* ignore quota / private mode */
    }

    form.reset();
    successEl.classList.add("visible");
    try {
      successEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (_) {
      successEl.scrollIntoView();
    }
  });
})();

/** Scroll suave para âncoras (evita erro se o alvo não existir). */
(function () {
  function scrollToId(id) {
    var el = document.getElementById(id);
    if (!el) return;
    try {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (_) {
      el.scrollIntoView();
    }
  }

  document.querySelectorAll("[data-scroll-to]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-scroll-to");
      if (id) scrollToId(id);
    });
  });
})();
