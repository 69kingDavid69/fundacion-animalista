(() => {
    'use strict';

    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

    const WA_NUMBER = '573206811424';
    const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    const money = (n) => '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    /* ---------- Menú móvil ---------- */
    const menuBtn = $('#menuBtn');
    const sheet = $('#sheet');

    function setMenu(open) {
        sheet.hidden = !open;
        menuBtn.setAttribute('aria-expanded', String(open));
        menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    }

    menuBtn.addEventListener('click', () => setMenu(sheet.hidden));
    sheet.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

    /* ---------- Marquesina: duplica el contenido para el bucle infinito ---------- */
    const track = $('#track');
    if (track) {
        [...track.children].forEach((node) => track.appendChild(node.cloneNode(true)));
    }

    /* ---------- Efectos de puntero: foco en tarjetas y botones magnéticos ---------- */
    if (window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
        document.addEventListener('pointermove', (e) => {
            const target = e.target instanceof Element ? e.target : null;
            if (!target) return;

            const card = target.closest('.card');
            if (card) {
                const r = card.getBoundingClientRect();
                card.style.setProperty('--mx', `${e.clientX - r.left}px`);
                card.style.setProperty('--my', `${e.clientY - r.top}px`);
            }

            const btn = target.closest('.btn');
            if (btn) {
                const r = btn.getBoundingClientRect();
                btn.style.setProperty('--tx', `${(e.clientX - r.left - r.width / 2) * 0.22}px`);
                btn.style.setProperty('--ty', `${(e.clientY - r.top - r.height / 2) * 0.32}px`);
            }
        }, { passive: true });

        document.addEventListener('pointerout', (e) => {
            const btn = e.target instanceof Element ? e.target.closest('.btn') : null;
            if (btn && !btn.contains(e.relatedTarget)) {
                btn.style.setProperty('--tx', '0px');
                btn.style.setProperty('--ty', '0px');
            }
        });
    }

    /* ---------- Galería con lightbox ---------- */
    const items = $$('.g');
    const lb = $('#lightbox');
    const lbImg = $('#lbImg');
    const lbCount = $('#lbCount');
    let current = 0;
    let opener = null;

    function showPhoto(i) {
        current = (i + items.length) % items.length;
        const img = $('img', items[current]);
        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = img.alt;
        lbCount.textContent = `${current + 1} / ${items.length}`;
    }

    function openLightbox(i, trigger) {
        opener = trigger;
        showPhoto(i);
        lb.hidden = false;
        document.body.style.overflow = 'hidden';
        $('#lbClose').focus();
    }

    function closeLightbox() {
        lb.hidden = true;
        document.body.style.overflow = '';
        if (opener) opener.focus();
    }

    items.forEach((btn, i) => btn.addEventListener('click', () => openLightbox(i, btn)));
    $('#lbClose').addEventListener('click', closeLightbox);
    $('#lbPrev').addEventListener('click', () => showPhoto(current - 1));
    $('#lbNext').addEventListener('click', () => showPhoto(current + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            setMenu(false);
        }
        if (lb.hidden) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPhoto(current - 1);
        if (e.key === 'ArrowRight') showPhoto(current + 1);
    });

    /* ---------- Donaciones ---------- */
    const amountBtns = $$('.amt');
    const methodBtns = $$('[data-method]');
    const customBox = $('#customBox');
    const customInput = $('#monto');
    const customLow = $('#customLow');
    const waDonate = $('#waDonate');
    let amount = 50000;
    let method = 'nequi';

    function donationValue() {
        if (amount !== 'custom') return amount;
        const n = parseInt(customInput.value, 10);
        return n >= 1000 ? n : null;
    }

    function renderDonate() {
        const value = donationValue();

        amountBtns.forEach((btn) => {
            const on = String(amount) === btn.dataset.amount;
            btn.classList.toggle('on', on);
            btn.setAttribute('aria-pressed', String(on));
        });
        customBox.hidden = amount !== 'custom';
        customLow.hidden = !(amount === 'custom' && customInput.value !== '' && !value);

        $$('.js-amount').forEach((el) => { el.textContent = value ? money(value) : 'el valor que elijas'; });

        methodBtns.forEach((btn) => {
            const on = btn.dataset.method === method;
            btn.classList.toggle('on', on);
            btn.setAttribute('aria-pressed', String(on));
        });
        $('#panelNequi').hidden = method !== 'nequi';
        $('#panelQr').hidden = method !== 'qr';

        waDonate.href = waLink(
            'Hola, acabo de donar ' + (value ? `${money(value)} COP ` : '') +
            `por ${method === 'nequi' ? 'Nequi' : 'código QR'}. Te envío el comprobante.`
        );
    }

    amountBtns.forEach((btn) => btn.addEventListener('click', () => {
        amount = btn.dataset.amount === 'custom' ? 'custom' : Number(btn.dataset.amount);
        renderDonate();
        if (amount === 'custom') customInput.focus();
    }));
    methodBtns.forEach((btn) => btn.addEventListener('click', () => { method = btn.dataset.method; renderDonate(); }));
    customInput.addEventListener('input', renderDonate);
    renderDonate();

    /* ---------- Contacto: el formulario abre WhatsApp con el mensaje armado ---------- */
    const nom = $('#nom');
    const tel = $('#tel');
    const msg = $('#msg');
    const waContact = $('#waContact');

    function renderContact() {
        waContact.href = waLink(
            `Hola, soy ${nom.value.trim() || '[mi nombre]'}` +
            (tel.value.trim() ? ` (tel. ${tel.value.trim()})` : '') + `. ${msg.value.trim()}`
        );
    }

    [nom, tel, msg].forEach((el) => el.addEventListener('input', renderContact));
    $('#contactForm').addEventListener('submit', (e) => e.preventDefault());
    renderContact();
})();
