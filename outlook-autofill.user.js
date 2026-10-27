// ==UserScript==
// @name         Microsoft Outlook AutoFill Reroll Helper
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  Isi otomatis form signup Microsoft dari Reroll Manager: email lengkap, password, tanggal lahir, nama
// @match        *://signup.live.com/*
// @match        *://login.live.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const STORE_KEY = 'outlook_autofill';
    const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    // ---------------------------------------------------------------
    // Parameter handling
    // ---------------------------------------------------------------

    function parseHash(raw) {
        if (!raw) return null;
        const out = {};
        raw.split('&').forEach((part) => {
            const eq = part.indexOf('=');
            if (eq < 1) return;
            const key = decodeURIComponent(part.slice(0, eq));
            let val = part.slice(eq + 1).replace(/\+/g, ' ');
            try { val = decodeURIComponent(val); } catch (e) { /* keep raw */ }
            out[key] = val;
        });
        return Object.keys(out).length ? out : null;
    }

    // signup.live.com menulis ulang URL dan membuang hash, jadi simpan dulu di sini.
    function captureHash() {
        const p = parseHash(location.hash.replace(/^#/, ''));
        if (!p || (!p.email && !p.prefix)) return;
        try { sessionStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) {}
    }

    captureHash();
    window.addEventListener('hashchange', captureHash);

    function normalizeParams(p) {
        const out = Object.assign({}, p);
        let email = String(p.email || '').trim();
        let prefix = String(p.prefix || '').trim();
        let domain = String(p.domain || '').trim();

        if (email.indexOf('@') > -1) {
            const parts = email.split('@');
            if (!prefix) prefix = parts[0];
            if (!domain) domain = '@' + parts.slice(1).join('@');
        }
        if (!domain) domain = '@outlook.com';
        if (domain.charAt(0) !== '@') domain = '@' + domain;
        if (!prefix && email) prefix = email.split('@')[0];
        if (!email && prefix) email = prefix + domain;

        out.prefix = prefix;
        out.domain = domain;
        out.email = email;
        out.pass = String(p.pass || '');

        let m = parseInt(p.dobMonth, 10);
        if (isNaN(m)) m = 0;
        if (m > 11) m = Math.min(11, m - 1); // terima input 1-based juga
        out.monthIndex = m;
        out.monthName = String(p.dobMonthName || MONTHS_EN[m] || 'January').trim();

        let d = parseInt(p.dobDay, 10);
        if (isNaN(d)) d = 1;
        out.day = Math.min(31, Math.max(1, d));
        out.year = String(p.dobYear || '1995').trim();

        return out;
    }

    function getParams() {
        let raw = null;
        try { raw = sessionStorage.getItem(STORE_KEY); } catch (e) {}
        let p = null;
        if (raw) { try { p = JSON.parse(raw); } catch (e) { p = null; } }
        if (!p) p = parseHash(location.hash.replace(/^#/, ''));
        return p ? normalizeParams(p) : null;
    }

    // ---------------------------------------------------------------
    // Badge
    // ---------------------------------------------------------------

    function setBadge(text, color) {
        if (!document.body) return;
        let b = document.getElementById('reroll-badge');
        if (!b) {
            b = document.createElement('div');
            b.id = 'reroll-badge';
            b.style.cssText = 'position:fixed;top:12px;right:12px;z-index:2147483647;padding:8px 14px;' +
                'border-radius:8px;font:600 12px/1.45 system-ui,"Segoe UI",sans-serif;' +
                'box-shadow:0 4px 16px rgba(0,0,0,.45);pointer-events:none;max-width:340px;' +
                'word-break:break-word;transition:background-color .2s';
            document.body.appendChild(b);
        }
        b.textContent = text;
        b.style.background = color || '#42b883';
        b.style.color = (color === '#1890ff' || color === '#f00') ? '#fff' : '#0a0d14';
    }

    // ---------------------------------------------------------------
    // DOM helpers
    // ---------------------------------------------------------------

    function cssEscape(s) {
        try { return CSS.escape(s); } catch (e) { return String(s).replace(/[^a-zA-Z0-9_-]/g, '\\$&'); }
    }

    function isVisible(el) {
        if (!el || !el.isConnected || el.hidden) return false;
        const r = el.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) return false;
        const cs = getComputedStyle(el);
        return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.visibility !== 'collapse' && cs.opacity !== '0';
    }

    // Label Fluent UI bisa lewat aria-label, aria-labelledby, <label for>, atau <label> pembungkus.
    // Sumber pertama yang ditemukan dipakai; name/id/placeholder hanya jadi petunjuk tambahan.
    function labelText(el) {
        const strong = [];
        const hints = [];

        const al = el.getAttribute('aria-label');
        if (al) strong.push(al);

        const by = el.getAttribute('aria-labelledby');
        if (by) {
            const text = by.split(/\s+/).map((id) => {
                const n = document.getElementById(id);
                return n ? n.textContent : '';
            }).join(' ');
            if (text.trim()) strong.push(text);
        }

        if (!strong.length && el.id) {
            const l = document.querySelector('label[for="' + cssEscape(el.id) + '"]');
            if (l) strong.push(l.textContent);
        }

        if (!strong.length && el.closest) {
            const wrap = el.closest('label');
            if (wrap) strong.push(wrap.textContent);
        }

        if (!strong.length && el.parentElement) {
            const l = el.parentElement.querySelector('label');
            if (l) strong.push(l.textContent);
        }

        hints.push(el.getAttribute('placeholder') || '');
        hints.push(el.getAttribute('name') || '');
        hints.push(el.id || '');

        return (strong.join(' ') + ' ' + hints.join(' '))
            .toLowerCase().replace(/\s+/g, ' ').trim();
    }

    function visibleInputs(types) {
        return Array.prototype.filter.call(
            document.querySelectorAll('input, textarea'),
            (el) => {
                const t = (el.getAttribute('type') || 'text').toLowerCase();
                return types.indexOf(t) > -1 && isVisible(el) && !el.disabled;
            }
        );
    }

    function visibleOptions() {
        const boxes = Array.prototype.filter.call(document.querySelectorAll('[role="listbox"]'), isVisible);
        if (boxes.length) {
            const opts = Array.prototype.filter.call(
                boxes[boxes.length - 1].querySelectorAll('[role="option"]'), isVisible);
            if (opts.length) return opts;
        }
        return Array.prototype.filter.call(document.querySelectorAll('[role="option"]'), isVisible);
    }

    function findPassword() {
        return visibleInputs(['password'])[0] || null;
    }

    function findEmail(exclude) {
        const inputs = visibleInputs(['text', 'email'])
            .filter((el) => !exclude.has(el) && !el.readOnly);
        const typed = inputs.find((el) => (el.getAttribute('type') || '').toLowerCase() === 'email');
        if (typed) return typed;
        const labelled = inputs.find((el) => /email|e-mail|mail|membername|username/.test(labelText(el)));
        if (labelled) return labelled;
        if (inputs.length === 1) {
            // Jangan anggap input tunggal sebagai email kalau labelnya jelas field lain
            // (mis. halaman kode verifikasi).
            if (!/code|kode|verif|name|nama|year|tahun|phone|telepon|nomor/.test(labelText(inputs[0]))) {
                return inputs[0];
            }
        }
        return null;
    }

    function findNames() {
        const inputs = visibleInputs(['text']).filter((el) => !el.readOnly);
        if (inputs.length < 2) return null;
        const first = inputs.find((el) => /first|given|depan/.test(labelText(el)));
        const last = inputs.find((el) => /last|surname|family|belakang/.test(labelText(el)));
        if (first && last && first !== last) return { first: first, last: last };
        if (!first && !last && inputs.length === 2) return { first: inputs[0], last: inputs[1] };
        return null;
    }

    function findDob() {
        const combos = Array.prototype.filter.call(
            document.querySelectorAll('[role="combobox"], [aria-haspopup="listbox"]'), isVisible);
        const selects = Array.prototype.filter.call(document.querySelectorAll('select'), isVisible);
        if (!combos.length && !selects.length) return null;

        const all = combos.concat(selects);
        const pick = (re) => all.find((el) => re.test(labelText(el)));

        let month = pick(/month|bulan/);
        let day = pick(/day|tanggal/);
        let year = pick(/year|tahun/);

        // Cadangan kalau label tidak terbaca: urutan Fluent biasanya Country, Month, Day.
        // Hanya dipakai kalau memang ada petunjuk "birth", supaya dropdown lain tidak salah dikira DOB.
        const birthHint = all.some((el) => /birth|lahir/.test(labelText(el)));
        if ((!month || !day) && (birthHint || combos.length >= 3)) {
            if (combos.length >= 3) {
                month = month || combos[1];
                day = day || combos[2];
            } else if (combos.length === 2) {
                month = month || combos[0];
                day = day || combos[1];
            } else if (selects.length >= 2) {
                month = month || selects[selects.length - 2];
                day = day || selects[selects.length - 1];
            }
        }

        if (!year) {
            year = visibleInputs(['text', 'number']).find((el) => /year|tahun/.test(labelText(el))) || null;
        }

        if (!month || !day) return null;
        return { month: month, day: day, year: year, all: all };
    }

    function detectPage() {
        const password = findPassword();
        const dob = findDob();
        const names = findNames();

        const claimed = new Set();
        if (password) claimed.add(password);
        if (dob) {
            claimed.add(dob.month);
            claimed.add(dob.day);
            if (dob.year) claimed.add(dob.year);
        }
        if (names) { claimed.add(names.first); claimed.add(names.last); }

        return { email: findEmail(claimed), password: password, dob: dob, names: names };
    }

    function pageSig(page) {
        return [page.email && 'email', page.password && 'password',
                page.dob && 'dob', page.names && 'name'].filter(Boolean).join('+');
    }

    // ---------------------------------------------------------------
    // Writing values / clicking
    // ---------------------------------------------------------------

    function setInputValue(el, value) {
        const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        const desc = Object.getOwnPropertyDescriptor(proto, 'value');
        try {
            if (desc && desc.set) desc.set.call(el, value);
            else el.value = value;
        } catch (e) {
            el.value = value;
        }
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function clickEl(el) {
        if (!el) return;
        try { el.focus(); } catch (e) {}
        el.click();
    }

    function clickNext() {
        const disabled = (el) => el.disabled || el.getAttribute('aria-disabled') === 'true';
        const nodes = document.querySelectorAll(
            'button, input[type="submit"], input[type="button"], a[role="button"], [role="button"]');
        const candidates = Array.prototype.filter.call(nodes, (el) => isVisible(el) && !disabled(el));
        const textOf = (el) => String(el.innerText || el.value || el.textContent || '')
            .replace(/\s+/g, ' ').trim().toLowerCase();
        const labels = ['next', 'berikutnya', 'lanjut', 'selanjutnya', 'continue'];

        const byText = candidates.find((el) => labels.indexOf(textOf(el)) > -1);
        if (byText) { byText.click(); return true; }

        const byId = document.querySelector('#iSignupAction');
        if (byId && isVisible(byId) && !disabled(byId)) { byId.click(); return true; }

        const submit = document.querySelector('form button[type="submit"], form input[type="submit"]');
        if (submit && isVisible(submit) && !disabled(submit)) { submit.click(); return true; }

        return false;
    }

    // ---------------------------------------------------------------
    // Field fillers
    // ---------------------------------------------------------------

    // Di alur "email baru", domain tampil sebagai teks di sebelah input (@outlook.com).
    function detectSuffixDomain(input) {
        const candidates = [];
        if (input.nextElementSibling) candidates.push(input.nextElementSibling);
        if (input.previousElementSibling) candidates.push(input.previousElementSibling);
        const parent = input.parentElement;
        if (parent) {
            Array.prototype.forEach.call(parent.children, (child) => {
                if (child !== input) candidates.push(child);
            });
        }
        for (let i = 0; i < candidates.length; i++) {
            const t = String(candidates[i].textContent || '').replace(/\s+/g, '').trim();
            if (/^@[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(t)) return t;
        }
        return null;
    }

    async function fillEmail(input, p) {
        const suffix = detectSuffixDomain(input);
        let want = p.email;

        if (suffix) {
            const domain = suffix.toLowerCase();
            if (p.email.toLowerCase().slice(-domain.length) === domain) {
                want = p.email.slice(0, -domain.length);
            } else {
                want = p.prefix;
                setBadge('⚠️ Domain halaman ' + suffix + ', draft ' + p.domain, '#faad14');
            }
        }

        if ((input.value || '').trim() === want) return;
        setInputValue(input, want);
        await sleep(200);
        if ((input.value || '').trim() !== want) setInputValue(input, want);
        await sleep(150);
    }

    async function fillPassword(input, p) {
        if (p.pass && input.value !== p.pass) {
            setInputValue(input, p.pass);
            await sleep(150);
            if (input.value !== p.pass) setInputValue(input, p.pass);
        }
        const promo = document.querySelector('#ShowPromotionsCheckbox, input[name="ShowPromotions"]');
        if (promo && promo.checked) promo.click();
        await sleep(150);
    }

    async function fillNames(n, p) {
        if (p.first && n.first.value !== p.first) setInputValue(n.first, p.first);
        if (p.last && n.last.value !== p.last) setInputValue(n.last, p.last);
        await sleep(150);
    }

    function pickOption(list, opts) {
        const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        if (opts.text) {
            const want = norm(opts.text);
            const exact = list.find((o) => norm(o.textContent) === want);
            if (exact) return exact;
            if (want.length > 1) {
                const partial = list.find((o) => norm(o.textContent).indexOf(want) > -1);
                if (partial) return partial;
            }
        }
        if (typeof opts.index === 'number' && opts.index >= 0 && opts.index < list.length) {
            return list[opts.index];
        }
        return null;
    }

    function chooseSelect(sel, opts) {
        const options = Array.prototype.filter.call(sel.options, (o) => {
            const t = String(o.textContent || '').trim();
            return o.value !== '' && !/^(month|bulan|day|tanggal|year|tahun|select|pilih)$/i.test(t);
        });
        const target = pickOption(options, opts);
        if (!target) return false;
        sel.value = target.value;
        sel.dispatchEvent(new Event('input', { bubbles: true }));
        sel.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
    }

    async function choose(el, opts) {
        if (!el) return false;
        const tag = el.tagName.toLowerCase();

        if (tag === 'select') return chooseSelect(el, opts);

        if (tag === 'input') {
            setInputValue(el, String(opts.text || ''));
            await sleep(150);
            el.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true
            }));
            return true;
        }

        clickEl(el);
        await sleep(400);

        let list = visibleOptions();
        if (!list.length) { await sleep(350); list = visibleOptions(); }
        if (!list.length) return false;

        const target = pickOption(list, opts);
        if (!target) return false;

        target.click();
        await sleep(250);
        return true;
    }

    async function fillDob(dob, p) {
        const monthText = p.monthName || MONTHS_EN[p.monthIndex];
        await choose(dob.month, { index: p.monthIndex, text: monthText });
        await sleep(250);

        // Dropdown bisa dirender ulang setelah pilihan pertama, jadi ambil elemen baru.
        const afterMonth = findDob();
        await choose((afterMonth && afterMonth.day) || dob.day, { index: p.day - 1, text: String(p.day) });
        await sleep(250);

        const afterDay = findDob();
        const yearEl = (afterDay && afterDay.year) || dob.year;
        if (yearEl) await choose(yearEl, { text: p.year });
    }

    // ---------------------------------------------------------------
    // Main loop
    // ---------------------------------------------------------------

    let busy = false;
    let lastRun = { sig: '', at: 0, tries: 0 };
    let lastFormAt = 0;
    const startedAt = Date.now();

    async function tick() {
        if (busy || !document.body) return;

        if (Date.now() - startedAt > 15 * 60 * 1000) {
            clearInterval(timer);
            setBadge('⏱️ Auto-fill berhenti (15 menit)', '#888');
            return;
        }

        const p = getParams();
        if (!p || !p.email) { setBadge('Siap — buka link dari Reroll Manager', '#888'); return; }

        const page = detectPage();
        const sig = pageSig(page);

        if (sig) lastFormAt = Date.now();

        if (!sig) {
            // Form tidak muncul lagi setelah semua langkah: bersihkan data supaya
            // tab ini tidak mengisi ulang form lain dengan data akun lama.
            if (lastFormAt && Date.now() - lastFormAt > 120000) {
                clearInterval(timer);
                try { sessionStorage.removeItem(STORE_KEY); } catch (e) {}
                setBadge('✅ Selesai — auto-fill berhenti', '#52c41a');
                return;
            }
            setBadge('Menunggu form Microsoft…', '#faad14');
            return;
        }

        const now = Date.now();
        const same = lastRun.sig === sig;
        if (same && now - lastRun.at < 4000) return;
        if (same && lastRun.tries >= 3) {
            setBadge('⚠️ Macet di ' + sig + ' — halaman tidak berpindah', '#f00');
            return;
        }

        busy = true;
        lastRun = { sig: sig, at: now, tries: same ? lastRun.tries + 1 : 1 };

        try {
            setBadge('Mengisi ' + sig + '…', '#1890ff');

            if (page.email) await fillEmail(page.email, p);
            if (page.password) await fillPassword(page.password, p);
            if (page.dob) await fillDob(page.dob, p);
            if (page.names) await fillNames(page.names, p);

            await sleep(400);
            const clicked = clickNext();
            setBadge(clicked ? '✅ ' + sig + ' terisi — klik Next' : '⚠️ Tombol Next tidak ketemu',
                     clicked ? '#42b883' : '#faad14');
            await sleep(1000);
        } catch (err) {
            console.error('[autofill]', err);
            setBadge('❌ ' + (err && err.message ? err.message : err), '#f00');
        } finally {
            lastRun.at = Date.now();
            busy = false;
        }
    }

    // ---------------------------------------------------------------
    // Debug helper (console)
    // ---------------------------------------------------------------
    window._rerollDebug = function () {
        const p = getParams();
        console.log('=== REROLL DEBUG ===');
        console.log('params:', p ? Object.assign({}, p, { pass: p.pass ? '***' : '' }) : null);
        console.log('page:', detectPage());
        console.log('inputs:', Array.prototype.map.call(document.querySelectorAll('input'), (el) => ({
            id: el.id,
            name: el.name,
            type: el.type,
            visible: isVisible(el),
            label: labelText(el)
        })));
        console.log('comboboxes:', Array.prototype.map.call(document.querySelectorAll('[role="combobox"]'), (el) => ({
            text: String(el.textContent || '').trim(),
            label: labelText(el),
            visible: isVisible(el)
        })));
    };

    const timer = setInterval(tick, 600);
    tick();
})();
