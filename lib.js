// Pure calculation and validation helpers shared by every tool (also loaded by test.js under Node).
(function (g) {
  const r2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
  const num = (v) => { const n = parseFloat(String(v ?? '').replace(/\s/g, '').replace(',', '.')); return Number.isFinite(n) ? n : 0; };

  const DNI_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const dniLetter = (n) => DNI_LETTERS[n % 23];

  // Spanish DNI / NIE / CIF. `valid` is null when the control character is missing and we can only compute it.
  function checkId(raw) {
    const s = String(raw ?? '').toUpperCase().replace(/[\s.\-]/g, '');
    let m;
    if ((m = /^(\d{8})([A-Z])?$/.exec(s))) {
      const l = dniLetter(+m[1]);
      return { type: 'DNI', valid: m[2] ? m[2] === l : null, control: l, full: m[1] + l };
    }
    if ((m = /^([XYZ])(\d{7})([A-Z])?$/.exec(s))) {
      const l = dniLetter(+('XYZ'.indexOf(m[1]) + m[2]));
      return { type: 'NIE', valid: m[3] ? m[3] === l : null, control: l, full: m[1] + m[2] + l };
    }
    if ((m = /^([ABCDEFGHJNPQRSUVW])(\d{7})([0-9A-J])?$/.exec(s))) {
      let sum = 0;
      [...m[2]].forEach((ch, i) => {
        const d = +ch;
        if (i % 2 === 0) { const x = d * 2; sum += Math.floor(x / 10) + (x % 10); } else sum += d;
      });
      const c = (10 - (sum % 10)) % 10;
      const letter = 'JABCDEFGHI'[c];
      const wantsLetter = 'PQRSNW'.includes(m[1]);
      const wantsDigit = 'ABEH'.includes(m[1]);
      const control = wantsLetter ? letter : String(c);
      let valid = null;
      if (m[3]) valid = wantsLetter ? m[3] === letter : wantsDigit ? m[3] === String(c) : m[3] === letter || m[3] === String(c);
      return { type: 'CIF', valid, control, full: m[1] + m[2] + control };
    }
    return { type: null, valid: false };
  }

  const IBAN_LEN = { ES: 24, PT: 25, FR: 27, DE: 22, IT: 27, GB: 22, IE: 22, NL: 18, BE: 16, AD: 24, LU: 20, AT: 20, CH: 21, PL: 28, RO: 24, SE: 24, DK: 18, NO: 15, FI: 18, GR: 27 };
  function checkIban(raw) {
    const s = String(raw ?? '').toUpperCase().replace(/[\s\-]/g, '');
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(s)) return { valid: false, reason: 'format' };
    const country = s.slice(0, 2);
    const want = IBAN_LEN[country];
    if (want && s.length !== want) return { valid: false, reason: 'length', country, want, got: s.length };
    const digits = (s.slice(4) + s.slice(0, 4)).replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
    let rem = 0;
    for (const ch of digits) rem = (rem * 10 + +ch) % 97;
    return { valid: rem === 1, reason: rem === 1 ? null : 'checksum', country, knownCountry: !!want, formatted: s.replace(/(.{4})/g, '$1 ').trim() };
  }

  // amount is the net base when fromTotal is false, or the VAT-inclusive total when true. IRPF applies to the base.
  function vat(amount, rate, fromTotal, irpf = 0) {
    const base = fromTotal ? r2(amount / (1 + rate / 100)) : r2(amount);
    const tax = fromTotal ? r2(amount - base) : r2(base * rate / 100);
    const withheld = r2(base * irpf / 100);
    return { base, tax, total: r2(base + tax), withheld, payable: r2(base + tax - withheld) };
  }

  function hourlyRate({ net, costs, taxPct, vacWeeks, daysWeek, hoursDay, billablePct }) {
    const t = Math.min(Math.max(taxPct, 0), 95) / 100;
    const yearly = r2((net * 12) / (1 - t) + costs * 12);
    const hours = Math.max(52 - vacWeeks, 0) * daysWeek * hoursDay * (billablePct / 100);
    if (hours <= 0) return { yearly, hours: 0, hour: 0, day: 0 };
    const hour = r2(yearly / hours);
    return { yearly, hours: r2(hours), hour, day: r2(hour * hoursDay * (billablePct / 100)) };
  }

  function margin(cost, price) {
    const profit = r2(price - cost);
    return { profit, margin: price ? r2(profit / price * 100) : 0, markup: cost ? r2(profit / cost * 100) : 0 };
  }
  // Price needed to reach a margin (% of the sale price). Margins of 100 % or more are impossible.
  const priceForMargin = (cost, pct) => (pct >= 100 ? null : r2(cost / (1 - pct / 100)));

  function addDays(iso, days) {
    const d = new Date(iso + 'T12:00:00');
    if (isNaN(d)) return null;
    d.setDate(d.getDate() + Math.round(days));
    return d.toISOString().slice(0, 10);
  }
  const daysBetween = (fromIso, toIso) => Math.round((new Date(toIso + 'T12:00:00') - new Date(fromIso + 'T12:00:00')) / 86400000);

  // WIFI: payload as read by phone cameras; special characters must be backslash-escaped.
  function wifiPayload(ssid, pass, type) {
    const e = (v) => String(v).replace(/([\\;,:"])/g, '\\$1');
    return type === 'nopass' ? `WIFI:T:nopass;S:${e(ssid)};;` : `WIFI:T:${type};S:${e(ssid)};P:${e(pass)};;`;
  }

  const Lib = { r2, num, dniLetter, checkId, checkIban, vat, hourlyRate, margin, priceForMargin, addDays, daysBetween, wifiPayload };
  if (typeof module !== 'undefined' && module.exports) module.exports = Lib; else g.Lib = Lib;
})(typeof globalThis !== 'undefined' ? globalThis : this);
