/* ===== app.js ===== */
/* ---------- Page context + shared page shell ----------
   Every page is its own HTML file. <html data-root=""> (index.html) or data-root="../" (pages/*.html)
   tells this file how to reach css, images, data and the other pages. <body data-page="..."> names the page.
   The header, footer, cart, wishlist, product popup, toasts and ticker are written here once and added to every page. */
const ROOT = document.documentElement.getAttribute("data-root") || "";
const PAGE = document.body.getAttribute("data-page") || "home";
const U = (p, query) => (p === "home" ? ROOT + "index.html" : ROOT + "pages/" + p + ".html") + (query || "");
const qs = new URLSearchParams(location.search);
const SHELL_HEADER = `<header>
 <a class="logo" href="${U("home")}" data-p="home" aria-label="Alberto home">
  <img src="${ROOT}images/logo.png" alt="" height="46">
  <span><b>ALBERTO</b><small>WATCH COMPANY</small></span>
 </a>
 <nav id="nav" class="collapse d-xl-flex" aria-label="Main menu">
  <a href="${U("home")}" data-p="home">Home</a>
  <div class="dd"><a href="${U("products")}" data-p="products" data-line="All">Products</a><button type="button" class="dd-caret" id="ddProducts" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false" aria-label="Products submenu"></button>
   <ul class="dropdown-menu dd-menu" aria-labelledby="ddProducts">
    <li><a class="dropdown-item" href="${U("products")}" data-p="products" data-line="All">All products</a></li>
    <li><a class="dropdown-item" href="${U("products", "?line=Clocks")}" data-p="products" data-line="Clocks">Clocks</a></li>
    <li><a class="dropdown-item" href="${U("limited")}" data-p="limited">Limited Edition</a></li>
   </ul></div>
  <a href="${U("technology")}" data-p="technology">Technology</a>
  <a href="${U("stores")}" data-p="stores">Store Locator</a>
  <div class="dd"><a href="${U("support")}" data-p="support">Support</a><button type="button" class="dd-caret" id="ddSupport" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false" aria-label="Support submenu"></button>
   <ul class="dropdown-menu dd-menu" aria-labelledby="ddSupport">
    <li><a class="dropdown-item" href="${U("support")}" data-p="support">Support &amp; FAQ</a></li>
    <li><a class="dropdown-item" href="${U("booking")}" data-p="booking">Book a Repair</a></li>
   </ul></div>
  <a href="${U("gallery")}" data-p="gallery">Gallery</a>
  <a href="${U("about")}" data-p="about">About Us</a>
  <a href="${U("contact")}" data-p="contact">Contact Us</a>
 </nav>
 <div class="htools">
  <div class="visits" title="Demo counter: it counts visits made from this browser only, not all visitors worldwide."><img src="${ROOT}images/logo.png" alt="" height="22"><span>Visitors: <b id="vc">0000</b></span></div>
  <a id="loginLink" class="lg-pill" href="${U("login")}" data-p="login"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c1-4 4-6 8-6s7 2 8 6"/></svg><span class="lg-label">Login</span></a>
  <button id="hSearch" class="tg" type="button" aria-label="Search watches">&#128269;</button><button id="wishBtn" class="tg" type="button" aria-label="Open wishlist" data-bs-toggle="offcanvas" data-bs-target="#wish"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg><b id="wc">0</b></button><button id="cartBtn" class="tg" type="button" aria-label="Open cart" data-bs-toggle="offcanvas" data-bs-target="#cart">&#128722;<b id="cc">0</b></button>
  <button id="theme" class="tg" type="button" aria-label="Toggle dark mode">&#9790;</button>
 </div>
 <button id="burger" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Menu">&#9776;</button>
</header>`;
const SHELL_FOOTER = `<footer class="ft">
 <div class="ft-in">
  <div class="ft-brand">
   <img src="${ROOT}images/logo-full.png" alt="Alberto Watch Company" height="88">
   <p class="ft-tag">Fine timepieces, repaired and retailed with care.</p>
   <span class="ft-demo">Demo website</span>
  </div>
  <div class="ft-col" role="navigation" aria-label="Footer: collection"><h4>Collection</h4><ul>
   <li><a href="${U("products")}" data-p="products">Products</a></li>
   <li><a href="${U("limited")}" data-p="limited">Limited Edition</a></li>
   <li><a href="${U("gallery")}" data-p="gallery">Gallery</a></li>
  </ul></div>
  <div class="ft-col" role="navigation" aria-label="Footer: service"><h4>Service</h4><ul>
   <li><a href="${U("booking")}" data-p="booking">Book a Repair</a></li>
   <li><a href="${U("support")}" data-p="support">Support &amp; FAQ</a></li>
   <li><a href="${U("stores")}" data-p="stores">Store Locator</a></li>
  </ul></div>
  <div class="ft-col" role="navigation" aria-label="Footer: company"><h4>Company</h4><ul>
   <li><a href="${U("about")}" data-p="about">About Us</a></li>
   <li><a href="${U("technology")}" data-p="technology">Technology</a></li>
   <li><a href="${U("contact")}" data-p="contact">Contact Us</a></li>
   <li><a href="${U("sitemap")}" data-p="sitemap">Site Map</a></li>
  </ul></div>
  <div class="ft-visit"><h4>Visit us</h4><ul class="ft-contact">
   <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg><span>21 Clock Tower Road, Karachi</span></li>
   <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/></svg><span>+92 316 6295873</span></li>
   <li><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg><span><a href="mailto:Hassan836usis@gmail.com">Hassan836usis@gmail.com</a></span></li>
   <li><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg><span>Mon to Sat, 10:00 to 20:00</span></li>
  </ul></div>
 </div>
 <div class="ft-bot">
  <span>&copy; 2026 Alberto Watch Company. All rights reserved.</span>
  <span class="ft-soc"><a href="https://instagram.com/" target="_blank" rel="noopener">Instagram</a><a href="https://facebook.com/" target="_blank" rel="noopener">Facebook</a><a href="https://wa.me/923166295873" target="_blank" rel="noopener">WhatsApp</a></span>
  <span class="ft-note">Demo website: sample products and details only. No real payments or accounts.</span>
 </div>
</footer>`;
const SHELL_OVERLAYS = `<button id="totop" aria-label="Back to top">&#8593;</button>

<div class="offcanvas offcanvas-end" tabindex="-1" id="cart" aria-label="Your cart"><div class="offcanvas-header"><h3 class="m-0">Your cart<span class="wish-count" id="cartCount"></span></h3><button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button></div><div class="offcanvas-body d-flex flex-column"><div id="cartList" class="flex-grow-1"></div><div class="cart-foot wish-foot" id="cartFoot"><div class="ship" id="cartShip"><p id="shipTxt"></p><div class="ship-bar"><i id="shipBar"></i></div></div><div class="wish-total"><span>Total</span><b id="cartTotal">$0</b></div><a id="cartGo" class="abtn buy" href="${U("checkout")}">Checkout &rarr;</a></div></div></div>
<div class="offcanvas offcanvas-end" tabindex="-1" id="wish" aria-label="Your wishlist"><div class="offcanvas-header"><h3 class="m-0">Your wishlist<span class="wish-count" id="wishCount"></span></h3><button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button></div><div class="offcanvas-body d-flex flex-column"><div id="wishList" class="flex-grow-1"></div><div class="cart-foot wish-foot" id="wishFoot"><div class="wish-total"><span>Saved total</span><b id="wishTotal">$0</b></div><button type="button" class="abtn" id="wishAll">Add all to cart</button><button type="button" class="wish-clear" id="wishClear">Clear wishlist</button></div></div></div>
<div class="toast-container position-fixed bottom-0 start-0 p-3"><div id="toastMsg" class="toast align-items-center" role="status" aria-live="polite" data-bs-delay="2200"><div class="toast-body"></div></div></div>
<div id="ticker"><button id="locBtn" type="button" aria-label="Show my location in the ticker (asks your browser for permission)">My location</button><span id="tick">Loading date, time and location...</span></div>

<div class="modal fade" id="pm" tabindex="-1" aria-label="Watch details" aria-hidden="true"><div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"><div class="modal-content"><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button><div class="modal-body p-4" id="pmb"></div></div></div></div>
<div class="toast-container position-fixed bottom-0 end-0 p-3"><div id="toastOk" class="toast align-items-center" role="status" aria-live="polite" data-bs-delay="4500"><div class="d-flex"><div class="toast-body">Message sent. We will reply within one working day.</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div></div></div>`;
document.body.insertAdjacentHTML("afterbegin", SHELL_HEADER);
document.querySelector("main").insertAdjacentHTML("afterend", SHELL_FOOTER);
document.body.insertAdjacentHTML("beforeend", SHELL_OVERLAYS);
document.body.insertAdjacentHTML("afterbegin", '<a class="skip-link" href="#main">Skip to content</a>');
document.body.classList.add("shell-ready");      /* content is shown once the header and footer are in place */
/* Alberto Watch Company - main app: products, pages, hero, gallery, navigation */
let D = [];
const LINES = {Vintage:"Vintage", Luxury:"Luxury", Smart:"Smart Watches", Sports:"Sports", Diver:"Diver", Ladies:"Ladies", "Pre-owned":"Pre-owned", "Limited Edition":"Limited Edition", Clocks:"Clocks"};
const TINT={"e1": [350, 26], "d1": [25, 34], "d2": [355, 34], "d3": [45, 34], "d4": [35, 34], "d5": [15, 34], "d6": [350, 26], "l1": [30, 34], "l2": [35, 34], "l3": [350, 26], "l4": [35, 34], "l5": [30, 34], "l6": [350, 26], "s1": [30, 34], "s2": [25, 34], "s3": [350, 34], "s4": [45, 34], "s5": [15, 34], "sp1": [355, 34], "sp2": [38, 34], "sp4": [355, 34], "sp6": [55, 34], "v1": [15, 34], "v2": [15, 34], "v3": [25, 34], "v4": [25, 34], "v5": [350, 26], "v6": [350, 26], "w1": [5, 34], "w2": [350, 34], "w3": [350, 26], "w4": [355, 34], "w5": [38, 34], "w6": [35, 34]};
function tint(w){const t=TINT[w.id]||[35,34];   /* warm default for products not listed above */return `--h:${t[0]};--s:${t[1]}%`;}

