(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const dots = [...document.querySelectorAll('.dot')];
  const progressBar = document.getElementById('progressBar');
  const stepCount = document.getElementById('stepCount');
  const prevButton = document.getElementById('prevSlide');
  const nextButton = document.getElementById('nextSlide');
  const noButton = document.getElementById('noButton');
  const hint = document.getElementById('hint');
  let current = 0;
  let noAttempts = 0;

  function showSlide(index) {
    const next = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === next);
      slide.classList.toggle('was-left', i < next);
      slide.setAttribute('aria-hidden', i === next ? 'false' : 'true');
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === next);
      dot.setAttribute('aria-current', i === next ? 'step' : 'false');
    });
    current = next;
    if (progressBar) {
      progressBar.style.width = `${((current + 1) / slides.length) * 100}%`;
    }
    if (stepCount) {
      stepCount.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    }
    if (prevButton) prevButton.disabled = current === 0;
    if (nextButton) nextButton.disabled = current === slides.length - 1;
    // Re-trigger entrance animation each time a slide becomes active.
    const content = slides[current].querySelector('.slide-content');
    if (content) {
      content.style.animation = 'none';
      void content.offsetWidth;
      content.style.animation = '';
    }
  }

  document.querySelectorAll('[data-next]').forEach(button => {
    button.addEventListener('click', () => showSlide(current + 1));
  });
  dots.forEach(dot => dot.addEventListener('click', () => showSlide(Number(dot.dataset.go))));
  if (prevButton) prevButton.addEventListener('click', () => showSlide(current - 1));
  if (nextButton) nextButton.addEventListener('click', () => showSlide(current + 1));

  function dodge(button, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (current === 0 && button === noButton) {
      noAttempts++;
      if (hint) {
        hint.textContent = [
          'Ой, не получилось 😊',
          'Кажется, кнопка тоже за «да» 🙈',
          'Может, всё-таки нажмём «Да»? 💫'
        ][Math.min(noAttempts - 1, 2)];
      }
    }

    const slide = button.closest('.slide');
    if (!slide) return;

    const yesBtn = slide.querySelector('.btn-yes');

    // На время анимации отключаем клики по «Да»,
    // чтобы случайный тап не попал в неё
    if (yesBtn) {
      yesBtn.style.pointerEvents = 'none';
      clearTimeout(yesBtn._reenableTimer);
      yesBtn._reenableTimer = setTimeout(() => {
        yesBtn.style.pointerEvents = '';
      }, 600);
    }

    // Переводим в absolute, сохраняя текущую визуальную позицию
    const wasAbsolute = button.style.position === 'absolute';
    if (!wasAbsolute) {
      const slideRect = slide.getBoundingClientRect();
      const btnRect = button.getBoundingClientRect();
      button.style.position = 'absolute';
      button.style.left = `${btnRect.left - slideRect.left}px`;
      button.style.top = `${btnRect.top - slideRect.top}px`;
      button.style.margin = '0';
      void button.offsetWidth;
    }

    const slideW = slide.clientWidth;
    const slideH = slide.clientHeight;
    const btnW = button.offsetWidth;
    const btnH = button.offsetHeight;

    // На узких экранах (телефоны) увеличиваем «запретную» зону вокруг «Да»
    const isMobile = window.innerWidth <= 760;
    const margin = isMobile ? 56 : 36;

    let forbidden = null;
    let yesCenterX = slideW / 2;
    let yesCenterY = slideH / 2;

    if (yesBtn) {
      const yesRect = yesBtn.getBoundingClientRect();
      const slideRect = slide.getBoundingClientRect();
      forbidden = {
        left: yesRect.left - slideRect.left - margin,
        top: yesRect.top - slideRect.top - margin,
        right: yesRect.right - slideRect.left + margin,
        bottom: yesRect.bottom - slideRect.top + margin
      };
      yesCenterX = (yesRect.left + yesRect.right) / 2 - slideRect.left;
      yesCenterY = (yesRect.top + yesRect.bottom) / 2 - slideRect.top;
    }

    const pad = isMobile ? 12 : 14;
    const minX = pad;
    const maxX = Math.max(minX, slideW - btnW - pad);
    const minY = pad;
    const maxY = Math.max(minY, slideH - btnH - pad);

    const overlaps = (px, py) => {
      if (!forbidden) return false;
      return !(
        px + btnW <= forbidden.left ||
        px >= forbidden.right ||
        py + btnH <= forbidden.top ||
        py >= forbidden.bottom
      );
    };

    // Минимальная дистанция от центра «Да» (чтобы точно не было рядом)
    const minDist = isMobile ? 110 : 90;
    const farEnough = (px, py) => {
      const cx = px + btnW / 2;
      const cy = py + btnH / 2;
      const dx = cx - yesCenterX;
      const dy = cy - yesCenterY;
      return Math.sqrt(dx * dx + dy * dy) >= minDist;
    };

    let x = minX;
    let y = maxY;
    let found = false;

    // Сначала пробуем позиции подальше от «Да» (особенно снизу и по бокам)
    for (let i = 0; i < 40; i++) {
      const tryX = minX + Math.random() * (maxX - minX);
      // На мобильных сильнее предпочитаем низ слайда
      const yBias = isMobile ? 0.55 : 0.42;
      const tryY = Math.max(minY, slideH * yBias) + Math.random() * Math.max(0, maxY - Math.max(minY, slideH * yBias));
      if (!overlaps(tryX, tryY) && farEnough(tryX, tryY)) {
        x = tryX;
        y = tryY;
        found = true;
        break;
      }
    }

    // Надёжный fallback — углы и зоны вдали от «Да»
    if (!found) {
      const candidates = [
        { x: maxX, y: maxY },
        { x: minX, y: maxY },
        { x: maxX, y: minY },
        { x: minX, y: minY },
        { x: maxX, y: (minY + maxY) / 2 },
        { x: minX, y: (minY + maxY) / 2 },
        { x: (minX + maxX) / 2, y: maxY }
      ];
      // Сортируем по удалённости от «Да»
      candidates.sort((a, b) => {
        const da = Math.hypot(a.x + btnW / 2 - yesCenterX, a.y + btnH / 2 - yesCenterY);
        const db = Math.hypot(b.x + btnW / 2 - yesCenterX, b.y + btnH / 2 - yesCenterY);
        return db - da;
      });
      for (const c of candidates) {
        const cx = Math.min(Math.max(minX, c.x), maxX);
        const cy = Math.min(Math.max(minY, c.y), maxY);
        if (!overlaps(cx, cy)) {
          x = cx;
          y = cy;
          found = true;
          break;
        }
      }
    }

    // Финальный clamp
    x = Math.min(Math.max(minX, x), maxX);
    y = Math.min(Math.max(minY, y), maxY);

    button.style.zIndex = '20';
    button.style.transition = 'left .55s cubic-bezier(0.22, 1, 0.36, 1), top .55s cubic-bezier(0.22, 1, 0.36, 1), transform .55s cubic-bezier(0.22, 1, 0.36, 1)';
    button.style.left = `${Math.round(x)}px`;
    button.style.top = `${Math.round(y)}px`;
    const angle = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.floor(Math.random() * 5));
    button.style.transform = `rotate(${angle}deg)`;
  }

  [noButton, ...document.querySelectorAll('.runaway')].forEach(button => {
    button.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse') dodge(button, event);
    });
    button.addEventListener('pointerdown', event => {
      // На тач-устройствах сразу убегаем и блокируем дальнейшие события
      event.preventDefault();
      event.stopPropagation();
      dodge(button, event);
    }, { passive: false });
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      dodge(button, event);
    });
    button.addEventListener('focus', () => {
      button.blur();
    });
  });

  const restart = () => {
    document.querySelectorAll('.btn-no').forEach(button => {
      button.style.position = '';
      button.style.left = '';
      button.style.top = '';
      button.style.transform = '';
      button.style.zIndex = '';
    });
    noAttempts = 0;
    if (hint) hint.textContent = 'Попробуйте нажать «Нет»… если получится';
    showSlide(0);
  };
  const restartBtn = document.getElementById('restart');
  if (restartBtn) {
    restartBtn.addEventListener('click', event => { event.preventDefault(); restart(); });
  }
  const restartFinal = document.getElementById('restartFinal');
  if (restartFinal) {
    restartFinal.addEventListener('click', restart);
  }

  const finishButton = document.getElementById('finishButton');
  if (finishButton) {
    finishButton.addEventListener('click', () => {
      finishButton.innerHTML = '<span class="calendar-icon">💫</span> Договорились!';
      const status = document.getElementById('copyStatus');
      if (status) status.textContent = 'До встречи — вечер обещает быть отличным ✨';
    });
  }

  const copyAddress = document.getElementById('copyAddress');
  if (copyAddress) {
    copyAddress.addEventListener('click', async () => {
      const address = [
        document.getElementById('addressName')?.textContent,
        document.getElementById('addressStreet')?.textContent,
        document.getElementById('addressRoom')?.textContent
      ].filter(Boolean).join('\n');
      const status = document.getElementById('copyStatus');
      try {
        await navigator.clipboard.writeText(address);
        if (status) status.textContent = 'Адрес скопирован — сохраните его ✨';
      } catch {
        if (status) status.textContent = address;
      }
    });
  }

  // Swipe support for touchscreens.
  let touchStartX = 0;
  const experience = document.querySelector('.experience');
  experience.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  experience.addEventListener('touchend', event => {
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 70) showSlide(current + (delta < 0 ? 1 : -1));
  }, { passive: true });

  showSlide(0);
})();
