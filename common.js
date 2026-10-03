// Shared page chrome: header, links to the other tools, tip box and footer.
const TOOLS = [
  { href: '/presupuesto-rapido/', t: 'Presupuestos en PDF', d: 'Crea un presupuesto profesional y guárdalo en PDF.' },
  { href: '/calculadora-iva.html', t: 'Calculadora de IVA e IRPF', d: 'Añade o quita el IVA y calcula la retención de una factura.' },
  { href: '/calculadora-precio-hora.html', t: 'Calculadora de precio por hora', d: 'Cuánto cobrar por hora para llegar al sueldo que quieres.' },
  { href: '/calculadora-margen.html', t: 'Calculadora de margen', d: 'Margen, recargo y precio de venta a partir del coste.' },
  { href: '/validar-dni-nie-cif-iban.html', t: 'Validar DNI, NIE, CIF e IBAN', d: 'Comprueba un documento o una cuenta y calcula la letra.' },
  { href: '/calculadora-vencimiento.html', t: 'Vencimiento de facturas', d: 'Fecha de pago a 30, 60 o 90 días y días que faltan.' },
  { href: '/generador-qr.html', t: 'Generador de QR y QR de WiFi', d: 'Crea un código QR de un enlace, un texto o tu WiFi.' }
];
const eur = (n) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);
const pct = (n) => new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 }).format(n) + ' %';
const $ = (s) => document.querySelector(s);

(function () {
  const here = location.pathname.replace(/index\.html$/, '');
  const head = document.createElement('header');
  head.className = 'top';
  head.innerHTML = '<a href="/">Herramientas para autónomos</a><span>gratis y sin registro</span>';
  document.body.prepend(head);

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
  foot.innerHTML = 'Los cálculos se hacen en tu navegador; no se envía ningún dato. Resultados orientativos, no son asesoramiento fiscal. · Hecho con Claude Code · <a href="https://github.com/codedypilla-pixel/codedypilla-pixel.github.io">Código</a>';
  document.body.append(foot);
})();