/* ---------- Product photos ----------
   A product's photo is the "image" field in data/products.json (and the same record in data/products.js). */
function svg(w){
  const tag = w.soldOut ? "Sold Out" : w.badge, b = tag ? `<span class="bdg">${tag}</span>` : "";
  return `${b}<img src="${w.image}" alt="${w.name}" loading="lazy"><span class="qv" aria-hidden="true">Quick view</span>`;
}
const money = n => "$" + n.toLocaleString("en-US");
const GALLERY = [
  {src:"images/g1.jpg", t:"The art of watchmaking", c:"Every movement is serviced by hand."},
  {src:"images/g2.jpg", t:"On the wrist", c:"Our blue sunburst dress watch."},
  {src:"images/g3.jpg", t:"Up close", c:"A hand-finished dial with the Alberto name."},
  {src:"images/g4.jpg", t:"The showroom", c:"Browse the full collection in person."},
  {src:"images/g5.jpg", t:"Gift ready", c:"Every watch arrives in its own gift box."},
  {src:"images/g6.jpg", t:"The appraisal", c:"A careful, honest valuation of your watch."}
];
GALLERY.forEach(g => { g.src = ROOT + g.src; });   /* image paths are written from the site root; add the prefix on pages/ */

const FREE_DELIVERY_OVER = 1000;   /* free home delivery above this cart total (also used by checkout.js) */
const CART_ICON = '<svg class="ci-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 8H6"/><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/></svg>';
/* ---------- Cards (jQuery renders them into Bootstrap columns) ---------- */
function card(w, btn=true){
  return `<div class="acard watch h-100" tabindex="0" data-id="${w.id}"><div class="ph" style="${tint(w)}">${svg(w)}${window.wishBtn?wishBtn(w.id):''}</div><span class="br">${LINES[w.line]||w.line}</span><h3>${w.name}</h3><p class="pr">${money(w.price)}</p>${btn?(w.soldOut?`<button type="button" class="abtn add" disabled>Sold Out</button>`:`<button type="button" class="abtn add" data-add="${w.id}">${CART_ICON}Add to Cart</button>`):''}</div>`;
}
const col = (w, cls) => `<div class="${cls}">${card(w)}</div>`;

/* Featured order: limited editions first, then the best pieces mixed so no row repeats a collection */
function featuredOrder(list){
  const isLtd = w => w.line==="Limited Edition" || w.badge==="Limited" || w.badge==="Pre-order";
  const ltd = list.filter(isLtd).sort((a,b) => (b.line==="Limited Edition")-(a.line==="Limited Edition") || b.price-a.price);
  const rest = list.filter(w => !isLtd(w));
  const off = {"Clocks":1.6,"Pre-owned":2.2}, pri = ["Luxury","Vintage","Smart","Sports","Diver","Ladies","Pre-owned","Clocks"];
  const g = {}; rest.forEach(w => (g[w.line] = g[w.line] || []).push(w));
  const keyed = [];
  Object.keys(g).forEach(l => { g[l].sort((a,b) => b.price-a.price); g[l].forEach((w,i) => keyed.push({w, k:(i+(off[l]||.5))/g[l].length + pri.indexOf(l)*1e-4})); });
  keyed.sort((a,b) => a.k-b.k);
  const out = [...ltd];
  while(keyed.length){
    const rowStart = out.length - (out.length % 3), row = out.slice(rowStart).map(w => w.line);
    let j = keyed.findIndex(x => !row.includes(x.w.line) && x.w.line !== (out[out.length-1]||{}).line);
    if(j < 0) j = keyed.findIndex(x => !row.includes(x.w.line));
    if(j < 0) j = 0;
    out.push(keyed.splice(j,1)[0].w);
  }
  return out;
}
let curLine = (PAGE === "products" && Object.prototype.hasOwnProperty.call(LINES, qs.get("line") || "")) ? qs.get("line") : "All";
function showLine(l){
  if(l) curLine = l;
  if(!$("#plist").length) return;          /* only the products page has the list */
  const q = $("#q").val().trim().toLowerCase(), so = $("#sort").val()||"a";
  const lo = parseFloat($("#pmin").val())||0, hi = parseFloat($("#pmax").val())||Infinity;
  let list = D.filter(w => (curLine==="All"||w.line===curLine) && (!q || (w.name+" "+w.desc+" "+w.brand+" "+LINES[w.line]).toLowerCase().includes(q)) && w.price>=lo && w.price<=hi);
  list = so==="f" ? featuredOrder(list) : [...list].sort((a,b) => so==="a" ? a.price-b.price : b.price-a.price);
  $("#plist").html(list.length ? list.map(w => col(w,"col-12 col-sm-6 col-lg-4")).join("") : '<div class="col-12"><p>Nothing matches. Try a different word, collection or price.</p></div>');
  $("#pcount").text(list.length+(list.length===1?" product":" products"));
  $("#tabs button").each(function(){ $(this).toggleClass("on", $(this).data("l")===curLine); });
}
function buildGallery(){
  $("#gal").html(GALLERY.map((g,i) => `<div class="col-12 col-md-6 col-lg-4"><figure class="gtile" data-i="${i}"><img src="${g.src}" alt="${g.t}" loading="lazy"><figcaption><b>${g.t}</b><span>${g.c}</span></figcaption></figure></div>`).join(""));
}
function init(){
  buildHero();
  $("#tabs").html('<button data-l="All">All products</button>'+Object.keys(LINES).filter(k => D.some(w => w.line===k)).map(k => `<button data-l="${k}">${LINES[k]}</button>`).join(""));
  showLine(curLine);
  if(PAGE === "products" && qs.get("q")){ $("#q").val(qs.get("q")); showLine(); }
  if(PAGE === "products" && qs.get("focus")) setTimeout(() => $("#q").trigger("focus"), 300);
  $("#featured").html(["v6","l2","s2","c1"].map(id => D.find(w => w.id===id)).filter(Boolean).map(w => col(w,"col-12 col-sm-6 col-lg-3")).join(""));
  if(PAGE === "product") renderProduct();
  if(window.buildLimited) buildLimited(); if(window.renderWish) renderWish();
  $("#ptable").html(D.map(w => `<tr><td>${w.name}</td><td>${LINES[w.line]}</td><td>${money(w.price)}</td></tr>`).join(""));
}
$("#tabs").on("click","button", function(){ showLine($(this).data("l")); });
$("#q").on("input", () => showLine());
$("#sort,#pmin,#pmax").on("input change", () => showLine());

/* ---------- Data store: products.json (read with jQuery AJAX) ---------- */
/* product records store image paths from the site root ("images/p1.webp"); add the prefix when the page is inside pages/ */
const withRoot = list => list.map(w => w.image ? {...w, image: ROOT + w.image} : w);
function loadData(){
  /* Served over http (Live Server or a web host): read data/products.json.
     Opened by double-click (file://) browsers block that, so data/products.js (same records) is used instead.
     If you edit products.json, make the same change in products.js. */
  $.getJSON(ROOT + "data/products.json")
    .done(list => { D = withRoot(list); init(); })
    .fail(() => {
      if(window.PRODUCTS){ D = withRoot(window.PRODUCTS); init(); }
      else $("#plist").html('<div class="col-12"><p>Could not load product data.</p></div>');
    });
}

