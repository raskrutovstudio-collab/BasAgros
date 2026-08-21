(() => {
  const forms = document.querySelectorAll('[data-lead-form]');
  if (!forms.length) return;

  const endpoint = window.SITE_CONFIG?.leadEndpoint;
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  function captureUtm() {
    const params = new URLSearchParams(location.search);
    for (const key of utmKeys) {
      const value = params.get(key);
      if (value) sessionStorage.setItem(key, value);
    }
  }

  function getUtm() {
    return Object.fromEntries(
      utmKeys.map((key) => [key, sessionStorage.getItem(key) || ''])
    );
  }

  captureUtm();

  for (const form of forms) {
    if (form.dataset.handlerBound === 'true') continue;
    form.dataset.handlerBound = 'true';

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const status = form.querySelector('[data-form-status]');
      const submit = form.querySelector('button[type="submit"]');

      if (form.dataset.submitting === 'true') return;

      if (!form.checkValidity()) {
        form.reportValidity();
        if (status) status.textContent = 'Проверьте обязательные поля.';
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());

      // Honeypot: не отправляем потенциальный spam.
      if (data.website) {
        if (status) status.textContent = 'Заявка принята.';
        return;
      }

      if (!endpoint || endpoint === 'ТРЕБУЕТ_ПОДТВЕРЖДЕНИЯ') {
        console.error('Lead endpoint не настроен.');
        if (status) {
          status.textContent =
            'Отправка пока не настроена. Свяжитесь с компанией другим способом.';
        }
        return;
      }

      const payload = {
        ...data,
        form_name: form.dataset.formName || '',
        page_url: location.href,
        page_title: document.title,
        referrer: document.referrer || '',
        ...getUtm()
      };

      form.dataset.submitting = 'true';
      if (submit) submit.disabled = true;
      if (status) status.textContent = 'Отправляем…';

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        if (status) status.textContent = 'Спасибо. Заявка отправлена.';
        form.reset();

        // Универсальная точка для GTM/Метрики/GA4.
        window.dispatchEvent(new CustomEvent('lead:success', {
          detail: { formName: payload.form_name }
        }));
      } catch (error) {
        // Не выводим PII/payload в console.
        console.error('Ошибка отправки формы:', error.message);
        if (status) {
          status.textContent =
            'Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами другим способом.';
        }
      } finally {
        delete form.dataset.submitting;
        if (submit) submit.disabled = false;
      }
    });
  }
})();
