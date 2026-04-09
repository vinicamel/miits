/**
 * Google Form: "Pessoas interessadas no Miits"
 * Só enviamos 3 campos ao Google: Nome, E-mail, Telefone (entry.* abaixo).
 * A modalidade escolhida no site é concatenada no texto do Telefone, ex.:
 *   Modalidade: Pádel · (11) 98888-7777
 * Assim não dependemos de lista suspensa no Forms (que gerava HTTP 400 se o texto não batia).
 * Você pode apagar a pergunta extra "Modalidade" no editor do Forms, se ainda existir.
 *
 * O envio na página é feito por POST em formulário + iframe (waitlist.js), não por fetch.
 */
window.MIITS_GOOGLE_FORM = {
  enabled: true,
  formResponseUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSfAnLhri1gf7s0cvkaD_qEBBX8zmwT4yXbz_nY1PaD_xTTTZw/formResponse",
  entries: {
    name: "entry.1995761298",
    email: "entry.170370593",
    phone: "entry.232930744",
  },
};
