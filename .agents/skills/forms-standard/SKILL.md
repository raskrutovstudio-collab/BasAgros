---
name: forms-standard
description: Использовать при создании, миграции и подключении lead forms к Supabase, Resend, CRM, email, UTM и analytics.
---
# Forms Standard

## Principle
Сначала выясни, как формы уже работают. Не создавай новую интеграцию при рабочем общем handler.

Priority:
1. AGENTS.md / .cursor/rules
2. existing global handler
3. backend/Edge Function contract
4. this skill
5. local solution only if needed

## Forbidden
- separate fetch for each form;
- second submit handler;
- new endpoint instead of working one;
- changing payload contract by guess;
- constructor tokens/endpoints;
- service-role, Resend API key, CRM secrets in frontend;
- logging PII;
- fake success;
- reset before confirmed success;
- conversion before success;
- deleting consent;
- real production submit without permission.

## Audit
Record page/form, data-form-name, fields/name, required, handler, endpoint, payload,
success/error, analytics event, consent, honeypot, UTM/page source.

## Markup
```html
<form data-lead-form data-form-name="Страница — назначение" novalidate>
  <input class="lead-form-honeypot" type="text" name="website"
         autocomplete="off" tabindex="-1" aria-hidden="true">
  <div data-form-status aria-live="polite" aria-atomic="true"></div>
</form>
```

Each field: stable name, correct type, label/for, unique id, autocomplete,
required by fact, error message, aria-describedby when needed, inputmode when needed.

Global handler should add page_url, page_title, form_name, UTM and prevent double submit.
Analytics conversion only after confirmed backend success.