/* ---------- Product popup (the one Bootstrap modal, #pm) ---------- */
let pmOpener = null;
function openW(id){
  const w = D.find(x => x.id===String(id)); if(!w) return;
  pmOpener = document.activeElement;
  const avail = w.soldOut ? "Sold out" : (w.preorder ? "Pre-order" : "");
  const specs = [["Collection", LINES[w.line]||w.line], ["Brand", w.brand||"Alberto"], ["Movement", w.movement], ["Case", w.case], ["Water resistance", w.water],
                 ["Edition", w.pieces ? `Limited to ${w.pieces} pieces` : ""], ["Delivery", w.delivery], ["Availability", avail]].filter(r => r[1]);
  const buy = w.soldOut
    ? `<button class="abtn" type="button" disabled>Sold Out</button>`
    : `<button class="abtn" type="button" data-add="${w.id}">${CART_ICON}${w.preorder?"Pre-order":"Add to Cart"}</button><a class="abtn buy" href="${U("checkout","?buy="+w.id)}">${w.preorder?"Pre-order now":"Order now"}</a>`;
  $("#pmb").html(`<div class="row g-4 align-items-start"><div class="col-md-5"><div class="ph mph" style="${tint(w)}">${svg(w)}</div></div><div class="col-md-7"><span class="br">${LINES[w.line]||w.line}</span><h2 id="pmTitle">${w.name}</h2><p class="pr" style="font-size:1.5rem">${money(w.price)}</p><p>${w.desc}</p><dl class="pdl">${specs.map(r => `<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join("")}</dl><div class="d-flex gap-2 flex-wrap">${buy}${window.wishLBtn?wishLBtn(w.id):""}</div><p class="mt-3 mb-0"><button type="button" class="pm-full" data-full="${w.id}">View full details page</button></p></div></div>`);
  $("#pm").attr("aria-labelledby","pmTitle").removeAttr("aria-label");
  bootstrap.Modal.getOrCreateInstance("#pm").show();
}
$("#pm").on("hidden.bs.modal", () => { if(pmOpener && document.contains(pmOpener) && pmOpener.focus) pmOpener.focus(); pmOpener = null; });
/* the full product page is pages/product.html?id=... (rendered by renderProduct in shop.js) */
$(document).on("click", "[data-full]", function(){
  pmOpener = null;
  location.href = U("product", "?id=" + encodeURIComponent(String($(this).data("full"))));
});
$(document).on("click", ".watch", function(e){ if($(e.target).closest("[data-add],[data-wish]").length) return; openW(String($(this).data("id"))); })
           .on("keydown", ".watch", function(e){ if(e.target!==this) return; if(e.key==="Enter" || e.key===" "){ e.preventDefault(); openW(String($(this).data("id"))); } });

/* ---------- Gallery lightbox (Bootstrap modal + carousel) ---------- */
$("#gal").on("click", ".gtile", function(){
  const real = GALLERY.map((g,i) => ({g,i})).filter(o => $("#gal .gtile[data-i='"+o.i+"'] img").length);
  const start = real.findIndex(o => o.i === $(this).data("i"));
  if(start < 0) return;
  $("#lbc .carousel-inner").html(real.map((o,k) => `<div class="carousel-item${k===start?" active":""}"><img class="d-block w-100" src="${o.g.src}" alt="${o.g.t}"><div class="carousel-caption"><b>${o.g.t}</b><br>${o.g.c}</div></div>`).join(""));
  $("#lbc .carousel-control-prev, #lbc .carousel-control-next").toggle(real.length > 1);
  bootstrap.Carousel.getOrCreateInstance("#lbc", {interval:false, ride:false});
  bootstrap.Modal.getOrCreateInstance("#lb").show();
});

/* ---------- Navigation: every page is a real HTML file ----------
   Links are normal <a href>. markNav only lights up the menu item for the page you are on. */
function markNav(){
  $("#nav a").removeClass("on");
  $("#nav a[data-p='"+PAGE+"']").not(".dropdown-item").addClass("on");
  $("#nav .dd-menu a[data-p='"+PAGE+"']").each(function(){ if(!$(this).data("line") || $(this).data("line")===curLine || PAGE!=="products") $(this).addClass("on"); });
}
/* a few buttons (not links) carry data-p, for example "Meet the team" on the home page */
$(document).on("click", "[data-p]:not(a)", function(){ location.href = U(String($(this).data("p"))); });
function pageInit(){ markNav(); if(PAGE === "home") countUp(); }

/* ---------- Visitor counter (stored in this browser) ---------- */
try{
  let n = parseInt(localStorage.getItem("alberto_visits")||"1000",10);
  if(!sessionStorage.getItem("counted")){ n++; localStorage.setItem("alberto_visits", n); sessionStorage.setItem("counted","1"); }
  $("#vc").text(String(n).padStart(6,"0"));
}catch(e){ $("#vc").text("000001"); }

/* ---------- Ticker: date, time and (optional) location ----------
   Date and time come from the visitor's own clock. The place shown is the browser time zone (a zone name, not a city).
   Exact coordinates are shown only if the visitor presses "My location" and allows it in the browser (HTML5 Geolocation).
   No outside service is called. If permission is refused or unavailable the ticker keeps showing the time zone. */
const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "your device";
let place = `Time zone: ${zone}`;
function tick(){
  const d = new Date();
  const tz = new Intl.DateTimeFormat("en-GB",{timeZoneName:"short"}).formatToParts(d).find(p => p.type==="timeZoneName");
  $("#tick").text(`Welcome to Alberto Watch Company   |   ${d.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}   |   ${d.toLocaleTimeString()}${tz?" ("+tz.value+")":""}   |   ${place}`);
}
function setPlace(t){ place = t; tick(); }
if(navigator.geolocation){
  $("#locBtn").on("click", function(){
    const $b = $(this).prop("disabled", true).text("Locating...");
    navigator.geolocation.getCurrentPosition(p => {
      const la = p.coords.latitude, lo = p.coords.longitude;
      setPlace(`Your location: ${Math.abs(la).toFixed(2)}\u00B0${la>=0?"N":"S"}, ${Math.abs(lo).toFixed(2)}\u00B0${lo>=0?"E":"W"} (shared by your browser)   |   Time zone: ${zone}`);
      $b.hide();
    }, err => {
      setPlace(`Time zone: ${zone} (location ${err && err.code===1 ? "not shared" : "unavailable"})`);
      $b.prop("disabled", false).text("My location");
    }, {timeout:10000, maximumAge:600000});
  });
} else $("#locBtn").hide();
tick(); setInterval(tick, 1000);

/* ---------- Dark mode, counters, back to top ---------- */
function setTheme(d){ $("body").toggleClass("dark", d); try{localStorage.setItem("alb_dark",d?"1":"0");}catch(e){} }
try{ const st=localStorage.getItem("alb_dark"); setTheme(st===null ? false : st==="1"); }catch(e){ setTheme(false); }
$("#theme").on("click", () => setTheme(!$("body").hasClass("dark")));
function countUp(){
  $(".stats b").each(function(){
    const $b = $(this), t = +$b.data("n");
    $({n:0}).animate({n:t}, {duration:1400, step: v => $b.text(Math.round(v).toLocaleString("en-US")+"+")});
  });
}
$(window).on("scroll", () => $("#totop").toggleClass("show", $(window).scrollTop() > 500));
$("#totop").on("click", () => $("html, body").animate({scrollTop:0}, 500));

/* ---------- Contact form (Bootstrap validation + toast) ---------- */
/* Validation: name = letters only (no digits or symbols like @), email must be a real address, message required.
   Each error is shown under its own field. */
(function(){
  const NAME_OK = v => /^\p{L}[\p{L} '.\-]*$/u.test(v) && (v.match(/\p{L}/gu) || []).length >= 2;
  const MAIL_OK = v => /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(\.[A-Za-z0-9\-]+)*\.[A-Za-z]{2,}$/.test(v);
  const RULES = {
    cn: v => !v ? "Please enter your name." : NAME_OK(v) ? "" : "Name can contain letters only (no numbers or symbols like @).",
    ce: v => !v ? "Please enter your email address." : MAIL_OK(v) ? "" : "Enter a valid email address, for example name@example.com.",
    cm: v => v ? "" : "Please write your message."
  };
  let tried = false;
  function check(id){
    const el = document.getElementById(id), msg = RULES[id](el.value.trim());
    el.classList.toggle("is-invalid", !!msg);
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    document.getElementById(id + "Err").textContent = msg;
    return !msg;
  }
  $("#cf").on("submit", function(e){
    e.preventDefault(); tried = true;
    const results = Object.keys(RULES).map(check);
    if(results.includes(false)){ document.getElementById(Object.keys(RULES)[results.indexOf(false)]).focus(); return; }
    tried = false;
    this.reset();
    Object.keys(RULES).forEach(id => { document.getElementById(id).classList.remove("is-invalid"); document.getElementById(id + "Err").textContent = ""; });
    bootstrap.Toast.getOrCreateInstance("#toastOk").show();
  });
  Object.keys(RULES).forEach(id => { const el = document.getElementById(id); if(el) el.addEventListener("input", () => { if(tried || el.value.trim()) check(id); }); });
})();

/* ---------- Slider hero (jQuery) ---------- */
const heroSrc = id => `${ROOT}images/${id}.webp`;
/* t = [light word, bold word, bold word, light word]  ->  "Super Luxury / Super Watches" */
const HERO = [
  {id:"l2", t:["Made for","evenings","you will","love"], p:"A golden dress watch with a deep navy dial. Dress up, step out, enjoy the evening."},
  {id:"d4", t:["Bold","gold","after","dark"], p:"A black dial, a gold bezel and a two-tone bracelet. Built for the deep, dressed for the night."},
  {id:"l1", t:["Ready for","every","adventure","today"], p:"Our strongest diver. Tough, steady and happy to get wet."},
  {id:"w4", t:["A small","touch","of quiet","elegance"], p:"A soft burgundy dial with a moon window and a gentle leather strap."}
];
let hi = 0, ht = null, SL = [];
function setSlide(i, first){
  const s = SL[i]; if(!s) return; hi = i;
  $("#hxIdx button").removeClass("on").removeAttr("aria-current").eq(i).addClass("on").attr("aria-current","true");
  const apply = () => {
    $("#hxImg").attr({src: heroSrc(s.id), alt: s.w.name});
    $("#hxLabel").text(LINES[s.w.line] || s.w.line);
    $("#hxTitle").html(`<span class="l">${s.t[0]} <b>${s.t[1]}</b></span><span class="l">${s.t[2]} <b>${s.t[3]}</b></span>`);
    $("#hxText").text(s.p);
    $("#hxBtn").text(`${s.w.preorder?"Pre-order":"Add to Cart"} - $ ${s.w.price.toLocaleString("en-US")}`);
  };
  if(first){ apply(); return; }
  const $fade = $("#hxImg, #hxBody");
  $fade.stop(true).css("position","relative").animate({opacity:0, top:16}, 220).promise().done(function(){
    apply();
    $fade.css("top",-16).animate({opacity:1, top:0}, 460);
  });
}
function hxRestart(){ clearInterval(ht); ht = setInterval(() => setSlide((hi+1) % SL.length), 5800); }
function buildHero(){
  SL = HERO.map(s => ({...s, w: D.find(x => x.id===s.id)})).filter(s => s.w);
  if(!SL.length || !$("#hx").length) return;
  $("#hxIdx").html(SL.map((s,i) => `<li><button type="button" data-i="${i}" aria-label="Slide ${i+1}: ${s.w.name}">${String(i+1).padStart(2,"0")}</button></li>`).join(""));
  SL.forEach(s => { const im = new Image(); im.src = heroSrc(s.id); });
  setSlide(0, true);
  $("#hxIdx").on("click","button", function(){ setSlide(+$(this).data("i")); hxRestart(); });
  $("#hxBtn").on("click", () => addCart(SL[hi].w.id, true));
  $("#hxView").on("click", () => openW(SL[hi].w.id));
    if(!matchMedia("(prefers-reduced-motion: reduce)").matches){
    hxRestart();
    $("#hx").on("mouseenter focusin", () => clearInterval(ht)).on("mouseleave focusout", hxRestart);
  }
}

/* ---------- Start ---------- */
$(function(){ buildGallery(); pageInit(); loadData(); });

/* ===== reveal.js ===== */
/* scroll reveal animation + scroll progress bar */
document.documentElement.classList.add("rvjs");
(function(){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);if(e.target.matches(".stats b"))cnt(e.target)}})},{threshold:.12});
function cnt(el){var t=el.textContent,m=t.match(/[\d,]+/);if(!m)return;var n=+m[0].replace(/,/g,""),d=0,st=Date.now();(function f(){var k=Math.min(1,(Date.now()-st)/1400),v=Math.round(n*(1-Math.pow(1-k,3)));el.textContent=t.replace(m[0],v.toLocaleString("en-US"));if(k<1)requestAnimationFrame(f)})()}
function tag(){document.querySelectorAll(".page h2,.page .sub,.acard,.watch,.tcard,.svc,.gtile,.stp,.ctaband,.stats,.tabs,.accordion-item").forEach(function(el,i){if(el.dataset.rv)return;el.dataset.rv=1;el.classList.add("rv");el.style.setProperty("--d",(i%4)*90+"ms");io.observe(el)});document.querySelectorAll(".stats b").forEach(function(b){if(!b.dataset.rv){b.dataset.rv=1;io.observe(b)}})}
new MutationObserver(tag).observe(document.body,{childList:true,subtree:true});tag();
var bar=document.createElement("div");bar.id="sprog";document.body.appendChild(bar);addEventListener("scroll",function(){var h=document.documentElement;bar.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight||1)*100)+"%"},{passive:true});
})();

/* ===== lamp.js ===== */
/* =========================================================
   Lamp demo behaviour (plain JS, no libraries, no build step)

   - Light level (0..1) is tweened smoothly and mapped to CSS variables.
   - The pull cord is a small verlet rope: it stretches when pulled,
     springs back with a little overshoot and then swings.
   - Mouse / touch: click or drag the cord down. Keyboard: Tab to the cord,
     then Enter / Space / ArrowDown.

   Hooks for later integration:
     window.LampDemo.on() / off() / toggle() / setLevel(0..1)
     stage element gets data-lamp="on|off" and fires a "lamp:change" event
     (event.detail = { on: boolean, source: 'cord' | 'panel' | 'api' }).
   ========================================================= */
(() => {
  'use strict';

  const stage = document.getElementById('lampStage');
  const svg = document.getElementById('lampSvg');
  const cord = document.getElementById('cord');
  const cordHit = document.getElementById('cordHit');
  const cordDim = document.getElementById('cordDim');
  const cordLit = document.getElementById('cordLit');
  const bead = document.getElementById('bead');
  const status = document.getElementById('lampStatus');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!stage) return;   /* the lamp only exists on the login page */

  /* ---------------- settings you can tweak ---------------- */
  const CFG = {
    anchor: { x: 246, y: 222 },  // where the cord leaves the shade (SVG units)
    length: 176,                 // resting cord length
    segments: 14,
    gravity: 2400,
    damping: 0.992,              // per physics step (1/120 s)
    iterations: 24,
    pullMax: 78,                 // max extra length while dragging
    pullThreshold: 32,           // pull this far and the switch "clicks"
    autoPull: 52,                // how far a simple click / key press pulls
    springK: 430,                // spring-back stiffness
    springC: 15,                 // spring-back damping (lower = more bounce)
    onMs: 1100,                  // full OFF -> ON time
    offMs: 800,                  // full ON -> OFF time
    midLevel: 0.5                // level used by the "Mid (preview)" button
  };

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  /* ---------------- light state ---------------- */
  let level = 0;      // current brightness 0..1 (login page starts with the light off)
  let isOn = false;   // logical state (what the next pull will undo)
  let tween = null;

  function applyLevel(l) {
    const s = stage.style;
    s.setProperty('--lvl', l.toFixed(4));
    s.setProperty('--lit', Math.pow(l, 1.5).toFixed(4));   // shade, pole, ring, base
    s.setProperty('--rim', Math.pow(l, 0.7).toFixed(4));   // rim line lingers while dimming
    s.setProperty('--glow', Math.pow(l, 0.9).toFixed(4));  // bulb
    s.setProperty('--wall', Math.pow(l, 1.8).toFixed(4));  // ambient wall light
    s.setProperty('--cone', Math.pow(l, 2.0).toFixed(4));  // cones + floor pool
  }

  function goTo(to, ms) {
    const dist = Math.abs(to - level);
    const dur = reduceMotion.matches ? 180 : Math.max(160, ms * Math.max(dist, 0.2));
    tween = { from: level, to, t0: performance.now(), dur };
    wake();
  }

  function announce(on) {
    stage.dataset.lamp = on ? 'on' : 'off';
    cord.setAttribute('aria-checked', String(on));
    status.textContent = on ? 'Lamp on' : 'Lamp off';
  }

  function setOn(on, source) {
    isOn = on;
    announce(on);
    goTo(on ? 1 : 0, on ? CFG.onMs : CFG.offMs);
    stage.dispatchEvent(new CustomEvent('lamp:change', { bubbles: true, detail: { on, source: source || 'api' } }));
  }

  function setLevel(l, source) {
    l = clamp(l, 0, 1);
    isOn = l >= 0.5;
    announce(isOn);
    goTo(l, 800);
    stage.dispatchEvent(new CustomEvent('lamp:change', { bubbles: true, detail: { on: isOn, level: l, source: source || 'api' } }));
  }

  /* ---------------- cord physics ---------------- */
  const A = CFG.anchor;
  const N = CFG.segments;
  const DT = 1 / 120;
  const pts = [];
  for (let i = 0; i <= N; i++) {
    const y = A.y + (CFG.length / N) * i;
    pts.push({ x: A.x, y, px: A.x, py: y });
  }

  let ext = 0;            // how far the cord is pulled out of the lamp
  let extV = 0;
  let mode = 'idle';      // idle | drag | auto
  let drag = null;
  let autoToggled = false;
  let kickSign = 1;

  function release() {
    if (reduceMotion.matches) return;
    kickSign = -kickSign;
    for (let i = 1; i <= N; i++) {
      const v = 0.55 * Math.pow(i / N, 1.5);
      pts[i].px = pts[i].x - kickSign * v;
    }
  }

  function pullSwitch() { setOn(!isOn, 'cord'); }

  function step(dt) {
    if (mode === 'idle') {
      extV += (-CFG.springK * ext - CFG.springC * extV) * dt;
      ext += extV * dt;
    } else if (mode === 'auto') {
      ext += (CFG.autoPull - ext) * (1 - Math.exp(-dt * 30));
      if (!autoToggled && ext >= CFG.pullThreshold) { autoToggled = true; pullSwitch(); }
      if (ext >= CFG.autoPull - 1.5) { mode = 'idle'; extV = 0; release(); }
    }

    const seg = Math.max(2, (CFG.length + ext) / N);
    const g = CFG.gravity * dt * dt;
    const dragging = mode === 'drag';

    for (let i = 1; i <= N; i++) {
      if (dragging && i === N) continue;
      const p = pts[i];
      const vx = (p.x - p.px) * CFG.damping;
      const vy = (p.y - p.py) * CFG.damping;
      p.px = p.x; p.py = p.y;
      p.x += vx;
      p.y += vy + g;
    }

    pts[0].x = pts[0].px = A.x;
    pts[0].y = pts[0].py = A.y;
    if (dragging) {
      const e = pts[N];
      e.x = e.px = drag.endX;
      e.y = e.py = drag.endY;
    }

    for (let it = 0; it < CFG.iterations; it++) {
      for (let i = 0; i < N; i++) {
        const a = pts[i], b = pts[i + 1];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 1e-6;
        const diff = (d - seg) / d;
        const aFixed = i === 0;
        const bFixed = dragging && i + 1 === N;
        if (aFixed && bFixed) continue;
        if (aFixed) { b.x -= dx * diff; b.y -= dy * diff; }
        else if (bFixed) { a.x += dx * diff; a.y += dy * diff; }
        else {
          const h = 0.5 * diff;
          a.x += dx * h; a.y += dy * h;
          b.x -= dx * h; b.y -= dy * h;
        }
      }
    }
  }

  function render() {
    let d = 'M' + pts[0].x.toFixed(2) + ',' + pts[0].y.toFixed(2);
    for (let i = 0; i < N; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += 'C' +
        (p1.x + (p2.x - p0.x) / 6).toFixed(2) + ',' + (p1.y + (p2.y - p0.y) / 6).toFixed(2) + ' ' +
        (p2.x - (p3.x - p1.x) / 6).toFixed(2) + ',' + (p2.y - (p3.y - p1.y) / 6).toFixed(2) + ' ' +
        p2.x.toFixed(2) + ',' + p2.y.toFixed(2);
    }
    cordHit.setAttribute('d', d);
    cordDim.setAttribute('d', d);
    cordLit.setAttribute('d', d);

    const e = pts[N], q = pts[N - 1];
    const ang = Math.atan2(-(e.x - q.x), e.y - q.y) * 180 / Math.PI;
    bead.setAttribute('transform', 'translate(' + e.x.toFixed(2) + ' ' + e.y.toFixed(2) + ') rotate(' + ang.toFixed(2) + ')');
  }

  /* ---------------- frame loop (sleeps when everything is still) ---------------- */
  let running = false, last = 0, acc = 0, calm = 0;

  function frame(now) {
    if (!last) last = now;
    acc += Math.min(0.05, (now - last) / 1000);
    last = now;
    while (acc >= DT) { step(DT); acc -= DT; }

    if (tween) {
      const k = clamp((now - tween.t0) / tween.dur, 0, 1);
      level = tween.from + (tween.to - tween.from) * easeInOut(k);
      if (k >= 1) { level = tween.to; tween = null; }
    }

    render();
    applyLevel(level);

    let motion = 0;
    for (let i = 1; i <= N; i++) motion += Math.abs(pts[i].x - pts[i].px) + Math.abs(pts[i].y - pts[i].py);
    const settled = mode === 'idle' && !tween && motion < 0.02 && Math.abs(ext) < 0.05 && Math.abs(extV) < 0.5;
    calm = settled ? calm + 1 : 0;
    if (calm > 30) { running = false; last = 0; return; }
    requestAnimationFrame(frame);
  }

  function wake() {
    calm = 0;
    if (running) return;
    running = true;
    last = 0;
    requestAnimationFrame(frame);
  }

  /* ---------------- pointer interaction ---------------- */
  function toSvg(e) {
    const m = svg.getScreenCTM();
    if (!m) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(m.inverse());
  }

  function markTouched() { stage.classList.add('touched'); }

  function startAuto() {
    mode = 'auto';
    autoToggled = false;
    extV = 0;
    wake();
  }

  cord.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    const p = toSvg(e);
    if (!p) return;
    e.preventDefault();
    if (cord.setPointerCapture) { try { cord.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ } }
    cord.focus({ preventScroll: true });
    markTouched();
    drag = {
      id: e.pointerId,
      startDist: Math.hypot(p.x - A.x, p.y - A.y),
      startExt: ext,
      moved: 0,
      toggled: false,
      sx: e.clientX, sy: e.clientY,
      endX: pts[N].x, endY: pts[N].y
    };
    mode = 'drag';
    extV = 0;
    stage.classList.add('dragging');
    wake();
  });

  cord.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const p = toSvg(e);
    if (!p) return;
    drag.moved = Math.max(drag.moved, Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy));

    let vx = p.x - A.x, vy = p.y - A.y;
    let d = Math.hypot(vx, vy);
    if (d < 1) { vx = 0; vy = 1; d = 1; }
    let nx = vx / d, ny = vy / d;
    const minY = 0.2;                         // never let the cord swing up through the shade
    if (ny < minY) { ny = minY; nx = (nx < 0 ? -1 : 1) * Math.sqrt(1 - minY * minY); }

    const pull = drag.startExt + (d - drag.startDist);
    const len = CFG.length + clamp(pull, -34, CFG.pullMax);
    drag.endX = A.x + nx * len;
    drag.endY = A.y + ny * len;
    ext = clamp(pull, 0, CFG.pullMax);

    if (!drag.toggled && ext >= CFG.pullThreshold) { drag.toggled = true; pullSwitch(); }
    else if (drag.toggled && ext < CFG.pullThreshold * 0.4) { drag.toggled = false; }
    wake();
  });

  function endDrag(e, cancelled) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    const wasClick = !cancelled && drag.moved < 6 && !drag.toggled;
    if (cord.releasePointerCapture) { try { cord.releasePointerCapture(drag.id); } catch (_) { /* ignore */ } }
    drag = null;
    stage.classList.remove('dragging');
    if (wasClick) {
      startAuto();
    } else {
      mode = 'idle';
      extV = 0;
      release();
      wake();
    }
  }
  cord.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });   // dragging the cord must not scroll the page
  cord.addEventListener('pointerup', (e) => endDrag(e, false));
  cord.addEventListener('pointercancel', (e) => endDrag(e, true));

  /* ---------------- keyboard ---------------- */
  // Focus ring only for keyboard users (a mouse click also focuses the cord).
  window.addEventListener('keydown', () => stage.classList.add('kbd'), true);
  window.addEventListener('pointerdown', () => stage.classList.remove('kbd'), true);

  cord.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (e.repeat || mode === 'drag') return;
      markTouched();
      startAuto();
    }
  });

  /* ---------------- init ---------------- */
  announce(isOn);
  status.textContent = '';
  for (let i = 0; i < 90; i++) step(DT);    // let the cord hang naturally before first paint
  render();
  applyLevel(level);

  window.LampDemo = {
    on: () => setOn(true, 'api'),
    off: () => setOn(false, 'api'),
    toggle: () => setOn(!isOn, 'api'),
    setLevel: (l) => setLevel(l, 'api'),
    get isOn() { return isOn; },
    get level() { return level; }
  };
})();

/* ===== login.js ===== */
/* =========================================================
   Login page: the lamp switches the sign-in card on and off.
   DEMO ONLY: accounts live in this browser (localStorage), there is no server.
   Uses the Lamp events: #lampStage fires "lamp:change" ({on: true|false}).
   ========================================================= */
(function(){
  const LS_USERS = "alberto_users", LS_SESSION = "alberto_session";
  const $stage = $("#lampStage"), $card = $("#lgCard"), $pill = $("#loginLink");
  let mode = "login", offTimer = null;

  const read  = k => { try{ return JSON.parse(localStorage.getItem(k)); }catch(e){ return null; } };
  const write = (k,v) => { try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} };
  const esc   = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  async function hash(pw){
    const text = "alberto:" + pw;
    try{
      if(window.crypto && crypto.subtle){
        const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
        return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2,"0")).join("");
      }
    }catch(e){}
    let h = 5381; for(const c of text) h = ((h << 5) + h + c.charCodeAt(0)) | 0;   /* fallback for old browsers */
    return "x" + (h >>> 0).toString(16);
  }
  async function seed(){
    const users = read(LS_USERS) || [];
    if(!users.some(u => u.email === "demo@alberto.com")){
      users.push({name:"Demo Customer", email:"demo@alberto.com", hash: await hash("Demo@123")});
      write(LS_USERS, users);
    }
  }
  const session = () => read(LS_SESSION);

  /* ---------- header pill ---------- */
  function updatePill(){
    const s = session();
    $pill.find(".lg-label").text(s ? "Hi, " + s.name.split(" ")[0] : "Login");
    $pill.attr("aria-label", s ? "Signed in as " + s.name : "Login");
  }

  /* ---------- card views ---------- */
  function renderForm(){
    const reg = mode === "register";
    $card.html(`
      <div class="lg-brand"><img src="${ROOT}images/logo.png" alt="">ALBERTO</div>
      <h3>${reg ? "Create your account" : "Welcome back"}</h3>
      <p class="lg-sub">${reg ? "Join Alberto to save watches and track repairs." : "Sign in to see your saved watches and repairs."}</p>
      <div class="lg-tabs" role="tablist">
        <button type="button" role="tab" data-mode="login" class="${reg ? "" : "on"}" aria-selected="${!reg}">Login</button>
        <button type="button" role="tab" data-mode="register" class="${reg ? "on" : ""}" aria-selected="${reg}">Register</button>
      </div>
      <form id="lgForm" novalidate>
        ${reg ? `<div class="mb-3"><label for="lgName">Full name</label><input id="lgName" class="form-control" required minlength="2" autocomplete="name" placeholder="Your name"><div class="invalid-feedback">Please enter your name.</div></div>` : ""}
        <div class="mb-3"><label for="lgEmail">Email</label><input id="lgEmail" type="email" class="form-control" required autocomplete="email" placeholder="you@example.com"><div class="invalid-feedback">Enter a valid email address.</div></div>
        <div class="mb-3"><label for="lgPass">Password</label><div class="lg-pw"><input id="lgPass" type="password" class="form-control" required minlength="6" autocomplete="${reg ? "new-password" : "current-password"}" placeholder="At least 6 characters"><button type="button" class="lg-eye" aria-label="Show password">Show</button></div><div class="invalid-feedback">Password must be at least 6 characters.</div></div>
        ${reg ? `<div class="mb-3"><label for="lgPass2">Confirm password</label><input id="lgPass2" type="password" class="form-control" required autocomplete="new-password" placeholder="Repeat password"><div class="invalid-feedback">Passwords do not match.</div></div>` : ""}
        <div class="lg-msg" id="lgMsg" role="alert" hidden></div>
        <button class="lg-btn" type="submit">${reg ? "Create account" : "Sign in"}</button>
      </form>
      ${reg ? "" : `<p class="lg-demo">Demo account: <b>demo@alberto.com</b> / <b>Demo@123</b></p>`}`);
  }
  function renderWelcome(s){
    $card.html(`
      <div class="lg-avatar" aria-hidden="true">${esc(s.name.charAt(0).toUpperCase())}</div>
      <h3>Welcome, ${esc(s.name.split(" ")[0])}</h3>
      <p class="lg-sub">You are signed in as ${esc(s.email)}.</p>
      <a class="lg-btn" href="${U("products")}" data-p="products">Continue shopping</a>
      <button type="button" class="lg-link" id="lgOut">Log out</button>`);
  }
  function render(){ const s = session(); s ? renderWelcome(s) : renderForm(); updatePill(); }

  function msg(text, ok){ $("#lgMsg").toggleClass("ok", !!ok).text(text).prop("hidden", false); }
  function toast(text){ $("#toastOk .toast-body").text(text); bootstrap.Toast.getOrCreateInstance("#toastOk").show(); }

  /* ---------- events ---------- */
  $card.on("click", ".lg-tabs button", function(){ mode = $(this).data("mode"); renderForm(); setTimeout(() => $card.find("input").first().trigger("focus"), 50); });
  $card.on("click", ".lg-eye", function(){
    const $i = $("#lgPass"), show = $i.attr("type") === "password";
    $i.attr("type", show ? "text" : "password"); $(this).text(show ? "Hide" : "Show").attr("aria-label", show ? "Hide password" : "Show password");
  });
  $card.on("input", "#lgPass2", function(){ this.setCustomValidity($(this).val() === $("#lgPass").val() ? "" : "mismatch"); });
  $card.on("input", "#lgPass", function(){ const p2 = document.getElementById("lgPass2"); if(p2) p2.setCustomValidity($(p2).val() === $(this).val() ? "" : "mismatch"); });

  $card.on("submit", "#lgForm", async function(e){
    e.preventDefault();
    const f = this;
    if(!f.checkValidity()){ $(f).addClass("was-validated"); return; }
    const email = $("#lgEmail").val().trim().toLowerCase(), pass = $("#lgPass").val();
    const users = read(LS_USERS) || [], h = await hash(pass);
    if(mode === "register"){
      if(users.some(u => u.email === email)){ msg("An account with this email already exists. Try logging in."); return; }
      const user = {name: $("#lgName").val().trim(), email, hash: h};
      users.push(user); write(LS_USERS, users);
      signIn(user, "Account created. Welcome to Alberto!");
    }else{
      const user = users.find(u => u.email === email && u.hash === h);
      if(!user){ msg("Wrong email or password."); $card.removeClass("lg-shake"); void $card[0].offsetWidth; $card.addClass("lg-shake"); return; }
      signIn(user, "Signed in. Welcome back!");
    }
  });
  function signIn(user, text){
    write(LS_SESSION, {name:user.name, email:user.email});
    render(); toast(text);
  }
  $card.on("click", "#lgOut", function(){
    try{ localStorage.removeItem(LS_SESSION); }catch(e){}
    mode = "login"; render(); toast("You have been logged out.");
    if(window.LampDemo) setTimeout(() => window.LampDemo.off(), 250);
  });

  /* ---------- lamp <-> card ---------- */
  function lock(locked){
    if(locked) $card.attr({inert:"", "aria-hidden":"true"}); else $card.removeAttr("inert").attr("aria-hidden","false");
  }
  $stage.on("lamp:change", function(e){
    const on = e.originalEvent && e.originalEvent.detail ? e.originalEvent.detail.on : window.LampDemo.isOn;
    clearTimeout(offTimer);
    if(on){
      lock(false);
      setTimeout(() => { if(window.LampDemo.isOn && $("#login").hasClass("active")) $card.find("input").first().trigger("focus"); }, 950);
    }else{
      offTimer = setTimeout(() => { if(!window.LampDemo.isOn) lock(true); }, 900);
    }
  });

  /* ---------- page integration ---------- */
  $pill.toggleClass("on", PAGE === "login");
  lock(true);
  seed().then(render);
})();

/* ===== shop.js ===== */
/* ===== Alberto shop: cart, product page, WhatsApp booking ===== */
const WA_NUMBER = "923166295873"; /* <-- apna WhatsApp number yahan likhein (country code ke saath, bina + ke) */
let CART = [];
try{ CART = JSON.parse(localStorage.getItem("alb_cart")||"[]"); }catch(e){ CART = []; }
const saveCart = () => { try{ localStorage.setItem("alb_cart", JSON.stringify(CART)); }catch(e){} };
const waLink = text => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
const line = it => { const w = D.find(x => x.id===it.id); return w ? {w, q:it.q} : null; };

const TRASH_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 10v6M14 10v6"/></svg>';
function renderCart(){
  const rows = CART.map(line).filter(Boolean);
  const n = rows.reduce((a,r) => a+r.q, 0), total = rows.reduce((a,r) => a+r.q*r.w.price, 0);
  $("#cc").text(n).toggleClass("on", n>0);
  $("#cartCount").text(n ? n + (n===1 ? " item" : " items") : "");
  $("#cartList").html(rows.length ? rows.map(r => `<div class="wi"><div class="wi-img" style="${tint(r.w)}"><img src="${r.w.image}" alt=""></div><div class="wi-i"><small>${LINES[r.w.line]||r.w.line}${r.w.preorder?" &middot; Pre-order":""}</small><b>${r.w.name}</b><span>${money(r.w.price*r.q)}</span><div class="qty"><button type="button" data-q="-1" data-id="${r.w.id}" aria-label="Less of ${r.w.name}">&minus;</button><i>${r.q}</i><button type="button" data-q="1" data-id="${r.w.id}" aria-label="More of ${r.w.name}">+</button></div></div><button class="ci-x wi-x" type="button" data-rm="${r.w.id}" aria-label="Remove ${r.w.name}">${TRASH_SVG}</button></div>`).join("")
    : `<div class="wish-empty"><div class="heart"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 8H6"/><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/></svg></div><h4>Your cart is empty</h4><p>Add a watch you like and it will wait for you here.</p><a class="abtn" href="${U("products")}">Browse watches</a></div>`);
  $("#cartTotal").text(money(total));
  $("#cartFoot").toggle(rows.length>0);
  const left = FREE_DELIVERY_OVER - total;
  $("#shipTxt").html(left > 0 ? `Add <b>${money(left)}</b> more for free delivery` : "<b>You get free delivery!</b>");
  $("#shipBar").css("width", Math.min(100, total / FREE_DELIVERY_OVER * 100) + "%").toggleClass("full", left <= 0);
  $("#cartGo").attr("href", rows.length ? U("checkout") : "#").toggleClass("disabled", !rows.length);
}
/* a small copy of the watch photo flies into the cart button */
function flyToCart(from){
  const img = from && $(from).closest(".watch,.modal-content,.row,.hx,.wi").find("img").first()[0], to = document.getElementById("cartBtn");
  if(!img || !to || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !img.getBoundingClientRect) return 0;
  const a = img.getBoundingClientRect(), b = to.getBoundingClientRect(); if(!a.width) return 0;
  const f = img.cloneNode(); f.removeAttribute("loading");
  Object.assign(f.style, {position:"fixed", left:a.left+"px", top:a.top+"px", width:a.width+"px", height:a.height+"px", objectFit:"contain", zIndex:2000, pointerEvents:"none", borderRadius:"14px", filter:"drop-shadow(0 12px 18px rgba(0,0,0,.4))"});
  document.body.appendChild(f);
  const dx = b.left + b.width/2 - (a.left + a.width/2), dy = b.top + b.height/2 - (a.top + a.height/2);
  const an = f.animate([{transform:"translate(0,0) scale(1)", opacity:1}, {transform:`translate(${dx*.55}px,${dy*.45 - 60}px) scale(.55)`, opacity:1, offset:.55}, {transform:`translate(${dx}px,${dy}px) scale(.08)`, opacity:.2}], {duration:650, easing:"cubic-bezier(.5,0,.75,.4)"});
  an.onfinish = () => { f.remove(); $("#cartBtn").addClass("pop"); setTimeout(() => $("#cartBtn").removeClass("pop"), 350); };
  return 650;
}
function addCart(id, open, from){
  const pw = D.find(x => x.id===id); if(pw && pw.soldOut) return;
  const it = CART.find(x => x.id===id); it ? it.q++ : CART.push({id, q:1});
  saveCart(); renderCart();
  const wait = flyToCart(from);
  if(open){
    const showCart = () => setTimeout(() => bootstrap.Offcanvas.getOrCreateInstance("#cart").show(), wait), m = bootstrap.Modal.getInstance("#pm");
    if(m && $("#pm").hasClass("show")){ $("#pm").one("hidden.bs.modal", showCart); m.hide(); }   /* close the popup first so the two panels do not overlap */
    else showCart();
  }
  else { $("#cartBtn").addClass("pop"); setTimeout(() => $("#cartBtn").removeClass("pop"), 400); }
}
/* the button says "Added" for a moment */
function flashAdded(btn){
  if(!btn || btn.disabled || btn.dataset.busy) return;
  const old = btn.innerHTML; btn.dataset.busy = "1"; btn.classList.add("added");
  btn.innerHTML = '<svg class="ci-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>Added';
  setTimeout(() => { if(document.contains(btn)){ btn.innerHTML = old; btn.classList.remove("added"); delete btn.dataset.busy; } }, 1300);
}
$(document).on("click", "[data-add]", function(e){ e.stopPropagation(); addCart(String($(this).data("add")), true, this); flashAdded(this); });
$("#cartList").on("click", "[data-q]", function(){ const it = CART.find(x => x.id===$(this).data("id")); it.q += +$(this).data("q"); if(it.q<1) CART = CART.filter(x => x!==it); saveCart(); renderCart(); })
  .on("click", "[data-rm]", function(){ CART = CART.filter(x => x.id!==$(this).data("rm")); saveCart(); renderCart(); });
