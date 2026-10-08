(function(){
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const rp = n => "Rp " + n.toLocaleString("id-ID");
  /* Ganti dengan nomor WhatsApp cafe (format internasional tanpa +) */
  const WA_NUMBER = "6281200000000";
  const wa = text => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

  /* Menu mobile */
  const burger = $("#burger"), nav = $("#nav");
  if (burger) burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");
  });

  /* Teks berjalan */
  const track = $(".track");
  if (track) track.appendChild(track.firstElementChild.cloneNode(true));

  /* Transisi halus antarhalaman */
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href]");
    if (!a || a.target || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || !u.pathname.endsWith(".html")) return;
    e.preventDefault();
    document.body.classList.add("leaving");
    setTimeout(() => { location.href = u.href; }, 400);
  });
  addEventListener("pageshow", () => document.body.classList.remove("leaving"));

  /* ===== MENU ===== */
  const grid = $("#menuGrid");
  if (grid) {
    const MENU = [
      {id:1,cat:"kopi",name:"Kopi Susu Gula Aren",desc:"Espresso, susu segar, dan gula aren cair. Manisnya pas.",price:24000,tag:"hot"},
      {id:2,cat:"kopi",name:"Espresso",desc:"Satu shot pekat untuk yang suka langsung ke intinya.",price:18000},
      {id:3,cat:"kopi",name:"Americano",desc:"Espresso dan air panas, ringan dan bersih.",price:20000},
      {id:4,cat:"kopi",name:"Cafe Latte",desc:"Espresso dengan susu hangat yang lembut.",price:26000},
      {id:5,cat:"kopi",name:"Es Kopi Jeruk",desc:"Kopi hitam dingin dengan perasan jeruk. Segar dan beda.",price:25000,tag:"new"},
      {id:6,cat:"non",name:"Matcha Latte",desc:"Matcha dengan susu, bisa panas atau dingin.",price:28000,tag:"hot"},
      {id:7,cat:"non",name:"Cokelat Panas",desc:"Cokelat pekat dan hangat, cocok untuk hari hujan.",price:25000},
      {id:8,cat:"non",name:"Teh Lemon Madu",desc:"Teh segar dengan lemon dan madu.",price:20000},
      {id:9,cat:"non",name:"Teh Tarik Dingin",desc:"Teh susu berbusa yang manis dan creamy.",price:22000},
      {id:10,cat:"makan",name:"Nasi Ayam Sambal Matah",desc:"Ayam goreng, nasi hangat, dan sambal matah segar.",price:38000,tag:"hot"},
      {id:11,cat:"makan",name:"Mie Goreng Telur",desc:"Mie goreng gurih dengan telur mata sapi.",price:30000},
      {id:12,cat:"makan",name:"Sandwich Telur Alpukat",desc:"Roti panggang, telur, dan alpukat yang lembut.",price:34000,tag:"new"},
      {id:13,cat:"camilan",name:"Croissant Butter",desc:"Renyah di luar, lembut di dalam, dipanggang tiap pagi.",price:22000,tag:"hot"},
      {id:14,cat:"camilan",name:"Donat Glaze",desc:"Donat empuk dengan glaze manis.",price:15000},
      {id:15,cat:"camilan",name:"Pisang Goreng Madu",desc:"Pisang goreng hangat dengan siraman madu.",price:20000},
      {id:16,cat:"camilan",name:"Kentang Goreng",desc:"Garing, asin, cocok dimakan ramai-ramai.",price:22000}
    ];
    const TAGS = {hot:"Favorit", new:"Baru"};
    const qty = {};
    let cat = "semua";

    const actHTML = id => (qty[id] || 0) === 0
      ? `<button class="btn" data-act="add" data-id="${id}">Tambah</button>`
      : `<span class="step"><button data-act="dec" data-id="${id}" aria-label="Kurangi">−</button><b aria-live="polite">${qty[id]}</b><button data-act="inc" data-id="${id}" aria-label="Tambah">+</button></span>`;

    function render() {
      grid.innerHTML = MENU.filter(m => cat === "semua" || m.cat === cat).map(m => `
        <article class="item" data-id="${m.id}">
          <div class="tile" data-cat="${m.cat}"><svg class="ico" aria-hidden="true"><use href="#i-${m.cat}"/></svg></div>
          <div class="body">
            <div class="bar">${m.tag ? `<span class="tag ${m.tag}">${TAGS[m.tag]}</span>` : ""}</div>
            <h3>${m.name}</h3><p>${m.desc}</p>
            <div class="row"><span class="price">${rp(m.price)}</span><span class="act">${actHTML(m.id)}</span></div>
          </div>
        </article>`).join("");
    }

    const bar = $("#orderbar"), dlg = $("#orderDlg");
    function totals() {
      let n = 0, t = 0;
      MENU.forEach(m => { const q = qty[m.id] || 0; n += q; t += q * m.price; });
      return {n, t};
    }
    function refreshBar() {
      const {n, t} = totals();
      $("#obCount").textContent = n + (n === 1 ? " item" : " item");
      $("#obTotal").textContent = rp(t);
      bar.classList.toggle("show", n > 0);
      if (n === 0 && dlg.open) dlg.close();
    }

    grid.addEventListener("click", e => {
      const b = e.target.closest("button[data-act]");
      if (!b) return;
      const id = +b.dataset.id, act = b.dataset.act;
      qty[id] = Math.max(0, (qty[id] || 0) + (act === "dec" ? -1 : 1));
      const slot = $(`.item[data-id="${id}"] .act`, grid);
      slot.innerHTML = actHTML(id);
      const want = qty[id] === 0 ? "add" : (act === "add" ? "inc" : act);
      $(`button[data-act="${want}"]`, slot).focus();
      refreshBar();
    });

    $$(".tab").forEach(t => t.addEventListener("click", () => {
      cat = t.dataset.cat;
      $$(".tab").forEach(x => x.setAttribute("aria-pressed", x === t));
      render();
    }));

    function openOrder() {
      const lines = MENU.filter(m => qty[m.id]);
      $("#lines").innerHTML = lines.map(m => `<li><span>${qty[m.id]}× ${m.name}</span><span>${rp(qty[m.id] * m.price)}</span></li>`).join("");
      $("#dlgTotal").textContent = rp(totals().t);
      updateLink();
      dlg.showModal();
    }
    function updateLink() {
      const lines = MENU.filter(m => qty[m.id]);
      const who = $("#who").value.trim();
      const text = "Halo Selimut Awan, aku mau pesan:\n" +
        lines.map(m => `- ${qty[m.id]}x ${m.name}`).join("\n") +
        `\nTotal: ${rp(totals().t)}` + (who ? `\nAtas nama / meja: ${who}` : "");
      $("#sendWA").href = wa(text);
    }
    $("#openOrder").addEventListener("click", openOrder);
    $("#who").addEventListener("input", updateLink);
    $("#closeDlg").addEventListener("click", () => dlg.close());
    $("#clearOrder").addEventListener("click", () => {
      MENU.forEach(m => qty[m.id] = 0);
      render(); refreshBar();
      if (dlg.open) dlg.close();
    });
    render(); refreshBar();
  }

  /* ===== GALERI ===== */
  const gal = $("#gallery");
  if (gal) {
    const lb = $("#lightbox"), slot = $("#lbSlot");
    gal.addEventListener("click", e => {
      const s = e.target.closest(".shot");
      if (!s) return;
      const c = s.cloneNode(true);
      c.classList.remove("wide");
      c.removeAttribute("aria-haspopup");
      slot.replaceChildren(c);
      lb.showModal();
    });
    $("#lbClose").addEventListener("click", () => lb.close());
    lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });
  }

  /* ===== LOKASI ===== */
  const list = $("#hoursList");
  if (list) {
    const now = new Date(), d = now.getDay(), h = now.getHours();
    const row = $(`[data-day="${d}"]`, list);
    if (row) row.classList.add("today");
    const open = h >= 8 && h < 22;
    $("#openNow").textContent = open ? "Buka sekarang" : "Tutup dulu, buka lagi jam 08.00";
    $("#openDot").classList.toggle("closed", !open);
  }

  /* ===== KONTAK ===== */
  const form = $("#contactForm");
  if (form) {
    const rules = {
      nama: v => v.trim().length >= 2 || "Tulis nama kamu dulu, ya.",
      kontak: v => /^(\+?\d[\d\s-]{7,}|[^\s@]+@[^\s@]+\.[^\s@]+)$/.test(v.trim()) || "Isi nomor WhatsApp atau email yang bisa dihubungi.",
      pesan: v => v.trim().length >= 5 || "Tulis pesan singkat, minimal beberapa kata."
    };
    form.addEventListener("submit", e => {
      e.preventDefault();
      let ok = true;
      Object.keys(rules).forEach(k => {
        const f = form.elements[k], r = rules[k](f.value), msg = $(`#err-${k}`);
        msg.textContent = r === true ? "" : r;
        f.setAttribute("aria-invalid", r !== true);
        if (r !== true && ok) { f.focus(); ok = false; }
      });
      if (!ok) return;
      const f = form.elements;
      const text = `Halo Selimut Awan!\nNama: ${f.nama.value.trim()}\nKontak: ${f.kontak.value.trim()}\nKeperluan: ${f.perlu.value}\n\n${f.pesan.value.trim()}`;
      window.open(wa(text), "_blank", "noopener");
      $("#ok").classList.add("show");
      form.reset();
    });
  }
})();