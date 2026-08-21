# Формы: универсальный стандарт интеграции

## Рекомендуемая архитектура

```text
HTML form
  ↓
один global lead-form.js
  ↓
public HTTPS endpoint / Supabase Edge Function
  ↓
server-side validation
  ↓
Resend / email / CRM
  ↓
confirmed success
  ↓
analytics conversion event
```

## Что допустимо во frontend

Допустимо:
- публичный URL endpoint;
- form name;
- page URL/title;
- UTM;
- публичная конфигурация, которая по архитектуре действительно является public.

Запрещено:
- Supabase service-role key;
- Resend API key;
- CRM client secret;
- SMTP password;
- private keys;
- любые server secrets.

## Один handler

Если формы проекта используют общий контракт:
- подключается один JS handler;
- каждая форма помечается `data-lead-form`;
- каждая форма имеет понятный `data-form-name`;
- не добавляется локальный `fetch` на каждой странице.

## Пример payload

Точный backend contract всегда имеет приоритет:

```json
{
  "name": "...",
  "phone": "...",
  "email": "...",
  "message": "...",
  "form_name": "...",
  "page_url": "...",
  "page_title": "...",
  "referrer": "...",
  "utm_source": "...",
  "utm_medium": "...",
  "utm_campaign": "...",
  "utm_term": "...",
  "utm_content": "..."
}
```

## Backend должен

- валидировать payload;
- обрабатывать honeypot;
- иметь anti-abuse/rate-limit по необходимости;
- не доверять frontend без проверки;
- отправлять email/CRM server-side;
- возвращать однозначный success/error;
- не раскрывать secrets и внутренний stack trace клиенту.

## Analytics

`lead:success` или другое утверждённое событие возникает **после подтверждённого backend success**.
GTM/Метрика/GA4 могут слушать единый success event вместо отдельных обработчиков на каждой форме.

## QA

До production проверить:
- required fields;
- invalid phone/email;
- consent;
- double click;
- offline/server error;
- success;
- UTM;
- page/form source;
- accessibility;
- отсутствие PII в console.

Реальный production lead отправлять только с разрешения владельца проекта.
