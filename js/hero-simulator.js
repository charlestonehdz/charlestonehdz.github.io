/**
 * FULL-SCREEN HERO SIMULATOR ENGINE (Bucle de 8s)
 * Mecanografía carácter por carácter con cursor activo
 * ~14 líneas de código realistas para pantalla completa
 * Sincronización en tiempo real con la página web reactiva
 */

(function () {
  'use strict';

  const LOOP_DURATION_MS = 8400; // 8.4 segundos de bucle total
  const TYPING_START_MS = 250;
  const TYPING_END_MS = 6200;

  // 14 Líneas de Código Técnico para llenar la pantalla
  const CODE_TOKENS = [
    { text: '// Arquitectura de Software & Operaciones TI\n', token: 'tok-cm' },
    { text: 'import ', token: 'tok-kw' },
    { text: '{ DataEngine, SecureREST } ', token: 'tok-var' },
    { text: 'from ', token: 'tok-kw' },
    { text: "'./core/system';\n\n", token: 'tok-str' },

    { text: 'const ', token: 'tok-kw' },
    { text: 'app = new ', token: 'tok-var' },
    { text: 'EnterprisePortal', token: 'tok-fn' },
    { text: '({\n', token: 'tok-var' },
    { text: '  baseDatos: ', token: 'tok-var' },
    { text: "'MySQL / MariaDB'", token: 'tok-str' },
    { text: ',\n', token: 'tok-var' },
    { text: '  seguridad: ', token: 'tok-var' },
    { text: "'JWT + SSL'", token: 'tok-str' },
    { text: '\n});\n\n', token: 'tok-var' },

    { text: 'app.', token: 'tok-var' },
    { text: 'montarHeader', token: 'tok-fn' },
    { text: "({ estado: 'ACTIVO', ping: '12ms' });\n", token: 'tok-str', trigger: 'nav' },

    { text: 'app.', token: 'tok-var' },
    { text: 'renderKPI', token: 'tok-fn' },
    { text: "('Eficiencia', '99.4%');\n", token: 'tok-str', trigger: 'kpi' },

    { text: 'app.', token: 'tok-var' },
    { text: 'onSincronizar', token: 'tok-fn' },
    { text: '(() => {\n', token: 'tok-var' },
    { text: '  app.', token: 'tok-var' },
    { text: 'notificar', token: 'tok-fn' },
    { text: "('✓ Datos listos y actualizados');\n", token: 'tok-str', trigger: 'action' },
    { text: '});\n\n', token: 'tok-var' },

    { text: 'app.', token: 'tok-var' },
    { text: 'iniciarServicio', token: 'tok-fn' },
    { text: '();', token: 'tok-var' }
  ];

  // Precomputar mapa de caracteres
  let TOTAL_CHARS = 0;
  CODE_TOKENS.forEach(t => { TOTAL_CHARS += t.text.length; });

  class MonitorLoopController {
    constructor() {
      this.monitor = document.getElementById('demostracion');
      this.codeContainer = document.getElementById('mon-code-text');
      this.gutter = document.getElementById('mon-gutter');
      this.timelineFill = document.getElementById('mon-timeline-fill');

      // Elementos visuales de la página web (Media pantalla derecha)
      this.webNav = document.getElementById('mock-web-nav');
      this.webCard = document.getElementById('mock-web-card');
      this.webBar = document.getElementById('mock-web-bar');
      this.webBtnBox = document.getElementById('mock-web-btn-box');
      this.webBtn = document.getElementById('mock-web-btn');
      this.webToast = document.getElementById('mock-web-toast');

      this.startTime = null;
      this.rafId = null;
      this.isPaused = false;
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      this.init();
    }

    init() {
      if (!this.monitor) return;

      if (this.reducedMotion) {
        this.renderStaticFullState();
        return;
      }

      this.setupObservers();
      this.startLoop();
    }

    setupObservers() {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.pause();
        } else {
          this.resume();
        }
      });

      if ('IntersectionObserver' in window && this.monitor) {
        const obs = new IntersectionObserver((entries) => {
          entries.forEach(e => {
            if (!e.isIntersecting) {
              this.pause();
            } else {
              this.resume();
            }
          });
        }, { threshold: 0.05 });
        obs.observe(this.monitor);
      }
    }

    pause() {
      this.isPaused = true;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    resume() {
      if (this.isPaused) {
        this.isPaused = false;
        this.startTime = performance.now();
        this.tick();
      }
    }

    startLoop() {
      this.resetVisuals();
      this.startTime = performance.now();
      this.tick();
    }

    resetVisuals() {
      if (this.codeContainer) this.codeContainer.innerHTML = '';
      if (this.gutter) this.gutter.innerHTML = '<span>1</span>';
      if (this.timelineFill) this.timelineFill.style.width = '0%';

      this.webNav?.classList.remove('is-visible');
      this.webCard?.classList.remove('is-visible', 'is-highlight');
      if (this.webBar) this.webBar.style.width = '0%';
      this.webBtnBox?.classList.remove('is-visible');
      this.webBtn?.classList.remove('is-clicked');
      this.webToast?.classList.remove('is-visible');
    }

    tick() {
      if (this.isPaused) return;

      const now = performance.now();
      const elapsed = (now - this.startTime) % LOOP_DURATION_MS;
      const progressPct = (elapsed / LOOP_DURATION_MS) * 100;

      // Actualizar barra de tiempo
      if (this.timelineFill) {
        this.timelineFill.style.width = `${progressPct.toFixed(1)}%`;
      }

      // 1. Mecanografía progresiva carácter por carácter con cursor activo
      this.renderTypingWithCursor(elapsed);

      // 2. Reactividad de la página web derecha
      this.updateWebpageVisuals(elapsed);

      this.rafId = requestAnimationFrame(() => this.tick());
    }

    renderTypingWithCursor(elapsed) {
      if (!this.codeContainer) return;

      if (elapsed < TYPING_START_MS) {
        this.codeContainer.innerHTML = `<span class="bg-cursor"></span>`;
        if (this.gutter) this.gutter.innerHTML = '<span>1</span>';
        return;
      }

      // Calcular cantidad exacta de caracteres que se deben haber escrito
      const typingElapsed = Math.min(elapsed - TYPING_START_MS, TYPING_END_MS - TYPING_START_MS);
      const typingRatio = typingElapsed / (TYPING_END_MS - TYPING_START_MS);
      const charsToShow = Math.floor(TOTAL_CHARS * typingRatio);

      let accumulated = 0;
      let html = '';
      let lineCount = 1;

      for (let i = 0; i < CODE_TOKENS.length; i++) {
        const item = CODE_TOKENS[i];
        const len = item.text.length;

        if (accumulated + len <= charsToShow) {
          // Token completo
          html += `<span class="${item.token}">${this.escapeHtml(item.text)}</span>`;
          lineCount += (item.text.match(/\n/g) || []).length;
          accumulated += len;
        } else {
          // Token parcial siendo escrito en este preciso milisegundo
          const partialLen = charsToShow - accumulated;
          if (partialLen > 0) {
            const partialStr = item.text.substring(0, partialLen);
            html += `<span class="${item.token}">${this.escapeHtml(partialStr)}</span>`;
            lineCount += (partialStr.match(/\n/g) || []).length;
          }
          break;
        }
      }

      // El cursor aparece SIEMPRE exactamente al lado del último carácter escrito
      html += `<span class="bg-cursor"></span>`;
      this.codeContainer.innerHTML = html;

      // Actualizar números de línea correlativos (1..14)
      if (this.gutter && this.gutter.children.length !== lineCount) {
        let gutterHtml = '';
        for (let l = 1; l <= Math.max(lineCount, 1); l++) {
          gutterHtml += `<span>${l}</span>`;
        }
        this.gutter.innerHTML = gutterHtml;
      }
    }

    updateWebpageVisuals(elapsed) {
      // 2.8s: Aparece el navbar web (cuando se monta en el código)
      if (elapsed >= 2800) {
        this.webNav?.classList.add('is-visible');
      } else {
        this.webNav?.classList.remove('is-visible');
      }

      // 4.2s: Aparece la tarjeta KPI y la barra sube al 99.4%
      if (elapsed >= 4200) {
        this.webCard?.classList.add('is-visible');
        if (this.webBar) this.webBar.style.width = '99.4%';
      } else {
        this.webCard?.classList.remove('is-visible');
        if (this.webBar) this.webBar.style.width = '0%';
      }

      // 5.2s: Resalta con borde cian
      if (elapsed >= 5200) {
        this.webCard?.classList.add('is-highlight');
      } else {
        this.webCard?.classList.remove('is-highlight');
      }

      // 5.5s: Aparece el botón de acción
      if (elapsed >= 5500) {
        this.webBtnBox?.classList.add('is-visible');
      } else {
        this.webBtnBox?.classList.remove('is-visible');
      }

      // 6.2s: Clic en el botón y emerge notificación toast
      if (elapsed >= 6200) {
        this.webBtn?.classList.add('is-clicked');
        this.webToast?.classList.add('is-visible');
      } else {
        this.webBtn?.classList.remove('is-clicked');
        this.webToast?.classList.remove('is-visible');
      }

      // 7.9s a 8.4s: Transición suave de reinicio
      if (elapsed >= 7900) {
        if (this.monitor) this.monitor.style.opacity = '0.75';
      } else {
        if (this.monitor) this.monitor.style.opacity = '1';
      }
    }

    renderStaticFullState() {
      let fullHtml = '';
      let lineCount = 1;
      CODE_TOKENS.forEach(s => {
        fullHtml += `<span class="${s.token}">${this.escapeHtml(s.text)}</span>`;
        lineCount += (s.text.match(/\n/g) || []).length;
      });
      fullHtml += `<span class="bg-cursor"></span>`;
      if (this.codeContainer) this.codeContainer.innerHTML = fullHtml;
      if (this.gutter) {
        let gutterHtml = '';
        for (let l = 1; l <= lineCount; l++) gutterHtml += `<span>${l}</span>`;
        this.gutter.innerHTML = gutterHtml;
      }
      this.webNav?.classList.add('is-visible');
      this.webCard?.classList.add('is-visible', 'is-highlight');
      if (this.webBar) this.webBar.style.width = '99.4%';
      this.webBtnBox?.classList.add('is-visible');
      this.webToast?.classList.add('is-visible');
    }

    escapeHtml(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.monitorLoopInstance = new MonitorLoopController();
  });
})();