$("#cartGo").on("click", e => { if(!CART.length) e.preventDefault(); });

/* product page: pages/product.html?id=v1 */
function renderProduct(){
  const w = D.find(x => x.id===qs.get("id"));
  if(!w){ $("#pdetail").html(`<p>We could not find that watch. <a href="${U("products")}">See all watches</a>.</p>`); return; }
  const rel = D.filter(x => x.line===w.line && x.id!==w.id).slice(0,4);
  const specs = [["Collection", LINES[w.line]||w.line], ["Brand", w.brand||"Alberto"], ["Movement", w.movement], ["Case", w.case]];
  if(w.water) specs.push(["Water resistance", w.water]);
  const others = D.filter(x => x.id!==w.id).sort((a, b) => (b.line===w.line) - (a.line===w.line));
  $("#pdetail").html(`<div class="row g-4"><div class="col-md-6"><div class="ph mph big zoomable" style="${tint(w)}" tabindex="0" role="button" aria-pressed="false" aria-label="Zoom the photo of ${w.name}">${svg(w)}<span class="zhint" aria-hidden="true">Click to zoom</span></div></div><div class="col-md-6"><span class="br">${LINES[w.line]||w.line}</span><h2 role="heading" aria-level="1">${w.name}</h2><p class="pr" style="font-size:1.6rem">${money(w.price)}</p><p>${w.desc}</p><table class="spec"><caption class="visually-hidden">Specifications for ${w.name}</caption><tbody>${specs.map(r => `<tr><th scope="row">${r[0]}</th><td>${r[1]}</td></tr>`).join("")}</tbody></table><div class="d-flex gap-2 flex-wrap"><button class="abtn" type="button" data-add="${w.id}">${CART_ICON}Add to Cart</button><a class="abtn buy" href="${U("checkout","?buy="+w.id)}">${w.preorder?"Pre-order now":"Order now"}</a>${window.wishLBtn?wishLBtn(w.id):""}</div></div></div><section class="mt-5" aria-labelledby="cmpH"><h2 id="cmpH">Compare</h2><div class="cmp-bar"><label for="cmpSel">Compare ${w.name} with</label><select class="form-select" id="cmpSel">${others.map(x => `<option value="${x.id}">${x.name} (${LINES[x.line]||x.line})</option>`).join("")}</select></div><div class="cmp-wrap"><table class="spec cmp-tbl" id="cmpTbl" aria-live="polite"></table></div></section>${rel.length?`<h2 class="mt-5">More in ${LINES[w.line]||w.line}</h2><div class="row g-4">${rel.map(x => col(x,"col-12 col-sm-6 col-lg-3")).join("")}</div>`:""}`);
  const drawCmp = () => {
    const o = D.find(x => x.id===$("#cmpSel").val()); if(!o) return;
    const row = (k, f) => `<tr><th scope="row">${k}</th><td>${f(w)}</td><td>${f(o)}</td></tr>`;
    $("#cmpTbl").html(`<thead><tr><th scope="col"><span class="visually-hidden">Feature</span></th><th scope="col">${w.name}</th><th scope="col">${o.name}</th></tr></thead><tbody>${row("Price", x => money(x.price))}${row("Collection", x => LINES[x.line]||x.line)}${row("Movement", x => x.movement||"-")}${row("Case", x => x.case||"-")}${row("Water resistance", x => x.water||"-")}</tbody>`);
  };
  $("#cmpSel").on("change", drawCmp); drawCmp();
  document.title = `${w.name} | Alberto Watch Company`;
}

