/* ===== Alberto order confirmed page: thermal receipt printer =====
   Reads the order saved by checkout.js (localStorage "alb_last_order"), starts printing by itself,
   feeds the slip out of the slot, lets the customer TEAR IT OFF, and opens the slip in a draggable 3D view. */
(function(){
  const $c = s => document.querySelector(s);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const DESIGN_W = 340;

  /* ---------- load the order ---------- */
  let data = null;
  try{ data = JSON.parse(localStorage.getItem("alb_last_order") || sessionStorage.getItem("alb_last_order") || "null"); }catch(e){}
  if(!data || !data.ref || !data.lines){ $c("#rpNone").hidden = false; return; }
  $c("#rpPage").hidden = false;
  $c("#rpRef").textContent = data.ref;
  document.title = "Order " + data.ref + " | Alberto Watch Company";
  const fm = n => "$" + Number(n).toLocaleString("en-US");

  /* ---------- the printed slip (plain text so it stays readable) ---------- */
  const row = (k, v) => `<div class="rp-row"><span class="rp-dim">${esc(k)}</span><span>${esc(v)}</span></div>`;
  function sheetHTML(){
    const t = data.totals, first = (data.name.trim().split(" ")[0] || "FRIEND").toUpperCase();
    const date = new Date(data.placedAt).toLocaleString("en-GB", {day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"}).toUpperCase();
    const bars = data.ref.split("").flatMap(ch => { const c = ch.charCodeAt(0); return [1 + (c % 3), 1 + ((c >> 2) % 2), 2 + ((c >> 1) % 2)]; })
      .map((w, i) => `<span style="width:${w * 1.6}px;background:${i % 2 === 0 ? "#16171b" : "transparent"}"></span>`).join("");
    const cod = data.paymentType === "cod";
    return `<div class="rp-sheet">
<div class="rp-logo">ALBERTO</div><div class="rp-c rp-dim">WATCH COMPANY // KARACHI</div><div class="rp-hr"></div>
<div class="rp-c rp-dim" style="letter-spacing:.3em;font-size:.85em">ORDER CONFIRMED</div>
<div class="rp-thanks">THANK YOU, ${esc(first)}</div><div class="rp-hr"></div>
${row("REF", data.ref)}${row("DATE", date)}<div class="rp-hr"></div>
<div class="rp-sec">CUSTOMER</div>${row("NAME", data.name)}${row("EMAIL", data.email)}${data.phone ? row("PHONE", data.phone) : ""}
<div class="rp-sec">DELIVERY</div><div style="word-break:break-word">${esc(data.destination)}</div>${row("METHOD", data.delivery)}
${data.note ? `<div class="rp-dim" style="word-break:break-word">NOTE: ${esc(data.note)}</div>` : ""}<div class="rp-hr"></div>
<div class="rp-sec">ITEMS</div>
${data.lines.map(l => `<div class="rp-item"><div class="rp-b">${esc(l.name)}</div><div class="rp-dim">${esc(l.collection)}${l.preorder ? " · PRE-ORDER" : ""}</div>${row(l.qty + " × " + fm(l.unit), fm(l.total))}</div>`).join("")}
<div class="rp-hr"></div>
${row("SUBTOTAL", fm(t.subtotal))}${row("DELIVERY", t.delivery ? fm(t.delivery) : "FREE")}
<div class="rp-total">${row("TOTAL", fm(t.total))}</div><div class="rp-hr"></div>
${row("PAYMENT", data.payment.toUpperCase())}${cod ? row("DUE ON DELIVERY", fm(t.total)) : row("STATUS", "PAID")}
<div class="rp-c rp-dim" style="margin-top:10px;font-size:.8em;line-height:1.5">DEMONSTRATION ORDER. IT IS RECORDED ON THIS DEVICE ONLY. NOTHING WAS CHARGED, SENT OR DELIVERED.</div>
<div class="rp-bar" aria-hidden="true">${bars}</div><div class="rp-c rp-dim" style="font-size:.85em">${esc(data.ref)}</div></div>`;
  }

  /* ---------- printer state ---------- */
  const stage = $c("#rpStage"), box = $c("#rpBox"), paper = $c("#rpPaper"), holder = $c("#rpFit"), scaler = $c("#rpScaler");
  paper.innerHTML = sheetHTML();
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SCREEN = {idle: "WARMING UP", printing: "PRINTING", ready: "READY // TAP RECEIPT", tearing: "TEARING OFF", torn: "TORN // VIEW SLIP"};
  let state = "idle", fed = 0, H = 0, K = 1, scale = 1, run = 0, raf = 0, canTear = false, torn = null;
  const snd = () => window.AlbSound;

  function setState(s){ state = s; ui(); }
  function ui(){
    $c("#rpState").textContent = SCREEN[state];
    $c("#rpLed").classList.toggle("on", state === "printing");
    $c("#rpPrinter").setAttribute("aria-label", "Receipt printer: " + SCREEN[state].toLowerCase());
    $c("#rpTear").disabled = !canTear || (state !== "printing" && state !== "ready");
    $c("#rpView").disabled = !(state === "printing" || state === "ready" || (state === "torn" && !!torn));
    $c("#rpViewTxt").textContent = state === "torn" ? "View slip 3D" : "View 3D";
    $c("#rpAgain").disabled = state === "printing" || state === "tearing";
    const m = snd() ? AlbSound.isMuted() : true;
    $c("#rpSoundTxt").textContent = m ? "Sound off" : "Sound on"; $c("#rpSound").setAttribute("aria-pressed", String(!m)); $c("#rpSoundWave").style.opacity = m ? .25 : 1;
  }
  function measureH(){ K = box.offsetWidth / DESIGN_W; return paper.offsetHeight * K; }
  function draw(){
    const total = 142 + fed + 36;
    box.style.height = fed + "px";
    paper.style.transform = `translateY(${fed - H}px) scale(${K})`;
    stage.style.height = total + "px";
    holder.style.height = total * scale + "px";
  }
  function applyScale(){
    const Hv = measureH(); H = H ? Hv : H;
    const h = Hv || 520, mobile = window.innerWidth < 768, avail = window.innerHeight - 104 - (mobile ? 150 : 28);
    scale = Math.max(.78, Math.min(avail / (178 + h), 1));
    scaler.style.transform = `scale(${scale})`;
    draw();
  }
  function stopAll(){
    run++; cancelAnimationFrame(raf);
    if(snd()) AlbSound.printerStop(false);
    stage.querySelectorAll(".rp-piece").forEach(n => n.remove());
  }

  /* ---------- print: the slip slides out of the slot ---------- */
  function start(){
    if(state === "tearing") return;
    stopAll(); const id = run;
    box.style.clipPath = ""; stage.style.transition = ""; holder.style.transition = "";
    fed = 0; H = measureH(); applyScale(); canTear = false; setState("printing");
    if(reduceMotion()){ fed = H; draw(); canTear = true; setState("ready"); return; }
    if(snd()) AlbSound.printerStart();
    let last = performance.now(); const begun = last; let acc = 0, steps = 0;
    const loop = now => {
      if(id !== run) return;
      acc += now - last; last = now;
      const interval = now - begun < 500 ? 85 - (now - begun) / 20 : 55;
      while(acc >= interval && fed < H){ acc -= interval; fed = Math.min(H, fed + 8); if(++steps % 2 === 0 && snd()) AlbSound.printerTick(); }
      draw();
      if(fed >= 40 && !canTear){ canTear = true; ui(); }
      if(fed >= H){ setState("ready"); if(snd()) AlbSound.printerStop(true); return; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  }

  /* ---------- tear off ---------- */
  function tear(){
    const was = state; if(was !== "printing" && was !== "ready") return;
    cancelAnimationFrame(raf); run++; const id = run;
    if(snd()){ AlbSound.printerStop(was === "printing"); }
    setState("tearing");
    const reduce = reduceMotion(), W = box.offsetWidth, F = fed, Y = 10, STEP = 8, N = Math.ceil(W / STEP);
    const jy = Array.from({length: N + 1}, (_, i) => Y + (i % 2 ? 4 : -2) + Math.random() * 3);
    const sc = scale, sr = stage.getBoundingClientRect(), br = box.getBoundingClientRect();
    const piece = box.cloneNode(true);
    piece.removeAttribute("role"); piece.removeAttribute("tabindex"); piece.removeAttribute("aria-label"); piece.setAttribute("aria-hidden", "true"); piece.removeAttribute("id");
    piece.querySelectorAll("[id]").forEach(n => n.removeAttribute("id"));
    piece.classList.add("rp-piece");
    piece.style.cssText = `left:${(br.left - sr.left) / sc}px;top:${(br.top - sr.top) / sc}px;width:${W}px;height:${F}px;transform-origin:${W}px ${Y}px;`;
    stage.appendChild(piece);
    const clips = p => {
      const px = p * W, top = [];
      for(let i = 0; i <= N; i++){ const x = Math.min(W, i * STEP); if(x <= px) top.push(`${x}px ${jy[i]}px`); }
      const edge = Math.min(W, (top.length - 1) * STEP);
      piece.style.clipPath = `polygon(${top.concat([`${W}px 0px`, `${W}px ${F}px`, `0px ${F}px`]).join(",")})`;
      box.style.clipPath = `polygon(${["0px 0px", `${W}px 0px`, `${W}px ${F}px`, `${edge}px ${F}px`].concat(top.slice().reverse()).join(",")})`;
    };
    const DUR = reduce ? 300 : 950, t0 = performance.now();
    if(snd()) AlbSound.printerTear(DUR);
    const sweep = now => {
      if(id !== run) return;
      const p = Math.min(1, (now - t0) / DUR), e = p * p * (3 - 2 * p);
      clips(e); piece.style.transform = `rotate(${-e * (reduce ? 0 : 5)}deg) translateY(${e * 3}px)`;
      if(p < 1){ raf = requestAnimationFrame(sweep); return; }
      /* the torn slip lifts out of the printer, comes to the front and opens in 3D */
      const pr = piece.getBoundingClientRect();
      const dx = (window.innerWidth / 2 - (pr.left + pr.width / 2)) / sc, dy = (window.innerHeight / 2 - (pr.top + pr.height / 2)) / sc;
      const LIFT = reduce ? 1 : 560, t1 = performance.now();
      const lift = n => {
        if(id !== run) return;
        const q = Math.min(1, (n - t1) / LIFT), e2 = 1 - Math.pow(1 - q, 3);
        piece.style.transform = `translate(${dx * e2}px,${dy * e2}px) rotate(${-5 * (1 - e2)}deg)`;
        piece.style.opacity = String(1 - Math.max(0, (q - .55) / .45));
        if(q < 1){ raf = requestAnimationFrame(lift); return; }
        piece.remove();
        const Hd = Math.max(120, F / (K || 1)), Nd = Math.ceil(DESIGN_W / 8);
        torn = {w: DESIGN_W, h: Hd, jag: Array.from({length: Nd + 1}, (_, i) => 10 + (i % 2 ? 4 : -2) + Math.random() * 3)};
        fed = 0; box.style.height = "14px";
        stage.style.transition = "height .6s ease"; stage.style.height = (142 + 14 + 36) + "px";
        holder.style.transition = "height .6s ease"; holder.style.height = (142 + 14 + 36) * sc + "px";
        canTear = false; setState("torn"); openViewer("torn");
      };
      raf = requestAnimationFrame(lift);
    };
    raf = requestAnimationFrame(sweep);
  }


  /* ---------- download the slip as a PNG picture ---------- */
  function downloadSlip(){
    const t = data.totals, X = 2, W = DESIGN_W * X, PAD = 20 * X, mono = `${11 * X}px ui-monospace,Menlo,Consolas,monospace`, LH = 17.5 * X;
    const date = new Date(data.placedAt).toLocaleString("en-GB", {day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"}).toUpperCase();
    const first = (data.name.trim().split(" ")[0] || "FRIEND").toUpperCase(), cod = data.paymentType === "cod";
    const ops = [];                                   /* each op: [type, a, b, extra] */
    const L = (k, v) => ops.push(["row", k, String(v)]), C = (x, o) => ops.push(["c", x, o || {}]), HR = () => ops.push(["hr"]), G = n => ops.push(["gap", n]);
    C("ALBERTO", {font: `700 ${20 * X}px Fraunces,Georgia,serif`, h: 30 * X, dim: 0}); C("WATCH COMPANY // KARACHI", {dim: 1}); HR();
    C("ORDER CONFIRMED", {dim: 1}); C("THANK YOU, " + first, {font: `700 ${15 * X}px Fraunces,Georgia,serif`, h: 24 * X}); HR();
    L("REF", data.ref); L("DATE", date); HR();
    C("CUSTOMER", {b: 1, left: 1}); L("NAME", data.name); L("EMAIL", data.email); if(data.phone) L("PHONE", data.phone);
    C("DELIVERY", {b: 1, left: 1}); ops.push(["wrap", data.destination]); L("METHOD", data.delivery); if(data.note) ops.push(["wrap", "NOTE: " + data.note, 1]); HR();
    C("ITEMS", {b: 1, left: 1});
    data.lines.forEach(l => { ops.push(["wrapb", l.name.toUpperCase()]); C(l.collection + (l.preorder ? " · PRE-ORDER" : ""), {dim: 1, left: 1}); L(l.qty + " × " + fm(l.unit), fm(l.total)); G(6 * X); });
    HR(); L("SUBTOTAL", fm(t.subtotal)); L("DELIVERY", t.delivery ? fm(t.delivery) : "FREE"); ops.push(["row", "TOTAL", fm(t.total), 1]); HR();
    L("PAYMENT", data.payment.toUpperCase()); if(cod) L("DUE ON DELIVERY", fm(t.total)); else L("STATUS", "PAID"); G(8 * X);
    C("DEMONSTRATION ORDER. RECORDED ON THIS DEVICE ONLY.", {dim: 1, small: 1}); C("NOTHING WAS CHARGED, SENT OR DELIVERED.", {dim: 1, small: 1}); ops.push(["bars"]); C(data.ref, {dim: 1});
    const cv = document.createElement("canvas"), g = cv.getContext("2d"); cv.width = W;
    const wrap = (txt, width) => { const words = txt.split(" "), lines = []; let cur = ""; words.forEach(w => { const tr = cur ? cur + " " + w : w; if(g.measureText(tr).width > width && cur){ lines.push(cur); cur = w; } else cur = tr; }); if(cur) lines.push(cur); return lines; };
    const run = draw => {
      let y = 30 * X; g.textBaseline = "top";
      ops.forEach(o => {
        const type = o[0];
        if(type === "hr"){ y += 6 * X; if(draw){ g.strokeStyle = "#8a8c93"; g.setLineDash([5 * X, 4 * X]); g.beginPath(); g.moveTo(PAD, y); g.lineTo(W - PAD, y); g.stroke(); } y += 10 * X; }
        else if(type === "gap") y += o[1];
        else if(type === "c"){
          const op = o[2]; g.font = op.font || (op.b ? `700 ${11 * X}px ui-monospace,Menlo,Consolas,monospace` : `${(op.small ? 9 : 11) * X}px ui-monospace,Menlo,Consolas,monospace`);
          if(draw){ g.fillStyle = op.dim ? "#8d8e92" : "#1b1c20"; g.textAlign = op.left ? "left" : "center"; g.fillText(o[1], op.left ? PAD : W / 2, y); }
          y += op.h || LH;
        }
        else if(type === "row"){
          g.font = o[3] ? `700 ${13 * X}px ui-monospace,Menlo,Consolas,monospace` : mono;
          if(draw){ g.fillStyle = o[3] ? "#1b1c20" : "#8d8e92"; g.textAlign = "left"; g.fillText(o[1], PAD, y); g.fillStyle = "#1b1c20"; g.textAlign = "right"; g.fillText(o[2], W - PAD, y); }
          y += o[3] ? LH * 1.2 : LH;
        }
        else if(type === "wrap" || type === "wrapb"){
          g.font = type === "wrapb" ? `700 ${11 * X}px ui-monospace,Menlo,Consolas,monospace` : mono;
          wrap(o[1], W - PAD * 2).forEach(line => { if(draw){ g.fillStyle = o[2] ? "#8d8e92" : "#1b1c20"; g.textAlign = "left"; g.fillText(line, PAD, y); } y += LH; });
        }
        else if(type === "bars"){
          y += 12 * X;
          if(draw){
            const bars = data.ref.split("").flatMap(ch => { const c = ch.charCodeAt(0); return [1 + (c % 3), 1 + ((c >> 2) % 2), 2 + ((c >> 1) % 2)]; });
            const total = bars.reduce((a, w) => a + w * 1.6 * X, 0); let x = (W - total) / 2;
            bars.forEach((w, i) => { const bw = w * 1.6 * X; if(i % 2 === 0){ g.fillStyle = "#16171b"; g.fillRect(x, y, bw, 38 * X); } x += bw; });
          }
          y += 42 * X;
        }
      });
      return y + 24 * X;
    };
    cv.height = 10; const H = run(false); cv.width = W; cv.height = H;
    g.fillStyle = "#fbfaf6"; g.fillRect(0, 0, W, H); g.setLineDash([]); run(true);
    /* zig-zag bottom edge like torn thermal paper */
    g.globalCompositeOperation = "destination-out"; g.beginPath();
    for(let x = 0; x <= W; x += 10 * X){ g.moveTo(x, H); g.lineTo(x + 5 * X, H - 8 * X); g.lineTo(x + 10 * X, H); }
    g.fill(); g.globalCompositeOperation = "source-over";
    const a = document.createElement("a"); a.download = "Alberto-receipt-" + data.ref + ".png"; a.href = cv.toDataURL("image/png");
    document.body.appendChild(a); a.click(); a.remove();
    if(snd()) AlbSound.tick();
  }

  /* ---------- 3D viewer: drag to rotate in any direction, flip to see the back ---------- */
  const ICON = {
    flip: '<svg viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3M12 20v2M12 14v2M12 8v2M12 2v2"/></svg>',
    reset: '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
    dl: '<svg viewBox="0 0 24 24"><path d="M12 3v12M7 11l5 5 5-5M4 21h16"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>'
  };
  let viewerOpen = null;
  function openViewer(mode){
    if(viewerOpen) return;
    if(!mode) mode = state === "torn" && torn ? "torn" : "view";
    if(mode === "torn" && !torn) mode = "view";
    const w = mode === "torn" ? torn.w : DESIGN_W, h = mode === "torn" ? torn.h : (paper.offsetHeight || 700), jag = mode === "torn" ? torn.jag : null;
    const poly = mirror => {
      if(!jag) return "";
      const pts = jag.map((y, i) => { const x = Math.min(w, i * 8); return `${mirror ? w - x : x}px ${y}px`; });
      return `clip-path:polygon(${pts.join(",")},${mirror ? `0px ${h}px,${w}px ${h}px` : `${w}px ${h}px,0px ${h}px`})`;
    };
    const lastFocus = document.activeElement;
    const el = document.createElement("div");
    el.className = "rp-viewer"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Receipt, 3D view. Drag to rotate.");
    el.innerHTML = `<div class="rp-vscene"><div class="rp-obj" style="width:${w}px;height:${h}px;margin-left:${-w / 2}px;margin-top:${-h / 2}px">
<div class="rp-face" style="${poly(false)}">${sheetHTML()}<div class="rp-sheen"></div></div>
<div class="rp-face rp-faceback" style="${poly(true)}"><div class="rp-sheet rp-back" style="height:${h}px"><span class="rp-backlogo">ALBERTO</span><span class="rp-dim">THERMAL PAPER // TP-58</span></div></div></div></div>
<button type="button" class="rp-vclose" aria-label="Close 3D receipt">${ICON.x}</button>
<div class="rp-vbar"><p>DRAG TO ROTATE // ANY DIRECTION</p><div class="vrow"><button type="button" class="rp-btn primary" data-a="flip">${ICON.flip} Flip</button><button type="button" class="rp-btn" data-a="reset">${ICON.reset} Reset view</button><button type="button" class="rp-btn" data-a="dl">${ICON.dl} Download</button><button type="button" class="rp-btn" data-a="close">${ICON.x} Close</button></div></div>`;
    document.body.appendChild(el); viewerOpen = el;
    const obj = el.querySelector(".rp-obj"), sheen = el.querySelector(".rp-sheen"), closeBtn = el.querySelector(".rp-vclose");
    const reduce = reduceMotion();
    const fit = () => Math.max(.3, Math.min((window.innerHeight - 150) / h, (window.innerWidth - 32) / w, 1.3));
    const c = {x: 10, y: -32, vx: 0, vy: 0, drag: false, touched: false, lx: 0, ly: 0, sway0: performance.now(), s: fit(), tw: null};
    c.tw = {fx: c.x, fy: c.y, tx: 0, ty: 0, t0: performance.now(), dur: reduce ? 1 : 1000, resume: true};
    const apply = () => {
      obj.style.transform = `scale(${c.s}) rotateX(${c.x}deg) rotateY(${c.y}deg)`;
      sheen.style.backgroundPosition = `${50 - Math.sin(c.y * Math.PI / 180) * 70}% ${50 + Math.sin(c.x * Math.PI / 180) * 40}%`;
    };
    const tweenTo = (tx, ty, resume) => { c.touched = true; c.vx = 0; c.vy = 0; c.tw = {fx: c.x, fy: c.y, tx, ty, t0: performance.now(), dur: reduce ? 1 : 750, resume}; };
    const flip = () => tweenTo(Math.round(c.x / 360) * 360, (Math.floor(c.y / 180) + 1) * 180, false);
    const reset = () => tweenTo(Math.round(c.x / 360) * 360, Math.round(c.y / 360) * 360, true);
    let vraf = 0;
    const close = () => {
      cancelAnimationFrame(vraf); window.removeEventListener("resize", onResize); window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow; el.remove(); viewerOpen = null; if(lastFocus && lastFocus.focus) lastFocus.focus(); ui();
    };
    const onResize = () => { c.s = fit(); apply(); };
    const onKey = e => {
      if(e.key === "Escape") close();
      else if(e.key === "ArrowLeft"){ c.touched = true; c.tw = null; c.vy -= 7; }
      else if(e.key === "ArrowRight"){ c.touched = true; c.tw = null; c.vy += 7; }
      else if(e.key === "ArrowUp"){ c.touched = true; c.tw = null; c.vx += 7; }
      else if(e.key === "ArrowDown"){ c.touched = true; c.tw = null; c.vx -= 7; }
    };
    window.addEventListener("resize", onResize); window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow; document.body.style.overflow = "hidden";
    closeBtn.focus();
    const loop = now => {
      if(c.tw){
        const p = Math.min(1, (now - c.tw.t0) / c.tw.dur), e = 1 - Math.pow(1 - p, 3);
        c.x = c.tw.fx + (c.tw.tx - c.tw.fx) * e; c.y = c.tw.fy + (c.tw.ty - c.tw.fy) * e;
        if(p >= 1){ if(c.tw.resume){ c.touched = false; c.sway0 = now; c.x = c.tw.tx; c.y = c.tw.ty; } c.tw = null; }
      }else if(c.drag){ /* following the pointer */ }
      else if(c.touched){ c.x += c.vx; c.y += c.vy; c.vx *= .94; c.vy *= .94; if(Math.abs(c.vx) < .02) c.vx = 0; if(Math.abs(c.vy) < .02) c.vy = 0; }
      else if(!reduce){ const t = now - c.sway0; c.x = Math.sin(t / 1300) * 3; c.y = Math.sin(t / 1900) * 7; }
      apply(); vraf = requestAnimationFrame(loop);
    };
    vraf = requestAnimationFrame(loop);
    el.addEventListener("pointerdown", e => { if(e.target.closest(".rp-vbar,.rp-vclose")) return; c.drag = true; c.touched = true; c.tw = null; c.vx = 0; c.vy = 0; c.lx = e.clientX; c.ly = e.clientY; el.setPointerCapture(e.pointerId); });
    el.addEventListener("pointermove", e => { if(!c.drag) return; const dx = e.clientX - c.lx, dy = e.clientY - c.ly; c.lx = e.clientX; c.ly = e.clientY; c.vy = dx * .45; c.vx = -dy * .45; c.y += c.vy; c.x += c.vx; apply(); });
    const up = () => { c.drag = false; }; el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
    closeBtn.addEventListener("click", close);
    el.querySelector(".rp-vbar").addEventListener("click", e => { const b = e.target.closest("[data-a]"); if(!b) return; ({flip, reset, close, dl: downloadSlip})[b.dataset.a](); });
    apply();
  }

  /* ---------- wiring ---------- */
  $c("#rpTear").addEventListener("click", tear);
  $c("#rpView").addEventListener("click", () => openViewer());
  $c("#rpAgain").addEventListener("click", start);
  $c("#rpDl").addEventListener("click", downloadSlip);
  $c("#rpSound").addEventListener("click", () => { if(snd()){ AlbSound.toggle(); ui(); } });
  box.addEventListener("click", () => { if(state === "printing" || state === "ready") openViewer("view"); });
  box.addEventListener("keydown", e => { if((e.key === "Enter" || e.key === " ") && (state === "printing" || state === "ready")){ e.preventDefault(); openViewer("view"); } });

  const timer = setTimeout(start, 700);
  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => {
    if(state !== "printing" && state !== "ready") return;
    H = measureH(); if(state === "ready") fed = H; applyScale();
  }) : null;
  if(ro) ro.observe(paper);
  applyScale(); ui();
  window.addEventListener("resize", applyScale);
  window.addEventListener("beforeunload", () => { clearTimeout(timer); stopAll(); });
})();
