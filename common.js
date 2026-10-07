// Shared page chrome: header, links to the other tools, tip box and footer.
const TOOLS = [
  { href: '/verifactu-obligado.html', v: 'ZminobVQWaU', t: '¿Estoy obligado a Verifactu?', d: 'Test de cuatro preguntas: si te afecta, desde cuándo y qué hacer.' },
  { href: '/cuota-autonomos.html', v: 'BVCKPpie9lE', t: 'Cuota de autónomos 2026', d: 'Tu tramo y tu cuota mensual según lo que ganas, con la tabla oficial.' },
  { href: '/calculadora-sueldo-neto.html', t: 'Calculadora de sueldo neto 2026', d: 'De bruto a neto: IRPF, Seguridad Social y lo que cobras al mes.' },
  { href: '/presupuesto-rapido/', v: 'Ea9s3TWvJQw', t: 'Presupuestos en PDF', d: 'Crea un presupuesto profesional y guárdalo en PDF.' },
  { href: '/calculadora-iva.html', v: 'e00s7SLb8Is', t: 'Calculadora de IVA e IRPF', d: 'Añade o quita el IVA y calcula la retención de una factura.' },
  { href: '/calculadora-precio-hora.html', v: 'dJ7DoIOUpik', t: 'Calculadora de precio por hora', d: 'Cuánto cobrar por hora para llegar al sueldo que quieres.' },
  { href: '/calculadora-margen.html', v: '56o8-2hlj_s', t: 'Calculadora de margen', d: 'Margen, recargo y precio de venta a partir del coste.' },
  { href: '/validar-dni-nie-cif-iban.html', v: 'WVFVEKRCkm4', t: 'Validar DNI, NIE, CIF e IBAN', d: 'Comprueba un documento o una cuenta y calcula la letra.' },
  { href: '/calculadora-vencimiento.html', v: 'y3_9uB_aK5k', t: 'Vencimiento de facturas', d: 'Fecha de pago a 30, 60 o 90 días y días que faltan.' },
  { href: '/generador-qr.html', v: 'oj0670hS200', t: 'Generador de QR y QR de WiFi', d: 'Crea un código QR de un enlace, un texto o tu WiFi.' },
  { href: '/calculadora-porcentajes.html', v: 'X8oD9vKaHnk', t: 'Calculadora de porcentajes', d: 'Porcentaje de una cantidad, descuento y subida o bajada.' },
  { href: '/calculadora-hipoteca.html', t: 'Calculadora de hipoteca y préstamo', d: 'Cuota al mes, intereses totales y cuadro de amortización.' },
  { href: '/calculadora-interes-compuesto.html', t: 'Calculadora de interés compuesto', d: 'Cuánto crece tu ahorro con aportaciones mensuales.' },
  { href: '/numero-a-letras.html', v: '_gMS8LSxF1g', t: 'Número a letras', d: 'Convierte un importe en euros a texto para recibos y contratos.' },
  { href: '/calculadora-intereses-demora.html', v: 'RPapcnbB0PI', t: 'Intereses de demora', d: 'Cuánto reclamar por una factura pagada con retraso.' },
  { href: '/calculadora-punto-equilibrio.html', v: 'XCDQ2NJVszY', t: 'Punto de equilibrio', d: 'Cuánto tienes que vender al mes para cubrir gastos.' },
  { href: '/calculadora-recargo-equivalencia.html', v: 'k3KBN0QWcZc', t: 'Recargo de equivalencia', d: 'IVA más recargo del 5,2 %, 1,4 % o 0,5 % en una factura.' },
  { href: '/contador-palabras.html', v: 'XMgbJr79WAg', t: 'Contador de palabras y caracteres', d: 'Palabras, caracteres, líneas y tiempo de lectura de un texto.' }
];
// Google Analytics measurement ID (G-XXXXXXXXXX). While it is empty, nothing is loaded and no banner is shown.
const GA_ID = 'G-7R9R81Q7K5';
const eur = (n) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);
const pct = (n) => new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 }).format(n) + ' %';
const $ = (s) => document.querySelector(s);

