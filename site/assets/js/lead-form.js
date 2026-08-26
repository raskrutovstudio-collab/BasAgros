(() => {
  const forms = document.querySelectorAll('[data-lead-form]');
  if (!forms.length) return;

  const DISABLED_MESSAGE = 'Отправка будет доступна после подключения формы.';
  const config = window.SITE_CONFIG || {};
  const endpoint = String(config.leadEndpoint || '').trim();
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  function normalizePhoneDigits(value) {
    const raw = String(value || '').trim();
    let digits = raw.replace(/\D/g, '');

    if (raw.startsWith('+7') && digits.startsWith('7')) {
      digits = digits.slice(1);
    } else if (digits.length >= 11 && digits.startsWith('8')) {
      digits = digits.slice(1);
    } else if (digits.length >= 11 && digits.startsWith('7')) {
      digits = digits.slice(1);
    }

    return digits.slice(0, 10);
  }

  function formatPhone(value) {
    const digits = normalizePhoneDigits(value);
    if (!digits.length) return '';
    const parts = ['+7'];
    if (digits.length) parts.push(digits.slice(0, 3));
    if (digits.length > 3) parts.push(digits.slice(3, 6));
    if (digits.length > 6) parts.push(digits.slice(6, 8));
    if (digits.length > 8) parts.push(digits.slice(8, 10));
    return parts.join(' ');
  }

  function isCompletePhone(value) {
    return normalizePhoneDigits(value).length === 10;
  }

  function validatePhone(input) {
    if (!input) return true;
    const valid = isCompletePhone(input.value);
    input.setCustomValidity(valid ? '' : 'Введите номер в формате +7 XXX XXX XX XX');
    return valid;
  }

  function bindPhoneMask(form) {
    const inputs = form.querySelectorAll('input[name="phone"][data-phone-mask]');
    for (const input of inputs) {
      input.addEventListener('focus', () => {
        if (!input.value) input.value = '+7 ';
      });
      input.addEventListener('input', () => {
        input.value = formatPhone(input.value);
        validatePhone(input);
      });
      input.addEventListener('blur', () => {
        if (!normalizePhoneDigits(input.value).length) input.value = '';
        validatePhone(input);
      });
      input.addEventListener('paste', () => {
        queueMicrotask(() => {
          input.value = formatPhone(input.value);
          validatePhone(input);
        });
      });
    }
  }

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

  function enableForm(form) {
    const submit = form.querySelector('button[type="submit"]');
    if (submit) {
      submit.disabled = false;
      submit.removeAttribute('aria-disabled');
    }
    const status = form.querySelector('[data-form-status]');
    if (status && status.textContent === DISABLED_MESSAGE) status.textContent = '';
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

  function formDataToObject(form) {
    const entries = [...new FormData(form).entries()]
      .map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]);
    const data = Object.fromEntries(entries);
    if ('phone' in data) data.phone = formatPhone(data.phone);
    return data;
  }

  const active = canActivateLeadForm();

  for (const form of forms) {
    if (form.dataset.handlerBound === 'true') continue;
    form.dataset.handlerBound = 'true';
    bindPhoneMask(form);

    if (!active) {
      disableForm(form);
      form.addEventListener('submit', (event) => {
        event.preventDefault();
      });
      continue;
    }

    enableForm(form);
    captureUtm();

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!canActivateLeadForm()) {
        disableForm(form);
        return;
      }

      const status = form.querySelector('[data-form-status]');
      const submit = form.querySelector('button[type="submit"]');
      const phone = form.querySelector('input[name="phone"]');

      if (form.dataset.submitting === 'true') return;

      validatePhone(phone);
      if (!form.checkValidity()) {
        form.reportValidity();
        if (status) status.textContent = 'Проверьте обязательные поля.';
        return;
      }

      const data = formDataToObject(form);
      if (data.website) return;

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
        if (canActivateLeadForm()) enableForm(form);
        else disableForm(form);
      }
    });
  }
})();
