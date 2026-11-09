/* ===== Alberto sound engine (Web Audio, no sound files) =====
   Used by the checkout page and the order-confirmed (receipt printer) page.
   Sound is ON by default and loud; the customer can switch it off and the choice is remembered. */
(function(){
  let ctx = null, muted = false, printerNodes = null, noiseBuf = null, master = null;
  const LOUD = 4.5;                 /* master volume boost: all sounds are loud (a compressor stops harsh clipping) */
  try{ muted = localStorage.getItem("alb_sound") === "0"; }catch(e){}   /* sound is ON unless the visitor switched it off */

  function init(){
    if(!ctx){
      const AC = window.AudioContext || window.webkitAudioContext;
      if(AC){
        ctx = new AC();
        master = ctx.createGain(); master.gain.value = LOUD;
        const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.knee.value = 12; comp.ratio.value = 6; comp.attack.value = .003; comp.release.value = .2;
        master.connect(comp); comp.connect(ctx.destination);
      }
    }
    if(ctx && ctx.state === "suspended") ctx.resume();
  }
  function noise(){
    if(noiseBuf) return noiseBuf;
    const n = ctx.sampleRate * 0.8, b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
    for(let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return (noiseBuf = b);
  }
  function burst(freq, q, dur, vol, type, delay){
    if(!ctx) return;
    const t = ctx.currentTime + (delay || 0), src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = noise(); f.type = type || "bandpass"; f.frequency.value = freq; f.Q.value = q;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(master); src.start(t); src.stop(t + dur + 0.02);
  }
  function tone(f1, f2, dur, vol, type, delay){
    if(!ctx) return;
    const t = ctx.currentTime + (delay || 0), o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || "sine"; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.03);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
  }
  const safe = fn => function(){ if(muted) return; init(); if(!ctx) return; try{ fn.apply(null, arguments); }catch(e){} };

  const S = {
    isMuted: () => muted,
    setMuted(m){
      muted = !!m;
      try{ localStorage.setItem("alb_sound", muted ? "0" : "1"); }catch(e){}
      if(muted) S.printerStop(false); else { init(); S.chime(); }
      return muted;
    },
    toggle(){ return S.setMuted(!muted); },

    /* soft click for steps and buttons */
    tick: safe(() => { tone(900, 700, 0.04, 0.04, "square"); }),
    /* checkout truck sequence */
    thud: safe(() => { tone(150, 60, 0.13, 0.12); burst(900, 1.5, 0.05, 0.06); }),
    door: safe(() => { burst(1400, 1.2, 0.09, 0.07); tone(240, 120, 0.07, 0.04, "triangle"); }),
    whoosh: safe(() => {
      const t = ctx.currentTime, src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      src.buffer = noise(); f.type = "bandpass"; f.Q.value = 1.1;
      f.frequency.setValueAtTime(400, t); f.frequency.exponentialRampToValueAtTime(3400, t + 0.65);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.08, t + 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
      src.connect(f); f.connect(g); g.connect(master); src.start(t); src.stop(t + 0.75);
    }),
    chime: safe(() => {
      tone(784, 784, 0.18, 0.05, "triangle"); tone(1047, 1047, 0.26, 0.05, "triangle", 0.09); tone(1319, 1319, 0.4, 0.04, "triangle", 0.18);
    }),

    /* receipt printer */
    printerStart: safe(() => {
      if(printerNodes) return;
      const t = ctx.currentTime, o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      o1.type = "sawtooth"; o1.frequency.setValueAtTime(30, t); o1.frequency.linearRampToValueAtTime(62, t + 0.5);
      o2.type = "square"; o2.frequency.setValueAtTime(61, t); o2.frequency.linearRampToValueAtTime(124, t + 0.5);
      f.type = "lowpass"; f.frequency.value = 380;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.03, t + 0.35);
      o1.connect(f); o2.connect(f); f.connect(g); g.connect(master); o1.start(); o2.start();
      printerNodes = {oscs: [o1, o2], gain: g};
    }),
    printerTick: safe(() => { burst(2400 + Math.random() * 900, 3, 0.03, 0.07); burst(700, 2, 0.02, 0.03); }),
    printerStop(withClunk){
      const n = printerNodes; printerNodes = null;
      if(n && ctx){
        try{
          const t = ctx.currentTime;
          n.gain.gain.cancelScheduledValues(t); n.gain.gain.setValueAtTime(n.gain.gain.value, t);
          n.gain.gain.linearRampToValueAtTime(0.0001, t + 0.12); n.oscs.forEach(o => o.stop(t + 0.15));
        }catch(e){}
      }
      if(withClunk && !muted && ctx){
        try{
          const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
          o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(55, t + 0.12);
          g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
          o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.16); burst(1800, 1.5, 0.05, 0.1);
        }catch(e){}
      }
    },
    printerTear: safe(ms => {
      const n = Math.max(1, Math.round(ms / 38));
      for(let i = 0; i < n; i++) burst(1200 + Math.random() * 3200, 0.9, 0.05, 0.09 + Math.random() * 0.06, "highpass", (i * 38) / 1000);
    })
  };
  ["pointerdown","keydown","touchstart"].forEach(ev => window.addEventListener(ev, () => { if(!muted) init(); }, {once: true, passive: true}));
  window.AlbSound = S;
})();
