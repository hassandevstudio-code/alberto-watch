/* ===== Alberto checkout page =====
   Steps: details -> delivery -> payment (cash on delivery or card) -> review -> PLACE ORDER (truck animation)
   Cart comes from app.js (CART in localStorage "alb_cart"). The finished order is saved in
   localStorage "alb_last_order" and pages/order-confirmed.html prints the receipt from it. */
(function(){
  /* ---------- EDIT HERE: delivery prices and stores ---------- */
  const FREE_OVER = FREE_DELIVERY_OVER;           /* standard delivery is free above this amount (set in app.js) */
  const METHODS = [
    {id:"standard", label:"Home delivery", note:"2 to 4 working days, insured and boxed", fee:25, freeOver:true},
    {id:"express",  label:"Express delivery", note:"Next working day in major cities", fee:45},
    {id:"pickup",   label:"Pick up from a store", note:"Ready in 2 hours. Free battery check included", fee:0}
  ];
  const STORES = ["Main Showroom, Karachi - 21 Clock Tower Road", "Repair Workshop, Lahore - 8 Mall Arcade", "Airport Boutique, Islamabad - Departures Hall"];
  const STEPS = ["Details", "Delivery", "Payment", "Review"];

  const $c = s => document.querySelector(s);
  const S = {step:0, method:"standard", pay:"cod", loc:""};
  const val = id => ($c("#" + id).value || "").trim();

  /* ---------- helpers ---------- */
  const luhn = d => { if(!/^\d{13,19}$/.test(d)) return false; let s = 0, dbl = false; for(let i = d.length - 1; i >= 0; i--){ let n = +d[i]; if(dbl){ n *= 2; if(n > 9) n -= 9; } s += n; dbl = !dbl; } return s % 10 === 0; };
  const expOk = v => { const m = /^(\d{2})\/(\d{2})$/.exec(v); if(!m) return false; const mo = +m[1], y = 2000 + +m[2], n = new Date(); return mo >= 1 && mo <= 12 && (y > n.getFullYear() || (y === n.getFullYear() && mo >= n.getMonth() + 1)); };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const rows = () => CART.map(line).filter(r => r && !r.w.soldOut);
  const subtotal = () => rows().reduce((a, r) => a + r.q * r.w.price, 0);
  const feeFor = (m, sub) => { const o = METHODS.find(x => x.id === m); if(!o || sub <= 0) return 0; return o.freeOver && sub >= FREE_OVER ? 0 : o.fee; };
  const totals = () => { const s = subtotal(), f = feeFor(S.method, s); return {subtotal: s, delivery: f, total: s + f}; };
  const itemCount = () => rows().reduce((a, r) => a + r.q, 0);
  const tick = () => window.AlbSound && AlbSound.tick();

  /* ---------- summary (right side) ---------- */
  function drawSummary(){
    const t = totals();
    $c("#coItems").innerHTML = rows().map(r => `<div class="co-line"><img src="${r.w.image}" alt=""><div><b>${esc(r.w.name)}</b><small>${esc(LINES[r.w.line] || r.w.line)}${r.w.preorder ? " &middot; Pre-order" : ""}</small><div class="co-qty"><button type="button" data-q="-1" data-id="${r.w.id}" aria-label="Less of ${esc(r.w.name)}">&minus;</button><i>${r.q}</i><button type="button" data-q="1" data-id="${r.w.id}" aria-label="More of ${esc(r.w.name)}">+</button></div></div><span class="lt">${money(r.q * r.w.price)}</span></div>`).join("");
    $c("#coTot").innerHTML = `<div><span>Subtotal (${itemCount()} ${itemCount() === 1 ? "item" : "items"})</span><span>${money(t.subtotal)}</span></div><div><span>Delivery</span><span>${t.delivery ? money(t.delivery) : "Free"}</span></div><div class="grand"><span>Total</span><span>${money(t.total)}</span></div>`;
  }
  $c("#coItems").addEventListener("click", e => {
    const b = e.target.closest("[data-q]"); if(!b) return;
    const it = CART.find(x => x.id === b.dataset.id); if(!it) return;
    it.q = Math.min(12, it.q + +b.dataset.q);
    if(it.q < 1) CART = CART.filter(x => x !== it);
    saveCart(); renderCart(); tick();
    if(!rows().length){ show(); return; }
    drawSummary(); drawNav(); if(S.step === 3) drawReview();
  });

  /* ---------- stepper ---------- */
  function drawSteps(){
    $c("#coSteps").innerHTML = STEPS.map((n, i) => `<li class="${i < S.step ? "done" : i === S.step ? "now" : ""}"${i === S.step ? ' aria-current="step"' : ""}><span>${i < S.step ? "&#10003;" : i + 1}</span><b>${n}</b></li>`).join("");
  }

  /* ---------- delivery methods ---------- */
  function drawMethods(){
    const sub = subtotal();
    $c("#coMethods").innerHTML = METHODS.map(m => { const f = feeFor(m.id, sub); return `<label class="co-opt"><input type="radio" name="dm" value="${m.id}"${S.method === m.id ? " checked" : ""}><span class="dot"></span><span><b>${m.label}</b><small>${m.note}${m.freeOver ? ` &middot; free over ${money(FREE_OVER)}` : ""}</small></span><span class="amt">${f ? money(f) : "Free"}</span></label>`; }).join("");
    $c("#fStore").innerHTML = STORES.map((s, i) => `<option value="${i}">${esc(s)}</option>`).join("");
    applyMethod();
  }
  function applyMethod(){
    const pick = S.method === "pickup";
    $c("#coAddr").hidden = pick; $c("#coPick").hidden = !pick;
  }
  $c("#coMethods").addEventListener("change", e => { if(e.target.name !== "dm") return; S.method = e.target.value; applyMethod(); drawSummary(); drawMethods(); tick(); });

  /* ---------- location button ---------- */
  $c("#coLoc").addEventListener("click", () => {
    const note = $c("#coLocNote"); note.hidden = false;
    if(!navigator.geolocation){ note.textContent = "Your browser cannot share location. Please type your address."; return; }
    note.textContent = "Asking your browser for permission...";
    navigator.geolocation.getCurrentPosition(p => {
      const la = p.coords.latitude.toFixed(5), lo = p.coords.longitude.toFixed(5);
      S.loc = `https://www.google.com/maps?q=${la},${lo}`;
      note.textContent = `Location pinned (${la}, ${lo}). Please still write your street address so our rider can find you.`;
    }, () => { note.textContent = "Could not get your location. Please type your address instead."; }, {timeout: 8000});
  });

  /* ---------- payment ---------- */
  function applyPay(){
    $c("#coCod").hidden = S.pay !== "cod"; $c("#coCardBox").hidden = S.pay !== "card";
  }
  document.querySelectorAll('input[name="pay"]').forEach(r => r.addEventListener("change", () => { S.pay = r.value; applyPay(); tick(); }));
  $c("#fCard").addEventListener("input", e => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim(); });
  $c("#fExp").addEventListener("input", e => { const d = e.target.value.replace(/\D/g, "").slice(0, 4); e.target.value = d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d; });
  $c("#fCvc").addEventListener("input", e => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4); });
  $c("#coDemo").addEventListener("click", () => {
    $c("#fCard").value = "4242 4242 4242 4242"; $c("#fExp").value = "12/" + String((new Date().getFullYear() + 2) % 100).padStart(2, "0"); $c("#fCvc").value = "123";
    $c("#fHolder").value = (val("fName") || "Demo Customer").toUpperCase();
    ["fCard", "fExp", "fCvc", "fHolder"].forEach(id => setErr(id, ""));
  });

  /* ---------- validation ---------- */
  function setErr(id, msg){
    const f = $c("#" + id).closest(".co-field"); if(!f) return;
    f.classList.toggle("bad", !!msg); const e = f.querySelector(".co-err"); if(e) e.textContent = msg || "";
    $c("#" + id).setAttribute("aria-invalid", msg ? "true" : "false");
  }
  const nameOk = v => /^\p{L}[\p{L} '.\-]*$/u.test(v) && (v.match(/\p{L}/gu) || []).length >= 2;
  function validate(step){
    const bad = [];
    const need = (id, ok, msg) => { setErr(id, ok ? "" : msg); if(!ok) bad.push(id); };
    if(step === 0){
      need("fName", val("fName") === "" ? false : nameOk(val("fName")), val("fName") === "" ? "Please enter your full name." : "Name can contain letters only (no numbers or symbols like @).");
      need("fPhone", /^\+?[0-9 ()\-]+$/.test(val("fPhone")) && val("fPhone").replace(/\D/g, "").length >= 8, "Enter a valid phone number (digits only, at least 8).");
      need("fEmail", /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(\.[A-Za-z0-9\-]+)*\.[A-Za-z]{2,}$/.test(val("fEmail")), val("fEmail") === "" ? "Please enter your email address." : "Enter a valid email address, for example name@example.com.");
    }
    if(step === 1 && S.method !== "pickup"){
      need("fAddr", val("fAddr").length >= 5, "Please enter your street address.");
      need("fCity", val("fCity").length >= 2, "Please enter your city.");
      need("fPost", /^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/.test(val("fPost")), "Enter a valid postal code.");
    }
    if(step === 2 && S.pay === "card"){
      need("fCard", luhn(val("fCard").replace(/\s/g, "")), "Enter a valid card number.");
      need("fExp", expOk(val("fExp")), "Use a future date as MM/YY.");
      need("fCvc", /^\d{3,4}$/.test(val("fCvc")), "3 or 4 digits.");
      need("fHolder", nameOk(val("fHolder")), "Enter the name on the card (letters only).");
    }
    if(bad.length) $c("#" + bad[0]).focus();
    return bad.length === 0;
  }
  document.querySelectorAll(".co-field input,.co-field textarea").forEach(i => i.addEventListener("input", () => { if(i.closest(".co-field").classList.contains("bad")) setErr(i.id, ""); }));
  function canPlace(){ for(const i of [0, 1, 2]) if(!validate(i)){ go(i); validate(i); return false; } return true; }

  /* ---------- review ---------- */
  const destination = () => S.method === "pickup" ? "Store pickup: " + STORES[+$c("#fStore").value] : `${val("fAddr")}, ${val("fCity")} ${val("fPost")}${val("fLand") ? " (near " + val("fLand") + ")" : ""}`;
  const payLabel = () => S.pay === "cod" ? "Cash on Delivery" : "Card ending " + val("fCard").replace(/\s/g, "").slice(-4);
  const methodLabel = () => METHODS.find(m => m.id === S.method).label;
  function drawReview(){
    const row = (k, v, st) => `<div class="co-rev"><div><p class="k">${k}</p><p class="v">${esc(v)}</p></div><button type="button" class="co-edit" data-go="${st}">Edit</button></div>`;
    $c("#coReview").innerHTML = row("Contact", `${val("fName")} \u00b7 ${val("fPhone")} \u00b7 ${val("fEmail")}`, 0) + row("Delivery", destination(), 1) + row("Method", methodLabel(), 1) + row("Payment", payLabel(), 2) +
      `<div class="co-rev"><div><p class="k">Items</p><p class="v">${itemCount()} ${itemCount() === 1 ? "watch" : "watches"} &middot; ${money(totals().total)}</p></div></div>`;
  }
  $c("#coReview").addEventListener("click", e => { const b = e.target.closest("[data-go]"); if(b) go(+b.dataset.go); });

  /* ---------- quick fill: one tap fills the current step with demo details and moves on ---------- */
  const DEMO = {name: "Ayesha Khan", phone: "+92 300 1234567", email: "ayesha.khan@example.com", addr: "House 12, Street 5, Block 4, Clifton", city: "Karachi", post: "75600", land: "Dolmen Mall"};
  function quickFill(){
    const put = (id, v) => { $c("#" + id).value = v; setErr(id, ""); };
    if(S.step === 0){ put("fName", DEMO.name); put("fPhone", DEMO.phone); put("fEmail", DEMO.email); }
    else if(S.step === 1){
      if(S.method !== "pickup"){ put("fAddr", DEMO.addr); put("fCity", DEMO.city); put("fPost", DEMO.post); put("fLand", DEMO.land); }
    }
    else if(S.step === 2){
      if(S.pay === "card"){
        put("fCard", "4242 4242 4242 4242"); put("fExp", "12/" + String((new Date().getFullYear() + 2) % 100).padStart(2, "0")); put("fCvc", "123"); put("fHolder", (val("fName") || DEMO.name).toUpperCase());
      }
    }
    else return;
    tick(); go(S.step + 1);
  }
  $c("#coQuick").addEventListener("click", quickFill);

  /* ---------- steps + nav ---------- */
  function go(i){
    S.step = i;
    document.querySelectorAll(".co-step").forEach(s => { s.hidden = +s.dataset.step !== i; });
    if(i === 3) drawReview();
    drawSteps(); drawNav(); $c("#coQuick").hidden = i === 3;
    window.scrollTo({top: 0, behavior: "smooth"});
    setTimeout(() => { const h = document.querySelector(`.co-step[data-step="${i}"] h3`); if(h) h.focus({preventScroll: true}); }, 60);
  }
  function drawNav(){
    const nav = $c("#coNav");
    const back = `<button type="button" class="co-back" id="coBack">${S.step === 0 ? "&larr; Keep shopping" : "&larr; Back"}</button>`;
    if(S.step < 3){
      nav.innerHTML = back + `<button type="button" class="abtn co-next" id="coNext">Continue to ${STEPS[S.step + 1]} &rarr;</button>`;
    }else{
      nav.innerHTML = back + truckButton(`Place order - ${money(totals().total)}`);
      initTruck();
    }
    $c("#coBack").onclick = () => { if(S.step === 0) location.href = "products.html"; else go(S.step - 1); };
    const nx = $c("#coNext"); if(nx) nx.onclick = () => { if(!validate(S.step)) return; tick(); go(S.step + 1); };
  }

  /* =====================================================
     PLACE ORDER button: truck rolls in, loads the package, drives away, then "ORDER READY"
     (same animation as the Veloce store, run with GSAP)
     ===================================================== */
  const TRUCK_START_X = -92, TRUCK_PARK_X = 28, PKG_START_X = -150, PKG_START_Y = -30, PKG_END_X = -24, LIGHTS_OFF = .22, SPEED = .7;
  function truckButton(label){
    return `<button type="button" class="ob" id="ob" aria-label="${esc(label)}">
<span class="ob-glow"></span><span class="ob-sheen" id="obSheen" aria-hidden="true"></span><span class="ob-road" id="obRoad" aria-hidden="true"></span>
<svg class="ob-truck" id="obTruck" viewBox="40 0 295 120" aria-hidden="true">
<rect x="82" y="26" width="170" height="68" rx="8" fill="#f5f6f7"/><rect x="246" y="26" width="58" height="68" rx="10" fill="#ef3340"/>
<rect x="262" y="34" width="32" height="25" rx="5" fill="#2a2d36"/><rect x="262" y="61" width="32" height="25" rx="5" fill="#2a2d36"/>
<rect x="58" y="37" width="24" height="46" rx="7" fill="#f9b81a"/>
<defs><linearGradient id="obBeam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff3a0" stop-opacity=".8"/><stop offset="1" stop-color="#fff3a0" stop-opacity="0"/></linearGradient><clipPath id="obClip"><rect x="-400" y="-100" width="482" height="320"/></clipPath></defs>
<g id="obBeams" opacity="0"><polygon points="314,37 388,16 388,56 314,47" fill="url(#obBeam)"/><polygon points="314,73 388,64 388,104 314,83" fill="url(#obBeam)"/></g>
<g id="obLights" opacity="${LIGHTS_OFF}"><rect x="307" y="35" width="7" height="13" rx="3.5" fill="#f9b81a"/><rect x="307" y="72" width="7" height="13" rx="3.5" fill="#f9b81a"/></g>
<path d="M93 40 H240 M93 80 H240" stroke="#d9dde3" stroke-width="2" opacity=".7"/>
<g clip-path="url(#obClip)"><g id="obPkg" opacity="0"><rect x="142" y="42" width="70" height="38" rx="4" fill="#e9edf3" stroke="#c5ccd6" stroke-width="1.5"/><rect x="146" y="45" width="62" height="5" rx="2.5" fill="#fff" opacity=".9"/><rect x="174" y="42" width="6" height="38" fill="#d1d7df" opacity=".9"/></g></g>
<rect id="obDoorT" x="79.5" y="26" width="5" height="34" rx="2" fill="#cfd4db" stroke="#aeb5bf"/><rect id="obDoorB" x="79.5" y="60" width="5" height="34" rx="2" fill="#cfd4db" stroke="#aeb5bf"/>
</svg>
<span class="ob-labels"><span id="obIdle">${esc(label).toUpperCase()}</span><span class="abs" id="obProg">PROCESSING ORDER</span><span class="abs done" id="obDone">ORDER READY</span></span></button>`;
  }
  let locked = false;
  function initTruck(){
    const b = $c("#ob"); if(!b) return;
    const g = id => "#" + id;
    gsap.set(g("obTruck"), {x: TRUCK_START_X, opacity: 0});
    gsap.set(g("obPkg"), {x: PKG_START_X, y: PKG_START_Y, scale: .86, opacity: 0, transformOrigin: "50% 50%"});
    gsap.set(g("obDoorT"), {svgOrigin: "82 26", rotation: 0}); gsap.set(g("obDoorB"), {svgOrigin: "82 94", rotation: 0});
    gsap.set(g("obLights"), {opacity: LIGHTS_OFF}); gsap.set(g("obBeams"), {opacity: 0}); gsap.set(g("obRoad"), {opacity: 0, backgroundPositionX: "0px"});
    gsap.set(g("obProg"), {opacity: 0, y: 7}); gsap.set(g("obDone"), {opacity: 0, y: 7}); gsap.set(g("obSheen"), {xPercent: -125, opacity: 0});
    b.onclick = () => {
      if(locked || b.disabled) return;
      if(!canPlace()) return;
      locked = true; b.disabled = true; b.style.opacity = 1;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if(reduce){ place(); return; }
      if(window.AlbSound) AlbSound.thud();
      const exitX = b.offsetWidth + 16;
      const tl = gsap.timeline();
      tl.to(g("obIdle"), {opacity: 0, y: -8, duration: .18, ease: "power2.in"}, 0)
        .to(g("obProg"), {opacity: 1, y: 0, duration: .18, ease: "power2.out"}, .04)
        .to(g("obSheen"), {xPercent: 125, opacity: .18, duration: 1.1, ease: "power2.inOut"}, .04)
        .to(g("obTruck"), {x: TRUCK_PARK_X, opacity: 1, duration: .45, ease: "power3.out"}, .08)
        .to(g("obDoorT"), {rotation: 90, duration: .35, ease: "back.out(1.6)", onStart: () => window.AlbSound && AlbSound.door()}, .6)
        .to(g("obDoorB"), {rotation: -90, duration: .35, ease: "back.out(1.6)"}, .6)
        .to(g("obPkg"), {opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.7)"}, .7)
        .to(g("obPkg"), {x: PKG_END_X, duration: .6, ease: "power2.inOut"}, 1.15)
        .to(g("obDoorT"), {rotation: 0, duration: .32, ease: "power2.inOut", onStart: () => window.AlbSound && AlbSound.door()}, 1.85)
        .to(g("obDoorB"), {rotation: 0, duration: .32, ease: "power2.inOut"}, 1.85)
        .to(g("obTruck"), {y: 1.5, duration: .08, yoyo: true, repeat: 1, ease: "power1.inOut"}, 2.12)
        .to(g("obLights"), {opacity: 1, duration: .2, ease: "power2.out"}, 2.3)
        .to(g("obBeams"), {opacity: 1, duration: .3, ease: "power2.out"}, 2.3)
        .to(g("obRoad"), {opacity: 1, duration: .3, ease: "power2.out"}, 2.25)
        .to(g("obRoad"), {backgroundPositionX: "-140px", duration: 1.1, ease: "none"}, 2.25)
        .to(g("obProg"), {opacity: 0, y: -7, duration: .2, ease: "power2.in"}, 2.2)
        .to(g("obTruck"), {x: exitX, duration: .8, ease: "power2.in", onStart: () => window.AlbSound && AlbSound.whoosh()}, 2.35)
        .to(g("obRoad"), {opacity: 0, duration: .3, ease: "power1.in"}, 3.0)
        .to(g("obDone"), {opacity: 1, y: 0, duration: .22, ease: "power2.out", onComplete: () => { if(window.AlbSound) AlbSound.chime(); setTimeout(place, 250 / SPEED); }}, 3.1)
        .timeScale(SPEED);
    };
  }

  /* ---------- place the order: save a snapshot, empty the cart, open the receipt page ---------- */
  function place(){
    const t = totals(), now = new Date();
    const order = {
      ref: "ALB-" + now.getFullYear() + "-" + String(Math.floor(Math.random() * 90000) + 10000),
      placedAt: now.getTime(),
      name: val("fName"), email: val("fEmail"), phone: val("fPhone"),
      destination: destination(), pin: S.method === "pickup" ? "" : S.loc,
      delivery: methodLabel(), payment: payLabel(), paymentType: S.pay, note: val("fNote"),
      lines: rows().map(r => ({name: r.w.name, collection: LINES[r.w.line] || r.w.line, qty: r.q, unit: r.w.price, total: r.q * r.w.price, preorder: !!r.w.preorder})),
      totals: t
    };
    const json = JSON.stringify(order);
    try{ localStorage.setItem("alb_last_order", json); }catch(e){}
    try{ sessionStorage.setItem("alb_last_order", json); }catch(e){}
    CART = []; saveCart(); renderCart();
    location.href = "order-confirmed.html";
  }

  /* ---------- start ---------- */
  function show(){
    const has = rows().length > 0;
    $c("#coEmpty").hidden = has; $c("#coMain").hidden = !has;
    if(!has) return;
    drawMethods(); applyPay(); drawSummary(); go(S.step);
    window.scrollTo(0, 0);
  }
  function start(){
    const buy = qs.get("buy");                      /* "Order now" on a product opens checkout with that watch in the cart */
    if(buy && D.some(w => w.id === buy && !w.soldOut) && !CART.some(x => x.id === buy)){ CART.push({id: buy, q: 1}); saveCart(); renderCart(); }
    if(buy && history.replaceState) history.replaceState(null, "", location.pathname);
    show();
  }
  /* sound switch for the truck animation (off by default, remembered) */
  (function(){
    const sub = document.querySelector("#checkout .sub"); if(!sub || !window.AlbSound) return;
    const b = document.createElement("button"); b.type = "button"; b.className = "co-demo"; b.style.marginBottom = "18px";
    const set = () => { b.textContent = AlbSound.isMuted() ? "\u{1F507} Sound effects: off (tap to turn on)" : "\u{1F50A} Sound effects: on (tap to turn off)"; b.setAttribute("aria-pressed", String(!AlbSound.isMuted())); };
    b.onclick = () => { AlbSound.toggle(); set(); }; set(); sub.after(b);
  })();
  let tries = 0;
  (function wait(){ if(D.length) return start(); if(++tries > 200){ $c("#coEmpty").hidden = false; return; } setTimeout(wait, 40); })();
})();
