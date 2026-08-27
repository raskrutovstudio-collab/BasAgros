/*
  Публичная конфигурация.
  Здесь допустим URL публичного endpoint/Edge Function.

  НЕЛЬЗЯ размещать здесь:
  - Supabase service-role key;
  - Resend API key;
  - SMTP password;
  - CRM secret;
  - private key.
*/
window.SITE_CONFIG = Object.freeze({
  enabled: true,
  leadEndpoint: 'https://forms.basagros.kz/lead.php'
});
