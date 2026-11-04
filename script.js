// (() => {
//   const slides = [...document.querySelectorAll('.slide')];
//   const dots = [...document.querySelectorAll('.dot')];
//   const progressBar = document.getElementById('progressBar');
//   const stepCount = document.getElementById('stepCount');
//   const prevButton = document.getElementById('prevSlide');
//   const nextButton = document.getElementById('nextSlide');
//   const noButton = document.getElementById('noButton');
//   const hint = document.getElementById('hint');
//   let current = 0;
//   let noAttempts = 0;

//   function showSlide(index) {
//     const next = Math.max(0, Math.min(slides.length - 1, index));
//     slides.forEach((slide, i) => {
//       slide.classList.toggle('is-active', i === next);
//       slide.classList.toggle('was-left', i < next);
//       slide.setAttribute('aria-hidden', i === next ? 'false' : 'true');
//     });
//     dots.forEach((dot, i) => {
//       dot.classList.toggle('active', i === next);
//       dot.setAttribute('aria-current', i === next ? 'step' : 'false');
//     });
//     current = next;
//     progressBar.style.width = `${((current + 1) / slides.length) * 100}%`;
//     stepCount.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
//     prevButton.disabled = current === 0;
//     nextButton.disabled = current === slides.length - 1;
//     // Re-trigger entrance animation each time a slide becomes active.
//     const content = slides[current].querySelector('.slide-content');
//     content.style.animation = 'none';
//     void content.offsetWidth;
//     content.style.animation = '';
//   }

//   document.querySelectorAll('[data-next]').forEach(button => {
//     button.addEventListener('click', () => showSlide(current + 1));
//   });
//   dots.forEach(dot => dot.addEventListener('click', () => showSlide(Number(dot.dataset.go))));
//   prevButton.addEventListener('click', () => showSlide(current - 1));
//   nextButton.addEventListener('click', () => showSlide(current + 1));

//   function dodge(button, event) {
//     if (current === 0 && button === noButton) {
//       noAttempts++;
//       hint.textContent = ['Ой, не получилось 😏', 'Кажется, кнопка тоже за «да»', 'Может, всё-таки нажмём «Да»?'][Math.min(noAttempts - 1, 2)];
//     }
//     const slide = button.closest('.slide');
//     const bounds = slide.getBoundingClientRect();
//     const btn = button.getBoundingClientRect();
//     const pad = 18;
//     const maxX = Math.max(pad, bounds.width - btn.width - pad);
//     const maxY = Math.max(bounds.height * .48, bounds.height - btn.height - 70);
//     // Keep the button in the lower half of the current slide and avoid the edges.
//     const x = pad + Math.random() * Math.max(1, maxX - pad);
//     const y = bounds.height * .52 + Math.random() * Math.max(1, maxY - bounds.height * .52);
//     button.style.position = 'absolute';
//     button.style.left = `${Math.min(x, bounds.width - btn.width - pad)}px`;
//     button.style.top = `${Math.min(y, bounds.height - btn.height - 55)}px`;
//     button.style.zIndex = '10';
//     button.style.transition = 'left .22s ease, top .22s ease, transform .22s ease';
//     button.style.transform = `rotate(${Math.random() > .5 ? 1 : -1}${Math.floor(4 + Math.random() * 9)}deg)`;
//     if (event) event.preventDefault();
//   }

//   [noButton, ...document.querySelectorAll('.runaway')].forEach(button => {
//     button.addEventListener('pointerenter', event => {
//       // On desktop, run away as the pointer approaches.
//       if (event.pointerType === 'mouse') dodge(button, event);
//     });
//     button.addEventListener('pointerdown', event => {
//       // Touch devices get a real dodge on tap; no button action can be triggered.
//       dodge(button, event);
//     });
//     button.addEventListener('click', event => {
//       event.preventDefault();
//       dodge(button, event);
//     });
//     button.addEventListener('focus', () => {
//       button.blur();
//     });
//   });

//   const restart = () => {
//     document.querySelectorAll('.btn-no').forEach(button => {
//       button.style.position = '';
//       button.style.left = '';
//       button.style.top = '';
//       button.style.transform = '';
//       button.style.zIndex = '';
//     });
//     noAttempts = 0;
//     if (hint) hint.textContent = 'Попробуйте нажать «Нет»… если получится';
//     showSlide(0);
//   };
//   document.getElementById('restart').addEventListener('click', event => { event.preventDefault(); restart(); });
//   document.getElementById('restartFinal').addEventListener('click', restart);
//   document.getElementById('finishButton').addEventListener('click', () => {
//     const btn = document.getElementById('finishButton');
//     btn.innerHTML = '<span class="calendar-icon">✓</span> Договорились!';
//     document.getElementById('copyStatus').textContent = 'До встречи — вечер обещает быть отличным ✨';
//   });

