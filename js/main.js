/**
 * MAIN JAVASCRIPT
 * Portafolio Profesional - Carlos Hernández
 * Navegación, interactividad de contacto, blog modal y utilidades
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Cabecera fija y estilo al hacer scroll
  const header = document.querySelector('.site-header');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Menú móvil accesible
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Cerrar al hacer clic en cualquier enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Cerrar con la tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 3. Indicador de sección activa en la barra de navegación y dots laterales
  const sections = document.querySelectorAll('section[id]');
  const navDots = document.querySelectorAll('.section-nav-dot');

  const highlightNavigation = () => {
    const scrollPos = window.scrollY + 160;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });

        navDots.forEach(dot => {
          dot.classList.remove('active');
          if (dot.getAttribute('data-section') === id) {
            dot.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNavigation, { passive: true });
  highlightNavigation();

  // Navegación rápida con los dots laterales
  navDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const secId = dot.getAttribute('data-section');
      const targetSec = document.getElementById(secId);
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 4. Copiar correo al portapapeles con feedback accesible
  const copyBtn = document.getElementById('btn-copy-email');
  if (copyBtn) {
    copyBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = 'charlestonehdz@gmail.com';

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback clásico
          const textArea = document.createElement('textarea');
          textArea.value = email;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

        const originalText = copyBtn.textContent;
        copyBtn.textContent = '¡Copiado!';
        copyBtn.style.background = 'var(--status-success)';
        copyBtn.style.color = '#FFFFFF';
        copyBtn.style.borderColor = 'var(--status-success)';

        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.background = '';
          copyBtn.style.color = '';
          copyBtn.style.borderColor = '';
        }, 2200);
      } catch (err) {
        console.warn('No se pudo copiar automáticamente:', err);
      }
    });
  }

  // 5. Modal interactivo para lectura de artículos de blog
  const blogTriggers = document.querySelectorAll('.blog-read-more');
  const blogModal = document.getElementById('blog-preview-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-article-title');
  const modalTag = document.getElementById('modal-article-tag');
  const modalBody = document.getElementById('modal-article-body');

  const blogArticlesData = {
    'art-1': {
      title: 'Arquitectura de Software y Análisis de Sistemas: De Requerimientos Difusos a Soluciones Escalables',
      tag: 'Análisis de Sistemas & Arquitectura',
      content: `
        <p>Uno de los desafíos más frecuentes en los proyectos de TI reside en la brecha entre las necesidades operativas de la organización y su traducción en código mantenible. Como analista y desarrollador, el valor central no está en codificar inmediatamente, sino en estructurar adecuadamente el dominio del problema.</p>
        <br>
        <h4>Principios clave en la fase de análisis:</h4>
        <ul style="margin-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 1rem; line-height: 1.8;">
          <li><strong>Mapeo de flujos de negocio:</strong> Identificar actores, entradas, transformaciones y cuellos de botella antes de definir esquemas de tablas o endpoints.</li>
          <li><strong>Desacoplamiento de capas:</strong> Separar estrictamente la lógica de negocio de los frameworks de persistencia o controladores HTTP (facilitando migraciones futuras entre CodeIgniter, Laravel u otros entornos).</li>
          <li><strong>Documentación viva:</strong> Diseñar diagramas de entidad-relación y contratos de API antes de iniciar la implementación.</li>
        </ul>
        <p>Una arquitectura sólida no es la más sofisticada, sino aquella que permite a la empresa adaptarse a cambios operativos con el menor costo de refactorización.</p>
      `
    },
    'art-2': {
      title: 'Optimización de Consultas Relacionales en MySQL y MariaDB para Aplicaciones Web',
      tag: 'Bases de Datos & Rendimiento',
      content: `
        <p>En sistemas con miles de registros diarios, las consultas deficientes se convierten en el primer cuello de botella del servidor. La indexación estratégica y la comprensión del plan de ejecución (<code>EXPLAIN</code>) marcan la diferencia entre tiempos de respuesta de milisegundos y caídas de servidor.</p>
        <br>
        <h4>Estrategias de optimización probadas:</h4>
        <ul style="margin-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 1rem; line-height: 1.8;">
          <li><strong>Índices compuestos efectivos:</strong> Crear índices respetando el principio del prefijo más a la izquierda (leftmost prefix) según los filtros <code>WHERE</code> y órdenes <code>ORDER BY</code> más frecuentes.</li>
          <li><strong>Evitar SELECT * en entornos productivos:</strong> Solicitar únicamente las columnas estrictamente necesarias reduce el uso de memoria de buffer y tráfico de red.</li>
          <li><strong>Manejo de paginación por cursor:</strong> En conjuntos de datos masivos, reemplazar <code>OFFSET</code> elevados por condiciones de rango (ej. <code>WHERE id > last_seen_id</code>).</li>
        </ul>
      `
    },
    'art-3': {
      title: 'Diseño Seguro y Mantenible de APIs REST Empresariales',
      tag: 'APIs & Backend',
      content: `
        <p>La integración fluida entre sistemas heterogéneos depende de interfaces de programación consistentes, predecibles y seguras. Al construir APIs en PHP o microservicios, apegarse a las convenciones REST y una autenticación robusta evita errores críticos de integración.</p>
        <br>
        <h4>Buenas prácticas de integración:</h4>
        <ul style="margin-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 1rem; line-height: 1.8;">
          <li><strong>Respuestas normalizadas:</strong> Estructurar siempre las salidas con un formato predecible (status, code, data, error_message, timestamp).</li>
          <li><strong>Idempotencia en métodos HTTP:</strong> Asegurar que las solicitudes <code>PUT</code> y <code>DELETE</code> no generen efectos secundarios colaterales imprevistos ante reintentos.</li>
          <li><strong>Validación estricta y sanitización:</strong> Todo payload entrante debe ser verificado en servidor antes de procesar transacciones en la capa de datos.</li>
        </ul>
      `
    }
  };

  if (blogTriggers && blogModal) {
    blogTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const articleId = btn.getAttribute('data-article');
        const art = blogArticlesData[articleId];

        if (art && modalTitle && modalTag && modalBody) {
          modalTitle.textContent = art.title;
          modalTag.textContent = art.tag;
          modalBody.innerHTML = art.content;
          blogModal.style.display = 'flex';
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeModal = () => {
      blogModal.style.display = 'none';
      document.body.style.overflow = '';
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    blogModal.addEventListener('click', (e) => {
      if (e.target === blogModal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && blogModal.style.display === 'flex') {
        closeModal();
      }
    });
  }

  // 6. Año dinámico en el footer
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 7. Navegación táctil ágil sección por sección en dispositivos móviles
  const allSectionsList = Array.from(sections);
  let isSectionTransitioning = false;
  let touchStartY = 0;
  let touchStartX = 0;
  let touchStartTime = 0;

  const getCurrentSectionIndex = () => {
    const viewportMiddle = window.scrollY + (window.innerHeight / 2);
    let closestIndex = 0;
    let minDistance = Infinity;

    allSectionsList.forEach((sec, idx) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const middle = top + (height / 2);
      const distance = Math.abs(viewportMiddle - middle);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });
    return closestIndex;
  };

  const navigateToSection = (targetIndex) => {
    if (targetIndex < 0 || targetIndex >= allSectionsList.length) return;
    const targetSection = allSectionsList[targetIndex];
    if (targetSection) {
      isSectionTransitioning = true;
      targetSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        isSectionTransitioning = false;
      }, 700);
    }
  };

  window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      touchStartTime = Date.now();
    }
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    // Si el menú móvil o modal de blog están abiertos, permitir interacción normal
    if (navMenu?.classList.contains('open') || (blogModal && blogModal.style.display === 'flex')) {
      return;
    }
    if (isSectionTransitioning) return;

    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaY = touchEndY - touchStartY;
    const deltaX = touchEndX - touchStartX;
    const duration = Date.now() - touchStartTime;

    // Solo activar si es un swipe claramente vertical y ágil (evita interferir con swipe horizontal de tarjetas)
    if (Math.abs(deltaY) > 40 && Math.abs(deltaY) > Math.abs(deltaX) * 1.3 && duration < 850) {
      const currentIndex = getCurrentSectionIndex();

      if (deltaY < 0) {
        // Gesto hacia arriba -> Avanzar a la siguiente sección
        if (currentIndex < allSectionsList.length - 1) {
          navigateToSection(currentIndex + 1);
        }
      } else {
        // Gesto hacia abajo -> Retroceder a la sección anterior
        if (currentIndex > 0) {
          navigateToSection(currentIndex - 1);
        }
      }
    }
  }, { passive: true });
});