(function () {
  const here = location.pathname.replace(/index\.html$/, '');
  const head = document.createElement('header');
  head.className = 'top';
  head.innerHTML = '<a href="/">Herramientas para autónomos</a><span>gratis y sin registro</span>';
  document.body.prepend(head);

  // Plain link to the tutorial (no embedded player, so nothing is loaded from YouTube until the visitor clicks).
  const me = TOOLS.find((x) => x.href === here);
  const lead = document.querySelector('main .lead');
  if (me && me.v && lead) {
    const p = document.createElement('p');
    p.className = 'note';
    p.innerHTML = `▶ <a href="https://youtu.be/${me.v}" target="_blank" rel="noopener">Ver cómo funciona en un vídeo de medio minuto</a> (YouTube)`;
    lead.after(p);
  }

  const after = document.createElement('div');
  after.className = 'after';
  const others = TOOLS.filter((x) => x.href !== here);
  after.innerHTML = `
    <div class="tip">
      <p>¿Te ha sido útil? Estas herramientas son gratis y no tienen anuncios. Si quieres, invítame a un café:</p>
      <a href="https://paypal.me/codedypilla/2EUR" target="_blank" rel="noopener">2 €</a>
      <a href="https://paypal.me/codedypilla/5EUR" target="_blank" rel="noopener">5 €</a>
      <a href="https://paypal.me/codedypilla/10EUR" target="_blank" rel="noopener">10 €</a>
    </div>
    ${here === '/' ? '' : `<h2>Más herramientas</h2><ul class="tools">${others.map((x) => `<li><a href="${x.href}"><strong>${x.t}</strong><span>${x.d}</span></a></li>`).join('')}</ul>`}`;
  document.body.append(after);

  const foot = document.createElement('footer');
  // Analytics is opt-in: the script is only requested after the visitor accepts, and the choice is remembered.
  const CONSENT = 'cookie-consent';
  const choice = () => { try { return localStorage.getItem(CONSENT); } catch { return null; } };
  const remember = (v) => { try { v ? localStorage.setItem(CONSENT, v) : localStorage.removeItem(CONSENT); } catch { /* storage blocked */ } };
  function loadAnalytics() {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.append(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID);
  }
  function dropAnalyticsCookies() {
    document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter((n) => n.startsWith('_ga')).forEach((n) => {
      document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${location.hostname}`;
    });
  }
  function askConsent() {
    const bar = document.createElement('div');
    bar.className = 'consent';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Cookies');
    bar.innerHTML = '<p>Usamos cookies de Google Analytics para saber qué herramientas se usan más. Lo que escribes en las calculadoras no se envía. <a href="/privacidad.html">Más información</a></p><div><button type="button" data-v="no">Rechazar</button><button type="button" data-v="yes">Aceptar</button></div>';
    bar.addEventListener('click', (e) => {
      const v = e.target.dataset.v;
      if (!v) return;
      remember(v);
      bar.remove();
      if (v === 'yes') loadAnalytics();
    });
    document.body.append(bar);
  }
  if (GA_ID) {
    if (choice() === 'yes') loadAnalytics();
    else if (!choice()) askConsent();
    // The privacy page has a button to change the choice.
    document.getElementById('cookieReset')?.addEventListener('click', () => { remember(null); dropAnalyticsCookies(); location.reload(); });
  }

  foot.innerHTML = 'Los cálculos se hacen en tu navegador; lo que escribes no se envía a ningún sitio. Resultados orientativos, no son asesoramiento fiscal. · Hecho con Claude Code · <a href="https://github.com/codedypilla-pixel/codedypilla-pixel.github.io">Código</a> · <a href="https://www.youtube.com/@herramientas-autonomos" target="_blank" rel="noopener">Tutoriales en YouTube</a>' + (GA_ID ? ' · <a href="/privacidad.html">Privacidad y cookies</a>' : '');
  document.body.append(foot);
})();
