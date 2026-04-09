/**
 * Lista de espera — localStorage + opcional Google Forms.
 *
 * GOOGLE FORMS — passo a passo:
 * 1) Acesse https://forms.google.com e crie um formulário com as perguntas (resposta curta ou lista):
 *    Nome completo, E-mail, Modalidade (as 4 opções do site), Telefone (opcional).
 * 2) Clique em Enviar (olho) para abrir o formulário publicado, clique com o botão direito →
 *    “Exibir código-fonte da página” (ou F12 → Elements) e procure por entry. seguido de números
 *    nos <input name="entry...."> — anote um ID por pergunta.
 *    Alternativa: no editor do Formulário, menu ⋮ → “Obter link pré-preenchido”, preencha e gere o link;
 *    a URL terá entry.XXXXX=valor para cada campo.
 * 3) O ID longo do formulário está na URL do editor:
 *    .../forms/d/ID_DO_EDITAR/viewform — o envio usa outro formato:
 *    https://docs.google.com/forms/d/e/ID_PUBLICADO/formResponse
 *    O “ID publicado” aparece na URL ao clicar em Enviar → ícone de link: .../d/e/XXXXXXXX/formResponse
 * 4) Preencha js/google-form-config.js (formResponseUrl, entries.name/email/modality/phone) e defina enabled: true.
 *
 * Observação: o envio usa fetch em modo no-cors; o Google aceita, mas o navegador não mostra erro se falhar.
 * Mantemos o backup no localStorage.
 */
(function () {
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
      if (cfg.entries.modality) {
        params.append(cfg.entries.modality, modality);
      }
      if (cfg.entries.phone) {
        params.append(cfg.entries.phone, phone.trim() || "");
      }
      fetch(cfg.formResponseUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      }).catch(function () {});
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