$("#pback").on("click", () => { location.href = U("products"); });
$("#hSearch").on("click", () => { if(PAGE === "products") $("#q").trigger("focus"); else location.href = U("products", "?focus=1"); });
$(function(){ renderCart(); });
$(document).ajaxComplete(renderCart);

/* ===== media.js ===== */
/* ===== photo banners + photo cards on every page ===== */
(function(){
  const BAN={products:"g4",technology:"tech1",stores:"store1",support:"sup1",gallery:"g1",about:"about1",contact:"contact",limited:"le-bench",booking:"sup2"};
  const CARD={"Retail":"g4","Repair":"sup1","Appraisal ":"g6","Checked and boxed":"g5","Looked after for life":"sup3","Honest pricing":"about2","Automatic movement":"tech1","Quartz & Solar":"tech2","Sapphire crystal":"tech4","Smart sensors":"tech5","Water resistance":"tech6","Steel and gold-plate":"g3",
    "Main Showroom":"store1","Repair Workshop":"store2","Airport Boutique":"store3","Repair service":"sup1","Appraisal":"g6","Warranty":"g5","Ask a question":"contact","Check your repair status":"sup2"};
  $(".page").each(function(){
    const id=this.id, im=BAN[id]; if(!im) return;
    const $h=$(this).children("h2").first(), $s=$h.next(".sub");
    $h.add($s).wrapAll('<div class="pban" style="--bg:url(../images/'+im+'.jpg)"><div class="pban-in"></div></div>');
  });
  $(".acard.info, .acard.svc").each(function(){
    const t=$(this).children("h3").first().text().replace(/&amp;/g,"&").trim(), im=CARD[t];
    if(im) $(this).prepend('<img class="cimg" src="'+ROOT+'images/'+im+'.jpg" alt="'+t+'" loading="lazy">');
  });
  /* solar photo sits with the Quartz & Solar card as a second picture */
  $(".acard.info:has(h3:contains('Quartz'))").first().find(".cimg").after('<img class="cimg" src="'+ROOT+'images/tech3.jpg" alt="Solar watch in sunlight" loading="lazy">').parent().find(".cimg").wrapAll('<div class="cimg2"></div>');
  /* support: parts and workshop strip */
  const strip='<h2 class="mt-5">Inside our workshop</h2><p class="sub">Batteries, straps, parts and water testing, all done in one place.</p><div class="row g-3">'+
    [["sup2","Battery change"],["sup3","Strap collection"],["sup4","Spare parts"],["sup5","Water test"]].map(x=>'<div class="col-6 col-lg-3"><figure class="pfig"><img src="'+ROOT+'images/'+x[0]+'.jpg" alt="'+x[1]+'" loading="lazy"><figcaption>'+x[1]+'</figcaption></figure></div>').join("")+'</div>';
  $("#support h2:contains('Frequently')").before(strip);
  /* about: team and story */
  $("#about .more").prepend('<h2 class="mt-5">Meet the team</h2><p class="sub">The people who will look after your watch.</p><div class="row g-4 mb-4"><div class="col-md-6"><figure class="pfig tall"><img src="'+ROOT+'images/team1.jpg" alt="Our watchmakers" loading="lazy"><figcaption>Our watchmakers</figcaption></figure></div><div class="col-md-6"><figure class="pfig tall"><img src="'+ROOT+'images/team2.jpg" alt="Our showroom advisers" loading="lazy"><figcaption>Our showroom advisers</figcaption></figure></div></div><div class="row g-4 align-items-center mb-2"><div class="col-md-6"><figure class="pfig"><img src="'+ROOT+'images/about2.jpg" alt="Watchmaking tools" loading="lazy"></figure></div><div class="col-md-6"><h3>Tools of the trade</h3><p>Brass tweezers, fine screwdrivers and a steady hand. Every Alberto watch passes through them before it reaches you.</p></div></div>');
  /* home: workshop story band before the stats */
  $("#home .stats").before('<div class="row g-4 align-items-center my-4"><div class="col-md-6"><figure class="pfig tall"><img src="'+ROOT+'images/g1.jpg" alt="A watchmaker at work" loading="lazy"></figure></div><div class="col-md-6"><h2>Made with patient hands</h2><p class="sub">Every watch is checked, cleaned and timed on our own bench before it goes to you.</p><button class="abtn" data-p="about" type="button">Meet the team</button></div></div>');
})();