//   document.getElementById('copyAddress').addEventListener('click', async () => {
//     const address = [
//       document.getElementById('addressName').textContent,
//       document.getElementById('addressStreet').textContent,
//       document.getElementById('addressRoom').textContent
//     ].join('\n');
//     const status = document.getElementById('copyStatus');
//     try {
//       await navigator.clipboard.writeText(address);
//       status.textContent = 'Адрес скопирован — сохраните его ✨';
//     } catch {
//       status.textContent = address;
//     }
//   });

//   // Swipe support for touchscreens.
//   let touchStartX = 0;
//   const experience = document.querySelector('.experience');
//   experience.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
//   experience.addEventListener('touchend', event => {
//     const delta = event.changedTouches[0].clientX - touchStartX;
//     if (Math.abs(delta) > 70) showSlide(current + (delta < 0 ? 1 : -1));
//   }, { passive: true });

//   showSlide(0);
// })();


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
    if (event) event.preventDefault();

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

    // Важно: сначала переводим в absolute, чтобы размеры и система координат
    // были стабильными относительно слайда
    const wasAbsolute = button.style.position === 'absolute';
    if (!wasAbsolute) {
      // Запоминаем текущую позицию относительно слайда, чтобы первый прыжок
      // начинался из правильной точки
      const slideRect = slide.getBoundingClientRect();
      const btnRect = button.getBoundingClientRect();
      button.style.position = 'absolute';
      button.style.left = `${btnRect.left - slideRect.left}px`;
      button.style.top = `${btnRect.top - slideRect.top}px`;
      button.style.margin = '0';
      // Форсируем reflow, чтобы transition стартовал от текущей позиции
      void button.offsetWidth;
    }

    const slideW = slide.clientWidth;
    const slideH = slide.clientHeight;
    const btnW = button.offsetWidth;
    const btnH = button.offsetHeight;

    // Запретная зона вокруг кнопки «Да»
    const yesBtn = slide.querySelector('.btn-yes');
    let forbidden = null;
    if (yesBtn) {
      const yesRect = yesBtn.getBoundingClientRect();
      const slideRect = slide.getBoundingClientRect();
      const margin = 28;
      forbidden = {
        left: yesRect.left - slideRect.left - margin,
        top: yesRect.top - slideRect.top - margin,
        right: yesRect.right - slideRect.left + margin,
        bottom: yesRect.bottom - slideRect.top + margin
      };
    }

    // Жёсткие границы — кнопка целиком внутри слайда
    const pad = 14;
    const minX = pad;
    const maxX = Math.max(minX, slideW - btnW - pad);
    const minY = pad;
    const maxY = Math.max(minY, slideH - btnH - pad);

    // Предпочитаем нижнюю половину, но не выходим за pad
    const preferMinY = Math.max(minY, Math.floor(slideH * 0.40));
    const preferMaxY = maxY;

    const overlaps = (px, py) => {
      if (!forbidden) return false;
      return !(
        px + btnW <= forbidden.left ||
        px >= forbidden.right ||
        py + btnH <= forbidden.top ||
        py >= forbidden.bottom
      );
    };

    let x = minX;
    let y = preferMinY;
    let found = false;

    for (let i = 0; i < 30; i++) {
      const tryX = minX + Math.random() * (maxX - minX);
      const tryY = preferMinY + Math.random() * Math.max(0, preferMaxY - preferMinY);
      if (!overlaps(tryX, tryY)) {
        x = tryX;
        y = tryY;
        found = true;
        break;
      }
    }

    // Fallback: пробуем справа или слева от «Да»
    if (!found && forbidden) {
      const candidates = [
        { x: forbidden.right + 6, y: forbidden.top },
        { x: forbidden.left - btnW - 6, y: forbidden.top },
        { x: forbidden.left, y: forbidden.bottom + 6 },
        { x: minX, y: maxY },
        { x: maxX, y: maxY }
      ];
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

    // Финальный жёсткий clamp — никогда не выходим за слайд
    x = Math.min(Math.max(minX, x), maxX);
    y = Math.min(Math.max(minY, y), maxY);

    button.style.zIndex = '10';
    button.style.transition = 'left .55s cubic-bezier(0.22, 1, 0.36, 1), top .55s cubic-bezier(0.22, 1, 0.36, 1), transform .55s cubic-bezier(0.22, 1, 0.36, 1)';
    button.style.left = `${Math.round(x)}px`;
    button.style.top = `${Math.round(y)}px`;
    const angle = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.floor(Math.random() * 5));
    button.style.transform = `rotate(${angle}deg)`;
  }

  [noButton, ...document.querySelectorAll('.runaway')].forEach(button => {
    button.addEventListener('pointerenter', event => {
      // On desktop, run away as the pointer approaches.
      if (event.pointerType === 'mouse') dodge(button, event);
    });
    button.addEventListener('pointerdown', event => {
      // Touch devices get a real dodge on tap; no button action can be triggered.
      dodge(button, event);
    });
    button.addEventListener('click', event => {
      event.preventDefault();
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