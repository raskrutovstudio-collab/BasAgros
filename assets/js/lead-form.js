(() => {
  const forms = document.querySelectorAll('[data-lead-form]');
  if (!forms.length) return;

  const DISABLED_MESSAGE = 'Отправка будет доступна после подключения формы.';
  const config = window.SITE_CONFIG || {};
  const endpoint = String(config.leadEndpoint || '').trim();
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  function canActivateLeadForm() {
    if (config.enabled === true && !endpoint) {
      console.error('Форма не может быть активна: endpoint пустой.');
      return false;
    }
    if (config.enabled !== true) return false;
    if (!endpoint || endpoint === 'ТРЕБУЕТ_ПОДТВЕРЖДЕНИЯ') return false;
    return true;
  }

  function disableForm(form) {
    const submit = form.querySelector('button[type="submit"]');
    if (submit) {
      submit.disabled = true;
      submit.setAttribute('aria-disabled', 'true');
    }
    const status = form.querySelector('[data-form-status]');
    if (status) status.textContent = DISABLED_MESSAGE;
  }

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

  const active = canActivateLeadForm();

  for (const form of forms) {
    if (form.dataset.handlerBound === 'true') continue;
    form.dataset.handlerBound = 'true';

    if (!active) {
      disableForm(form);
      form.addEventListener('submit', (event) => {
        event.preventDefault();
      });
      continue;
    }

    captureUtm();

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!canActivateLeadForm()) {
        disableForm(form);
        return;
      }

      const status = form.querySelector('[data-form-status]');
      const submit = form.querySelector('button[type="submit"]');

      if (form.dataset.submitting === 'true') return;

      if (!form.checkValidity()) {
        form.reportValidity();
        if (status) status.textContent = 'Проверьте обязательные поля.';
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());

      if (data.website) {
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

        window.dispatchEvent(new CustomEvent('lead:success', {
          detail: { formName: payload.form_name }
        }));
      } catch (error) {
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