/* ===== extra.js ===== */
/* ===== Alberto extras: wishlist, limited edition, booking, map, SEO titles, login auto-on ===== */
(function(){
  /* ---------- EDIT HERE: stores (used by map + booking form) ---------- */
  const STORES = [
    {id:"karachi",  name:"Main Showroom, Karachi",    addr:"21 Clock Tower Road, Karachi",  open:10, close:20, sun:false},
    {id:"lahore",   name:"Repair Workshop, Lahore",   addr:"8 Mall Arcade, Lahore",         open:9,  close:18, sun:false},
    {id:"islamabad",name:"Airport Boutique, Islamabad",addr:"Departures Hall, Islamabad Airport", open:7, close:23, sun:true}
  ];
  const $T = id => bootstrap.Toast.getOrCreateInstance("#toastMsg");
  function say(t){ $("#toastMsg .toast-body").text(t); $T().show(); }

  /* ---------- Wishlist ---------- */
  let WISH = []; try{ WISH = JSON.parse(localStorage.getItem("alb_wish")||"[]"); }catch(e){}
  const save = () => { try{ localStorage.setItem("alb_wish", JSON.stringify(WISH)); }catch(e){} };
  const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg>';
  window.wishBtn = id => `<button type="button" class="wish${WISH.includes(id)?" on":""}" data-wish="${id}" aria-pressed="${WISH.includes(id)}" aria-label="Add to wishlist">${HEART}</button>`;
  window.wishLBtn = id => `<button type="button" class="abtn wish-l${WISH.includes(id)?" on":""}" data-wish="${id}">${HEART}<span>Wishlist</span></button>`;
  const TRASH = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 10v6M14 10v6"/></svg>';
  window.renderWish = function(){
    WISH = WISH.filter(id => D.some(w => w.id===id) || !D.length);
    const rows = WISH.map(id => D.find(w => w.id===id)).filter(Boolean);
    $("#wc").text(rows.length).toggleClass("on", rows.length>0);
    $("#wishCount").text(rows.length ? rows.length + " saved" : "");
    $("#wishList").html(rows.length ? rows.map(w => `<div class="wi"><div class="wi-img" style="${tint(w)}"><img src="${w.image}" alt=""></div><div class="wi-i"><small>${LINES[w.line]||w.line}</small><b>${w.name}</b><span>${money(w.price)}</span><button class="abtn" data-add="${w.id}" type="button"${w.soldOut?" disabled":""}>${w.soldOut?"Sold out":(w.preorder?"Pre-order":"Add to cart")}</button></div><button class="ci-x wi-x" data-wish="${w.id}" type="button" aria-label="Remove ${w.name} from wishlist">${TRASH}</button></div>`).join("")
      : `<div class="wish-empty"><div class="heart"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg></div><h4>Nothing saved yet</h4><p>Tap the heart on any watch to keep it here for later.</p><a class="abtn" href="${U("products")}">Browse watches</a></div>`);
    $("[data-wish]").each(function(){ const on = WISH.includes(String($(this).data("wish"))); $(this).toggleClass("on", on).attr("aria-pressed", on); });
    $("#wishTotal").text(money(rows.reduce((a, w) => a + w.price, 0)));
    $("#wishFoot").toggle(rows.length>0);
  };
  $(document).on("click","[data-wish]",function(e){
    e.preventDefault(); e.stopPropagation();
    const id = String($(this).data("wish")), had = WISH.includes(id);
    WISH = had ? WISH.filter(x => x!==id) : [...WISH, id]; save(); renderWish();
    if(!had){ $("#wishBtn").addClass("pop"); setTimeout(() => $("#wishBtn").removeClass("pop"), 400); }
    const w = D.find(x => x.id===id);
    if(!$(this).closest("#wishList").length) say(had ? "Removed from wishlist" : (w? w.name+" saved to wishlist" : "Saved to wishlist"));
  });
  $("#wishClear").on("click", function(){ WISH = []; save(); renderWish(); say("Wishlist cleared"); });
  $("#wishAll").on("click",function(){ WISH.forEach(id => { const it = CART.find(x => x.id===id); it ? it.q++ : CART.push({id,q:1}); }); saveCart(); renderCart(); bootstrap.Offcanvas.getOrCreateInstance("#wish").hide(); bootstrap.Offcanvas.getOrCreateInstance("#cart").show(); });
  /* adding to cart from the wishlist closes it and opens the cart */
  $("#wishList").on("click","[data-add]",function(){ bootstrap.Offcanvas.getOrCreateInstance("#wish").hide(); });

  /* ---------- Limited edition page ---------- */
  window.buildLimited = function(){
    const list = D.filter(w => w.line==="Limited Edition");
    $("#leList").html(list.length ? list.map(w => {
      return `<article class="le-row"><div class="ph" style="${tint(w)}">${svg(w)}${wishBtn(w.id)}</div><div><span class="br">Limited Edition</span><h3>${w.name}</h3><p class="pr">${money(w.price)}</p><p>${w.desc}</p><dl class="pdl"><dt>Movement</dt><dd>${w.movement}</dd><dt>Case</dt><dd>${w.case}</dd>${w.water?`<dt>Water resistance</dt><dd>${w.water}</dd>`:""}${w.pieces?`<dt>Edition</dt><dd>Limited to ${w.pieces} pieces</dd>`:""}${w.delivery?`<dt>Delivery</dt><dd>${w.delivery}</dd>`:""}</dl><div class="le-btns"><a class="abtn buy" href="${U("checkout","?buy="+w.id)}">Pre-order now</a><button class="abtn ghost" type="button" onclick="openW('${w.id}')">View details</button></div></div></article>`;
    }).join("") : '<p class="sub">New limited editions are coming soon.</p>');
  };

  /* ---------- Map ---------- */
  let mapI = 0;
  function setMap(i){
    mapI = i; const s = STORES[i], q = encodeURIComponent(s.addr);
    $("#mapFrame").attr("src", `https://www.google.com/maps?q=${q}&output=embed`);
    $("#mapOpen").attr("href", `https://www.google.com/maps/search/?api=1&query=${q}`);
    $("#mapDir").attr("href", `https://www.google.com/maps/dir/?api=1&destination=${q}`);
    $("#mapTabs button").each(function(k){ $(this).toggleClass("on", k===i); });
  }
  $("#mapTabs").html(STORES.map((s,i)=>`<button type="button" data-i="${i}">${s.name.split(",")[1].trim()}</button>`).join("")).on("click","button",function(){ setMap(+$(this).data("i")); });
  let mapDone = false;
  function mapInit(){ if(!mapDone){ mapDone = true; setMap(0); } }

  /* ---------- Booking form ---------- */
  const pad = n => String(n).padStart(2,"0");
  $("#bkStore").html(STORES.map((s,i)=>`<option value="${i}">${s.name}</option>`).join(""));
  function fillTimes(){
    const s = STORES[+$("#bkStore").val()]; if(!s) return; let o = '<option value="">Choose a time</option>';
    for(let h=s.open; h<s.close; h++) o += `<option>${pad(h)}:00</option>`;
    $("#bkTime").html(o);
  }
  $("#bkStore").on("change", fillTimes); fillTimes();
  const today = new Date(); $("#bkDate").attr("min", `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`);
  function dateOk(){
    const v = $("#bkDate").val(), el = $("#bkDate")[0], s = STORES[+$("#bkStore").val()];
    let m = "";
    if(v){ const d = new Date(v+"T00:00"); if(d < new Date(today.getFullYear(),today.getMonth(),today.getDate())) m = "Please choose today or a later date."; else if(d.getDay()===0 && !s.sun) m = "This store is closed on Sundays. Please pick another day."; }
    el.setCustomValidity(m); if(m) $("#bkDateMsg").text(m); else $("#bkDateMsg").text("Choose a date.");
  }
  $("#bkDate,#bkStore").on("change input", dateOk);
  $("#bkForm").on("submit", function(e){
    e.preventDefault(); dateOk();
    if(!this.checkValidity()){ $(this).addClass("was-validated"); return; }
    const s = STORES[+$("#bkStore").val()];
    const msg = `Hello Alberto Watch Company, I would like to book a repair slot.\nName: ${$("#bkName").val().trim()}\nPhone: ${$("#bkPhone").val().trim()}\nWatch: ${$("#bkWatch").val().trim()}\nService: ${$("#bkSvc").val()}\nStore: ${s.name}\nDate: ${$("#bkDate").val()}\nTime: ${$("#bkTime").val()}\nNotes: ${$("#bkNote").val().trim()||"-"}`;
    const url = waLink(msg);
    $("#bkLink").attr("href", url); $("#bkOk").addClass("show");
    window.open(url, "_blank", "noopener");
  });

  /* ---------- page start: map on the stores page, lamp on the login page ---------- */
  if(PAGE === "stores") mapInit();
  $("#wish").on("show.bs.offcanvas", renderWish);
  renderWish();
})();



/* ===== polish.js: picture fade-in, photo zoom, repair status (demo), before / after slider ===== */
(function(){
  /* a picture inside a .ph card shows once it has loaded (a soft shimmer shows until then) */
  const done = el => { const p = el && el.closest && el.closest(".ph"); if(p) p.classList.add("ld"); };
  const mark = () => document.querySelectorAll(".ph img").forEach(i => { if(i.complete) done(i); });
  document.addEventListener("load", e => { if(e.target.tagName === "IMG") done(e.target); }, true);
  document.addEventListener("error", e => { if(e.target.tagName === "IMG") done(e.target); }, true);
  let queued = 0;
  new MutationObserver(() => { if(!queued) queued = requestAnimationFrame(() => { queued = 0; mark(); }); }).observe(document.body, {childList: true, subtree: true});
  mark();
  setTimeout(() => document.querySelectorAll(".ph").forEach(p => p.classList.add("ld")), 5000);   /* safety net */

  /* product photo zoom: click / tap / Enter toggles, the mouse moves the zoomed area, Esc closes */
  $(document).on("click keydown", ".zoomable", function(e){
    if(e.type === "keydown"){ if(e.key !== "Enter" && e.key !== " ") return; e.preventDefault(); }
    const on = !$(this).hasClass("zoomed");
    $(this).toggleClass("zoomed", on).attr("aria-pressed", on);
    if(on && e.type === "click"){ const r = this.getBoundingClientRect(); this.style.setProperty("--zx", ((e.clientX - r.left) / r.width * 100) + "%"); this.style.setProperty("--zy", ((e.clientY - r.top) / r.height * 100) + "%"); }
  });
  $(document).on("mousemove", ".zoomable.zoomed", function(e){
    const r = this.getBoundingClientRect();
    this.style.setProperty("--zx", ((e.clientX - r.left) / r.width * 100) + "%"); this.style.setProperty("--zy", ((e.clientY - r.top) / r.height * 100) + "%");
  });
  $(document).on("keydown", e => { if(e.key === "Escape") $(".zoomable.zoomed").removeClass("zoomed").attr("aria-pressed", "false"); });

  /* repair status (demo only: three sample codes, no server) */
  const RS = {
    "ALB-1001": {step: 1, note: "We have your watch. A watchmaker will inspect it and send you a written quote."},
    "ALB-1002": {step: 3, note: "Your watch is on the bench. We will message you when it is ready."},
    "ALB-1003": {step: 4, note: "Your watch is ready. Please bring your repair slip to the store."}
  };
  const RS_STEPS = ["Received", "Quote approved", "In the workshop", "Ready for pickup"];
  $("#rsForm").on("submit", function(e){
    e.preventDefault();
    const code = $("#rsCode").val().trim().toUpperCase(), r = RS[code], $o = $("#rsOut");
    if(!code){ $o.html('<p class="rs-msg rs-err">Please enter the code from your repair slip.</p>'); return; }
    if(!r){ $o.html('<p class="rs-msg rs-err">We could not find that code. Check your slip, or contact your nearest store.</p>'); return; }
    $o.html(`<p class="rs-msg">${code}: ${RS_STEPS[r.step - 1]}</p><p>${r.note}</p><ol class="rs-steps">${RS_STEPS.map((s, i) => `<li class="${i + 1 < r.step ? "done" : i + 1 === r.step ? "now" : ""}"${i + 1 === r.step ? ' aria-current="step"' : ""}><span>${i + 1}</span>${s}</li>`).join("")}</ol>`);
  });

  /* before / after slider */
  $("#baRange").on("input", function(){ document.getElementById("ba").style.setProperty("--pos", this.value + "%"); });
})();
