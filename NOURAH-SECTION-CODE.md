# Nourah hero section — full code

Two heroes render depending on width: `MobileHero` (`< 768px`, the `.mh-*` styles)
and the desktop `<section className="hidden md:flex ...">` block inside `Home()`.

---

## 1. Mobile hero — JSX  (`client/src/pages/Home.tsx`)

```tsx
function MobileHero() {
  return (
    <section className="mh-section">
      {/* Tiny white dots — full section */}
      <div className="mh-dots-bg" aria-hidden>
        <span style={{left:"3%",  top:"8%",  animationDelay:"0s"}}>·</span>
        <span style={{left:"11%", top:"18%", animationDelay:"0.7s"}}>·</span>
        <span style={{left:"19%", top:"5%",  animationDelay:"1.4s"}}>·</span>
        <span style={{left:"27%", top:"28%", animationDelay:"0.3s"}}>·</span>
        <span style={{left:"35%", top:"14%", animationDelay:"2.1s"}}>·</span>
        <span style={{left:"43%", top:"38%", animationDelay:"0.9s"}}>·</span>
        <span style={{left:"51%", top:"9%",  animationDelay:"1.8s"}}>·</span>
        <span style={{left:"59%", top:"22%", animationDelay:"0.4s"}}>·</span>
        <span style={{left:"67%", top:"44%", animationDelay:"2.6s"}}>·</span>
        <span style={{left:"75%", top:"11%", animationDelay:"1.1s"}}>·</span>
        <span style={{left:"83%", top:"33%", animationDelay:"0.6s"}}>·</span>
        <span style={{left:"91%", top:"7%",  animationDelay:"2.0s"}}>·</span>
        <span style={{left:"6%",  top:"48%", animationDelay:"1.5s"}}>·</span>
        <span style={{left:"14%", top:"62%", animationDelay:"0.2s"}}>·</span>
        <span style={{left:"22%", top:"55%", animationDelay:"3.1s"}}>·</span>
        <span style={{left:"30%", top:"72%", animationDelay:"0.8s"}}>·</span>
        <span style={{left:"38%", top:"58%", animationDelay:"1.9s"}}>·</span>
        <span style={{left:"46%", top:"80%", animationDelay:"0.5s"}}>·</span>
        <span style={{left:"54%", top:"65%", animationDelay:"2.4s"}}>·</span>
        <span style={{left:"62%", top:"77%", animationDelay:"1.2s"}}>·</span>
        <span style={{left:"70%", top:"52%", animationDelay:"0.1s"}}>·</span>
        <span style={{left:"78%", top:"68%", animationDelay:"2.8s"}}>·</span>
        <span style={{left:"86%", top:"83%", animationDelay:"0.6s"}}>·</span>
        <span style={{left:"94%", top:"59%", animationDelay:"1.7s"}}>·</span>
        <span style={{left:"9%",  top:"88%", animationDelay:"2.3s"}}>·</span>
        <span style={{left:"24%", top:"94%", animationDelay:"0.9s"}}>·</span>
        <span style={{left:"42%", top:"91%", animationDelay:"3.4s"}}>·</span>
        <span style={{left:"60%", top:"96%", animationDelay:"1.0s"}}>·</span>
        <span style={{left:"77%", top:"90%", animationDelay:"2.7s"}}>·</span>
        <span style={{left:"93%", top:"85%", animationDelay:"0.3s"}}>·</span>
        <span style={{left:"16%", top:"41%", animationDelay:"1.6s"}}>·</span>
        <span style={{left:"48%", top:"31%", animationDelay:"2.2s"}}>·</span>
        <span style={{left:"72%", top:"25%", animationDelay:"0.7s"}}>·</span>
        <span style={{left:"89%", top:"46%", animationDelay:"3.0s"}}>·</span>
      </div>

      {/* Twinkling background stars — upper zone only */}
      <div className="mh-stars" aria-hidden>
        <span className="mh-star mh-s1">✦</span>
        <span className="mh-star mh-s2">✧</span>
        <span className="mh-star mh-s3">·</span>
        <span className="mh-star mh-s4">✦</span>
        <span className="mh-star mh-s5">✧</span>
        <span className="mh-star mh-s6">⋆</span>
        <span className="mh-star mh-s7">·</span>
        <span className="mh-star mh-s8">✦</span>
        <span className="mh-star mh-s9">✧</span>
        <span className="mh-star mh-s10">·</span>
        <span className="mh-star mh-s11">✦</span>
        <span className="mh-star mh-s12">⋆</span>
        <span className="mh-star mh-s13">✧</span>
        <span className="mh-star mh-s14">·</span>
        <span className="mh-star mh-s15">✦</span>
        <span className="mh-star mh-s16">✧</span>
        <span className="mh-star mh-s17">⋆</span>
        <span className="mh-star mh-s18">·</span>
        <span className="mh-star mh-s19">✦</span>
        <span className="mh-star mh-s20">✧</span>
        <span className="mh-star mh-s21">·</span>
        <span className="mh-star mh-s22">⋆</span>
        <span className="mh-star mh-s23">✦</span>
        <span className="mh-star mh-s24">✧</span>
      </div>

      <div className="mh-content">
        {/* Portrait in retro window frame */}
        <div className="mh-portrait-wrap">
          {/* Orbiting emojis around the card */}
          <span className="mh-orbit mh-o1" aria-hidden>✦</span>
          <span className="mh-orbit mh-o2" aria-hidden>💫</span>
          <span className="mh-orbit mh-o4" aria-hidden>⚡</span>
          <span className="mh-orbit mh-o5" aria-hidden>🔮</span>
          <span className="mh-orbit mh-o9" aria-hidden>✦</span>
          <span className="mh-orbit mh-o10" aria-hidden>🌙</span>

          {/* mh-window card commented out
          <div className="mh-window">
            <div className="mh-titlebar">
              <div className="mh-dots"><span /><span /><span /></div>
              <span className="mh-win-title"></span>
              <div className="mh-win-controls"><span>−</span><span>□</span></div>
            </div>
            <div className="mh-portrait-frame">
              <img className="mh-img" src="/image glow.png" alt="Nourah Alotaibi" />
              <div className="mh-scan-line" aria-hidden />
              <span className="mh-inner-spark mh-is1" aria-hidden>✦</span>
              <span className="mh-inner-spark mh-is2" aria-hidden>✧</span>
              <span className="mh-inner-spark mh-is3" aria-hidden>·</span>
              <span className="mh-inner-spark mh-is4" aria-hidden>✦</span>
              <span className="mh-inner-spark mh-is5" aria-hidden>✧</span>
            </div>
          </div>
          */}
          <span className="mh-corner-robot" aria-hidden>🤖</span>
          <div className="mh-portrait-frame">
            <img className="mh-img" src="/image.png" alt="Nourah Alotaibi" />
            <span className="mh-inner-spark mh-is1" aria-hidden>✦</span>
            <span className="mh-inner-spark mh-is2" aria-hidden>✧</span>
            <span className="mh-inner-spark mh-is3" aria-hidden>·</span>
            <span className="mh-inner-spark mh-is4" aria-hidden>✦</span>
            <span className="mh-inner-spark mh-is5" aria-hidden>✧</span>
          </div>

          {/* Floating laptop icon */}
          <div className="mh-float-item mh-computer" aria-hidden>
            <svg viewBox="0 0 100 82" fill="none">
              <rect x="18" y="8" width="64" height="45" rx="5" fill="#12132e" stroke="#FFD166" strokeWidth="4"/>
              <rect x="25" y="15" width="50" height="31" rx="2" fill="#211548" stroke="#7E3FF2" strokeWidth="2"/>
              <path d="M12 58 H88 L96 70 Q96 75 89 75 H11 Q4 75 4 70 Z" fill="#16133D" stroke="#FFD166" strokeWidth="4"/>
            </svg>
          </div>

          {/* Frame sparkles — top and sides only */}
          <span className="mh-frame-sparkle mh-fs1">✦</span>
          <span className="mh-frame-sparkle mh-fs4">✦</span>
          <span className="mh-frame-sparkle mh-fs6">✦</span>
        </div>

        {/* Intro text */}
        <div className="mh-intro">
          <h1>
            <span className="mh-greeting">Hi, I'm</span>
            <span className="hero-name-nourah">Nourah</span>
            <span className="hero-name-alotaibi">Alotaibi!</span>
            <span className="wave"> 👋🏻</span>
          </h1>
          <div className="mh-socials">
            <a
              className="mh-social"
              href="https://github.com/nourah-alotaibi"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github />
            </a>
            <a
              className="mh-social"
              href="https://www.linkedin.com/in/nourah-fahad-alotaibi-14b121226/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin />
            </a>
            <a
              className="mh-social"
              href="mailto:noooriii760@gmail.com"
              aria-label="Email"
            >
              <Mail />
            </a>
          </div>
          <p className="mh-role">
            Computer Engineer <span>✦</span> AI Developer
          </p>
          <a href="#journey" className="mh-btn">
            <span className="mh-btn-star">✦</span>
            Explore My Journey <span>→</span>
          </a>
        </div>
      </div>

    </section>
  );
}
```

## 2. Mobile hero — CSS  (`client/src/index.css`)

### 2a. Shared name / greeting styles (top of file)
```css
/* ── Hero name styling — shared mobile + desktop ── */
.mh-greeting {
  display: block;
  font-family: 'Poppins', system-ui, sans-serif;
  font-weight: 700;
  font-size: clamp(30.4px, 8.1vw, 38px);
  letter-spacing: .02em;
  line-height: 1.1;
  margin-bottom: 4px;
  color: #fff;
  -webkit-text-fill-color: initial;
  text-shadow: 0 0 22px rgba(216, 180, 254, .5);
}

/* Mobile hero — name: vertical gradient, single line */
.mh-intro .hero-name-nourah,
.mh-intro .hero-name-alotaibi {
  display: inline;
  font-family: 'Lobster', cursive;
  background: linear-gradient(180deg, #f3e8ff 0%, #d8b4fe 40%, #a855f7 100%);
  background-size: auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  animation: none;
  filter: drop-shadow(0 0 26px rgba(168, 85, 247, .6));
  letter-spacing: inherit;
}
.mh-intro .hero-name-nourah { margin-right: .28em; }

/* emoji must opt out of the transparent fill */
.wave {
  -webkit-text-fill-color: initial;
  color: initial;
  display: inline-block;
}
.hero-name-nourah {
  font-family: 'Lobster', cursive;
  font-weight: 400;
  background: linear-gradient(90deg, #4c1d95, #7c3aed, #a855f7, #c084fc, #a855f7, #7c3aed, #4c1d95);
  background-size: 300% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: hero-name-cinematic 5s ease-in-out infinite alternate;
  filter: drop-shadow(0 0 6px #fff) drop-shadow(0 0 14px rgba(255,255,255,.7)) drop-shadow(0 0 28px rgba(168,85,247,.6));
}
.hero-name-alotaibi {
  font-family: 'Lobster', cursive;
  font-weight: 400;
  background: linear-gradient(90deg, #3b0764, #6d28d9, #8b5cf6, #c084fc, #e879f9, #c084fc, #8b5cf6, #6d28d9);
  background-size: 300% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: hero-name-cinematic 6s ease-in-out infinite alternate-reverse;
  filter: drop-shadow(0 0 6px #fff) drop-shadow(0 0 14px rgba(255,255,255,.7)) drop-shadow(0 0 28px rgba(192,132,252,.5));
  letter-spacing: 0.01em;
}
@keyframes hero-name-cinematic {
```

### 2b. Mobile hero block
```css
/* ════════════════════════════════════════════════
   Mobile Hero  (shown only when .md:hidden is active,
   i.e. viewport < 768px)
   ════════════════════════════════════════════════ */
.mh-section {
  display: flex;
  position: relative;
  width: 100%;
  min-height: 100svh;
  overflow: hidden;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  padding: 114px 18px 70px;
  background:
    radial-gradient(circle at 50% 28%, rgba(126,63,242,.16), transparent 34%),
    radial-gradient(circle at 20% 70%, rgba(74,22,143,.12),  transparent 30%),
    linear-gradient(180deg, #171827 0%, #101020 36%, #0b0719 68%, #0d071c 100%);
  color: #fff;
}
.mh-content {
  width: 100%;
  max-width: 430px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 5;
}

/* ── Portrait card ── */
.mh-portrait-wrap {
  position: relative;
  width: clamp(200px, 62vw, 255px);
  margin: 0 auto;
  animation: mh-card-float 4s ease-in-out infinite;
}
.mh-portrait-wrap::before {
  content: '';
  position: absolute;
  inset: -20px;
  border-radius: 50%;
  border: 1.5px dashed rgba(197, 165, 255, .42);
  pointer-events: none;
  z-index: 0;
}
/* ── Retro neon window card ── */
.mh-window {
  position: relative;
  z-index: 2;
  overflow: hidden;
  border: 2px solid rgba(230, 100, 255, .9);
  border-radius: 20px;
  background: linear-gradient(145deg, rgba(22,19,61,.92), rgba(8,11,31,.96));
  box-shadow:
    0 0 0 2px rgba(200,60,255,.35),
    0 0 12px rgba(220,80,255,.8),
    0 0 28px rgba(200,60,255,.7),
    0 0 55px rgba(180,40,240,.5),
    0 0 90px rgba(160,20,220,.3),
    0 20px 50px rgba(0,0,0,.6),
    inset 0 0 18px rgba(200,80,255,.15);
  backdrop-filter: blur(14px);
  animation: mh-neon-pulse 2.8s ease-in-out infinite;
}
.mh-titlebar {
  height: 32px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: 0 10px;
  border-bottom: 1px solid rgba(197,165,255,.28);
  background: linear-gradient(90deg, rgba(74,22,143,.55), rgba(22,19,61,.7), rgba(74,22,143,.35));
}
.mh-dots { display: flex; align-items: center; gap: 5px; }
.mh-dots span {
  width: 7px; height: 7px; border-radius: 50%;
  background: rgba(255,209,102,.85);
  box-shadow: 0 0 5px rgba(255,209,102,.7);
}
.mh-dots span:nth-child(2) { background: rgba(126,63,242,.9); box-shadow: 0 0 5px rgba(126,63,242,.8); }
.mh-dots span:nth-child(3) { background: rgba(197,165,255,.8); box-shadow: 0 0 5px rgba(197,165,255,.7); }
.mh-win-title {
  justify-self: center;
  font-family: "Courier New", monospace;
  font-size: 9px;
  letter-spacing: .1em;
  color: rgba(197,165,255,.85);
  text-shadow: 0 0 8px rgba(197,165,255,.7), 0 0 18px rgba(126,63,242,.4);
  animation: mh-title-flicker 9s ease-in-out infinite;
}
.mh-win-controls { display: flex; gap: 6px; font-family: monospace; font-size: 9px; color: rgba(255,255,255,.38); }

/* Portrait frame — circular for mobile hero */
.mh-portrait-frame {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 3px solid rgba(197, 165, 255, 0.80);
  box-shadow:
    0 0 0 6px rgba(126, 63, 242, 0.38),
    0 0 22px rgba(126, 63, 242, 0.75),
    0 0 52px rgba(197, 165, 255, 0.48);
  animation: mh-circle-glow 3s ease-in-out infinite;
}
.mh-portrait-frame::before { display: none; }
.mh-portrait-frame::after { display: none; }

@keyframes mh-circle-glow {
  0%, 100% {
    box-shadow:
      0 0 0 6px rgba(126, 63, 242, 0.38),
      0 0 22px rgba(126, 63, 242, 0.75),
      0 0 52px rgba(197, 165, 255, 0.48);
  }
  50% {
    box-shadow:
      0 0 0 9px rgba(168, 85, 247, 0.50),
      0 0 38px rgba(168, 85, 247, 0.90),
      0 0 75px rgba(197, 165, 255, 0.62);
  }
}
.mh-img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center top; }
.mh-corner-robot {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 22px;
  line-height: 1;
  z-index: 10;
  pointer-events: none;
  filter: drop-shadow(0 0 6px rgba(126, 63, 242, 0.7));
}

/* CRT scanline sweep */
.mh-scan-line {
  position: absolute;
  left: 0; right: 0;
  height: 2px;
  z-index: 5;
  pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(197,165,255,.35), rgba(126,63,242,.65), rgba(197,165,255,.35), transparent);
  box-shadow: 0 0 8px rgba(126,63,242,.7), 0 0 22px rgba(126,63,242,.35);
  animation: mh-scan-sweep 5s linear infinite;
}

/* Inner portrait sparkles */
.mh-inner-spark {
  position: absolute;
  z-index: 6;
  pointer-events: none;
  user-select: none;
  line-height: 1;
}
.mh-is1 { top: 10%; left: 7%;  font-size: 7px; color: #fff; filter: drop-shadow(0 0 4px rgba(255,255,255,.8)); animation: mh-sparkle 2.4s ease-in-out infinite 0s; }
.mh-is2 { top: 7%;  right: 8%; font-size: 6px; color: #fff; filter: drop-shadow(0 0 4px rgba(255,255,255,.8)); animation: mh-sparkle 3.1s ease-in-out infinite 1.1s; }
.mh-is3 {
  bottom: 20%; left: 10%; font-size: 6px; color: #e9d5ff;
  filter: drop-shadow(0 0 4px rgba(197,165,255,.7));
  animation: mh-sparkle 3.7s ease-in-out infinite 0.6s;
}
.mh-is4 { bottom: 10%; right: 7%; font-size: 7px; color: #fff; filter: drop-shadow(0 0 4px rgba(255,255,255,.8)); animation: mh-sparkle 2.9s ease-in-out infinite 1.6s; }
.mh-is5 {
  top: 48%; left: 50%; transform: translate(-50%,-50%);
  font-size: 6px; color: #c5a5ff;
  filter: drop-shadow(0 0 4px rgba(197,165,255,.7));
  animation: mh-sparkle 4.2s ease-in-out infinite 2.2s;
}

/* ── Floating decoration items ── */
.mh-float-item {
  position: absolute;
  z-index: 7;
  filter: drop-shadow(0 0 10px rgba(126,63,242,.7));
}
.mh-computer {
  width: 58px;
  left: -28px;
  bottom: -8%;
  transform: rotate(-8deg);
  animation: mh-float-computer 6s ease-in-out infinite;
}
.mh-hat {
  width: 58px;
  right: -26px;
  top: -26px;
  transform: rotate(9deg);
  animation: mh-float-hat 5.5s ease-in-out infinite;
}

/* Frame sparkles — 7 total */
.mh-frame-sparkle {
  position: absolute;
  z-index: 9;
  color: #fff;
  filter: drop-shadow(0 0 5px rgba(255,255,255,.7));
  animation: mh-sparkle 3s ease-in-out infinite;
  line-height: 1;
  user-select: none;
  pointer-events: none;
}
.mh-fs1 { top: 18%;  left: -10%;  font-size: 9px;  color: #fff;    filter: drop-shadow(0 0 5px rgba(255,255,255,.7)); }
.mh-fs2 { right: -8%; bottom: 22%; font-size: 10px; color: #c5a5ff; filter: drop-shadow(0 0 5px #c5a5ff); animation-delay: -1.4s; }
.mh-fs3 { left: 10%;  bottom: -8%; font-size: 8px;  color: #c5a5ff; filter: drop-shadow(0 0 5px #c5a5ff); animation-delay: -.8s; }
.mh-fs4 { top: 4%;   right: -6%;  font-size: 8px;  color: #fff;    filter: drop-shadow(0 0 5px rgba(255,255,255,.7)); animation-delay: -.4s; }
.mh-fs5 { bottom: 6%; left: 20%;  font-size: 9px;  color: #7e3ff2; filter: drop-shadow(0 0 6px #7e3ff2); animation-delay: -2.1s; }
.mh-fs6 { top: 42%;  right: -9%;  font-size: 8px;  color: #c5a5ff; filter: drop-shadow(0 0 5px #c5a5ff); animation-delay: -1.2s; }
.mh-fs7 { top: 62%;  left: -7%;   font-size: 9px;  color: #fff;    filter: drop-shadow(0 0 5px rgba(255,255,255,.7)); animation-delay: -.9s; }

/* ── Orbiting emojis around the portrait wrap ── */
.mh-orbit {
  position: absolute;
  z-index: 10;
  pointer-events: none;
  user-select: none;
  line-height: 1;
  filter: drop-shadow(0 0 8px rgba(126,63,242,.55));
}
.mh-o1  { top: -26px;  left: -16px;  font-size: 10px; color: #fff; filter: drop-shadow(0 0 5px rgba(255,255,255,.7)); animation: mh-orbit-1 4.2s ease-in-out infinite; }
.mh-o2  { top: -30px;  right: -10px; font-size: 10px; animation: mh-orbit-2 5.5s ease-in-out infinite .8s; }
.mh-o3  { top: 14%;    left: -46px;  font-size: 9px;  animation: mh-orbit-3 4.8s ease-in-out infinite 1.4s; }
.mh-o4  { top: 32%;    right: -42px; font-size: 9px;  animation: mh-orbit-1 6s ease-in-out infinite 2.1s; filter: drop-shadow(0 0 5px rgba(168,85,247,.6)); }
.mh-o5  { bottom: 30%; left: -40px;  font-size: 10px; animation: mh-orbit-2 5.2s ease-in-out infinite .4s; }
.mh-o6  { bottom: 20%; right: -38px; font-size: 9px;  animation: mh-orbit-3 4.5s ease-in-out infinite 3.0s; filter: drop-shadow(0 0 5px rgba(197,165,255,.8)); }
.mh-o7  { bottom: -24px; left: 16%;  font-size: 10px; animation: mh-orbit-1 6.5s ease-in-out infinite 1.8s; }
.mh-o8  { bottom: -26px; right: 12%; font-size:  9px; color: #fff; filter: drop-shadow(0 0 4px rgba(255,255,255,.7)); animation: mh-orbit-2 4.9s ease-in-out infinite 2.5s; }
.mh-o9  { top: 56%;    left: -46px;  font-size:  9px; color: #c5a5ff; filter: drop-shadow(0 0 4px rgba(197,165,255,.7)); animation: mh-orbit-3 5.8s ease-in-out infinite .9s; }
.mh-o10 { top: -20px;  left: 38%;   font-size:  9px; animation: mh-orbit-1 4.6s ease-in-out infinite 3.3s; }

/* ── Intro text ── */
.mh-intro {
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
}
.mh-terminal {
  margin: 0 0 7px;
  font-family: "Courier New", monospace;
  font-size: 9px;
  letter-spacing: .13em;
  text-transform: uppercase;
  color: #c5a5ff;
  opacity: .7;
  text-shadow: 0 0 8px rgba(197,165,255,.5);
}
.mh-intro h1 {
  margin: 0;
  max-width: 100%;
  font-size: clamp(37.4px, 10.67vw, 49.5px);
  line-height: .94;
  white-space: nowrap;
  font-weight: 800;
  letter-spacing: -.045em;
  color: #fff;
  text-shadow:
    0 0 20px rgba(126,63,242,.35),
    0 0 50px rgba(126,63,242,.15),
    0 0 80px rgba(126,63,242,.08);
}
.mh-role {
  max-width: 325px;
  margin: 30px auto 0;
  font-size: 13px;
  line-height: 1.6;
  color: rgba(216,198,255,.9);
}
.mh-role span { display: inline-block; margin: 0 5px; font-size: 9px; color: #c5a5ff; text-shadow: 0 0 6px rgba(197,165,255,.7); }

/* ── Hero social links (mobile) ── */
.mh-socials {
  display: flex;
  justify-content: center;
  gap: 13px;
  margin-top: 26px;
}
.mh-social {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  color: #e9d5ff;
  border: 1.5px solid rgba(167,139,250,.55);
  background:
    radial-gradient(circle at 30% 25%, rgba(255,255,255,.18), transparent 55%),
    linear-gradient(135deg, rgba(91,33,182,.6) 0%, rgba(124,58,237,.55) 45%, rgba(192,38,211,.5) 100%);
  box-shadow:
    0 0 14px rgba(139,92,246,.5),
    0 0 30px rgba(124,58,237,.25),
    inset 0 1px 0 rgba(255,255,255,.2);
  transition: transform .2s ease, box-shadow .2s ease, color .2s ease;
}
.mh-social:hover,
.mh-social:focus-visible {
  transform: translateY(-2px);
  color: #fff;
  box-shadow:
    0 0 20px rgba(168,85,247,.95),
    0 0 44px rgba(139,92,246,.55),
    inset 0 1px 0 rgba(255,255,255,.28);
}
.mh-social svg {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

/* ── Hero social links (desktop / laptop) ── */
.dh-socials {
  display: flex;
  justify-content: flex-start;
  gap: 14px;
  margin: 6px 0 18px;
}
.dh-social {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  color: #e9d5ff;
  border: 1.5px solid rgba(167,139,250,.55);
  background:
    radial-gradient(circle at 30% 25%, rgba(255,255,255,.18), transparent 55%),
    linear-gradient(135deg, rgba(91,33,182,.6) 0%, rgba(124,58,237,.55) 45%, rgba(192,38,211,.5) 100%);
  box-shadow:
    0 0 16px rgba(139,92,246,.5),
    0 0 34px rgba(124,58,237,.25),
    inset 0 1px 0 rgba(255,255,255,.2);
  transition: transform .2s ease, box-shadow .2s ease, color .2s ease;
}
.dh-social:hover,
.dh-social:focus-visible {
  transform: translateY(-3px);
  color: #fff;
  box-shadow:
    0 0 22px rgba(168,85,247,.95),
    0 0 48px rgba(139,92,246,.55),
    inset 0 1px 0 rgba(255,255,255,.28);
}
.dh-social svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

/* Light mode — softer look to match the pastel hero */
:root:not(.dark) .dh-social {
  color: #7c3aed;
  border-color: rgba(124,58,237,.35);
  background:
    radial-gradient(circle at 30% 25%, rgba(255,255,255,.7), transparent 60%),
    linear-gradient(135deg, rgba(233,213,255,.9) 0%, rgba(216,180,254,.85) 100%);
  box-shadow:
    0 4px 14px rgba(124,58,237,.18),
    inset 0 1px 0 rgba(255,255,255,.7);
}
:root:not(.dark) .dh-social:hover,
:root:not(.dark) .dh-social:focus-visible {
  color: #6d28d9;
  box-shadow:
    0 6px 20px rgba(124,58,237,.3),
    inset 0 1px 0 rgba(255,255,255,.8);
}
.mh-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  margin-top: 19px;
  padding: 0 22px;
  border: 1.5px solid rgba(167,139,250,.7);
  border-radius: 999px;
  background: linear-gradient(135deg, #5b21b6 0%, #7c3aed 30%, #9333ea 65%, #c026d3 100%);
  background-size: 200% 100%;
  color: #fff;
  font-size: 13px;
  font-weight: 650;
  text-decoration: none;
  box-shadow:
    0 0 18px rgba(139,92,246,.75),
    0 0 36px rgba(124,58,237,.5),
    0 0 60px rgba(168,85,247,.3),
    0 7px 25px rgba(88,28,135,.5),
    inset 0 1px 0 rgba(255,255,255,.2);
  animation: mh-btn-shimmer 2.4s ease-in-out infinite;
  transition: transform .2s, box-shadow .2s;
}
.mh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 28px rgba(168,85,247,.95), 0 0 55px rgba(139,92,246,.65), 0 12px 36px rgba(88,28,135,.6), inset 0 1px 0 rgba(255,255,255,.25);
}
@keyframes mh-btn-shimmer {
  0%, 100% { background-position: 0% 0%; box-shadow: 0 0 18px rgba(139,92,246,.75), 0 0 36px rgba(124,58,237,.5), 0 0 60px rgba(168,85,247,.3), 0 7px 25px rgba(88,28,135,.5), inset 0 1px 0 rgba(255,255,255,.2); }
  50%       { background-position: 100% 0%; box-shadow: 0 0 30px rgba(192,38,211,.9), 0 0 55px rgba(168,85,247,.7), 0 0 90px rgba(139,92,246,.4), 0 7px 30px rgba(88,28,135,.6), inset 0 1px 0 rgba(255,255,255,.28); }
}
.mh-btn-star { color: #c5a5ff; font-size: 11px; text-shadow: 0 0 6px rgba(197,165,255,.8); }

/* ── Tiny white dots — full section background ── */
.mh-dots-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
```

### 2c. Mobile hero decorative CSS continued (dots / stars / retro grid / keyframes)
```css
  z-index: 1;
  overflow: hidden;
}
.mh-dots-bg span {
  position: absolute;
  font-size: 5px;
  color: #fff;
  line-height: 1;
  user-select: none;
  filter: drop-shadow(0 0 2px rgba(255,255,255,.9));
  animation: mh-twinkle 3.5s ease-in-out infinite;
  opacity: 0;
}

/* ── Background stars — clipped to upper portion on mobile ── */
.mh-stars {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 48%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}
.mh-star {
  position: absolute;
  opacity: .6;
  font-size: 5px;
  color: #fff;
  filter: drop-shadow(0 0 3px rgba(255,255,255,.9));
  animation: mh-twinkle 3s ease-in-out infinite;
  user-select: none;
}
/* all stars clustered in the upper 32% — none in the grid zone */
.mh-s1  { top:  3%;  left:  4%;  font-size: 6px;  animation-delay:  0s; }
.mh-s2  { top:  7%;  left: 18%;  font-size: 4px;  animation-delay: -1.1s; }
.mh-s3  { top:  2%;  left: 32%;  font-size: 5px;  animation-delay: -0.4s; }
.mh-s4  { top:  9%;  left: 47%;  font-size: 4px;  animation-delay: -2.3s; }
.mh-s5  { top:  4%;  left: 61%;  font-size: 6px;  animation-delay: -0.8s; }
.mh-s6  { top:  8%;  left: 75%;  font-size: 5px;  animation-delay: -1.7s; }
.mh-s7  { top:  3%;  left: 89%;  font-size: 4px;  animation-delay: -3.0s; }
.mh-s8  { top: 15%;  left:  9%;  font-size: 5px;  animation-delay: -0.6s; }
.mh-s9  { top: 12%;  left: 24%;  font-size: 4px;  animation-delay: -2.8s; }
.mh-s10 { top: 18%;  left: 38%;  font-size: 6px;  animation-delay: -1.4s; }
.mh-s11 { top: 14%;  left: 53%;  font-size: 4px;  animation-delay: -0.2s; }
.mh-s12 { top: 20%;  left: 67%;  font-size: 5px;  animation-delay: -2.1s; }
.mh-s13 { top: 11%;  left: 81%;  font-size: 4px;  animation-delay: -0.9s; }
.mh-s14 { top: 16%;  left: 93%;  font-size: 6px;  animation-delay: -1.6s; }
.mh-s15 { top: 25%;  left:  2%;  font-size: 5px;  animation-delay: -3.2s; }
.mh-s16 { top: 22%;  left: 15%;  font-size: 4px;  animation-delay: -0.5s; }
.mh-s17 { top: 28%;  left: 30%;  font-size: 6px;  animation-delay: -1.9s; }
.mh-s18 { top: 24%;  left: 44%;  font-size: 4px;  animation-delay: -0.3s; }
.mh-s19 { top: 29%;  left: 58%;  font-size: 5px;  animation-delay: -2.6s; }
.mh-s20 { top: 23%;  left: 72%;  font-size: 4px;  animation-delay: -1.0s; }
.mh-s21 { top: 31%;  left: 85%;  font-size: 6px;  animation-delay: -0.7s; }
.mh-s22 { top: 27%;  left: 96%;  font-size: 4px;  animation-delay: -3.5s; }
.mh-s23 { top:  6%;  left: 50%;  font-size: 5px;  animation-delay: -1.3s; }
.mh-s24 { top: 19%;  left:  1%;  font-size: 4px;  animation-delay: -2.4s; }

/* ── Orb (navigation star) — larger ── */
.mh-orb {
  margin-top: 31px;
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  font-size: 20px;
  color: #fff3bf;
  background: radial-gradient(circle, rgba(255,237,151,.72) 0%, rgba(255,209,102,.22) 40%, transparent 70%);
  filter: drop-shadow(0 0 14px rgba(255,209,102,.55)) drop-shadow(0 0 28px rgba(255,209,102,.25));
  animation: mh-orb 4s ease-in-out infinite;
  position: relative;
  z-index: 5;
}
.mh-scroll {
  position: absolute;
  left: 50%;
  bottom: 17px;
  transform: translateX(-50%);
  z-index: 6;
  text-decoration: none;
  color: rgba(197,165,255,.65);
  font-size: 22px;
  animation: mh-arrow 2.6s ease-in-out infinite;
}

/* ── Retro grid scene (hero — both mobile and desktop) ── */
.hero-retro-scene {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.hero-retro-stars {
  position: absolute;
  inset: 0 0 45% 0;
  background-image:
    radial-gradient(1.5px 1.5px at 12% 22%, #fff, transparent),
    radial-gradient(1px   1px   at 28% 48%, #e9d5ff, transparent),
    radial-gradient(2px   2px   at 41% 14%, #fff, transparent),
    radial-gradient(1px   1px   at 58% 36%, #ddd6fe, transparent),
    radial-gradient(1.5px 1.5px at 71% 18%, #fff, transparent),
    radial-gradient(1px   1px   at 83% 52%, #ddd6fe, transparent),
    radial-gradient(2px   2px   at 91% 28%, #fff, transparent),
    radial-gradient(1px   1px   at  6% 60%, #fff, transparent),
    radial-gradient(1.5px 1.5px at 35% 68%, #e9d5ff, transparent),
    radial-gradient(1px   1px   at 64% 72%, #fff, transparent),
    radial-gradient(1px   1px   at 19%  8%, #fff, transparent),
    radial-gradient(1.5px 1.5px at 77% 62%, #fff, transparent);
  z-index: 1;
  animation: retro-twinkle 4s ease-in-out infinite;
}
.hero-retro-horizon {
  position: absolute;
  left: 0; right: 0;
  bottom: 42%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #a855f7 15%, #d8b4fe 50%, #a855f7 85%, transparent);
  box-shadow: 0 0 24px 6px rgba(168,85,247,.75), 0 0 60px 14px rgba(147,51,234,.45);
  z-index: 3;
}
.hero-retro-grid-wrap {
  position: absolute;
  left: -60%; right: -60%;
  bottom: 0;
  height: 44%;
  perspective: 200px;
  perspective-origin: 50% 0%;
  z-index: 2;
}
.hero-retro-grid {
  position: absolute;
  inset: 0;
  transform: rotateX(72deg);
  transform-origin: 50% 0%;
  background-image:
    repeating-linear-gradient(90deg, rgba(168,85,247,.45) 0px, rgba(168,85,247,.45) 5px, transparent 5px, transparent 88px),
    repeating-linear-gradient(0deg,  rgba(147,51,234,.38) 0px, rgba(147,51,234,.38) 4px, transparent 4px, transparent 70px);
  filter: drop-shadow(0 0 5px rgba(168,85,247,.4)) drop-shadow(0 0 14px rgba(126,34,206,.25));
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 22%, #000 100%);
  mask-image: linear-gradient(to bottom, transparent 0%, #000 22%, #000 100%);
  animation: hero-grid-roll 2.6s linear infinite;
}
.hero-retro-lane {
  position: absolute;
  left: 50%; bottom: 0;
  width: 6px;
  height: 44%;
  transform: translateX(-50%);
  background: linear-gradient(to top, #f3e8ff, #c084fc 40%, transparent 100%);
  box-shadow: 0 0 18px 4px rgba(216,180,254,.7), 0 0 46px 12px rgba(168,85,247,.45);
  -webkit-mask-image: linear-gradient(to top, #000 0%, transparent 92%);
  mask-image: linear-gradient(to top, #000 0%, transparent 92%);
  z-index: 4;
}
@keyframes hero-grid-roll {
  from { background-position: 0 0, 0 0; }
  to   { background-position: 0 0, 0 70px; }
}

/* ── Mobile-only retro grid overrides ── */
@media (max-width: 767px) {
  .hero-retro-grid {
    background-image:
      repeating-linear-gradient(90deg, rgba(168,85,247,.42) 0px, rgba(168,85,247,.42) 1px, transparent 1px, transparent 22px),
      repeating-linear-gradient(0deg,  rgba(147,51,234,.35) 0px, rgba(147,51,234,.35) 3px, transparent 3px, transparent 70px);
    filter: none;
  }
  .hero-retro-horizon {
    bottom: calc(11% + 15px);
    box-shadow:
      0 0 40px 10px rgba(168,85,247,.95),
      0 0 90px 24px rgba(147,51,234,.7),
      0 0 160px 40px rgba(126,34,206,.45);
  }
  .hero-retro-grid-wrap { height: 11%; bottom: 15px; }
  .hero-retro-stars     { inset: 0 0 calc(11% + 15px) 0; }
  .hero-retro-lane      { height: 11%; bottom: 15px; }
}
@keyframes retro-twinkle {
  0%, 100% { opacity: .75; }
  50%       { opacity: 1; }
}

/* ── Mobile Hero keyframes ── */
@keyframes mh-float-computer { 50% { transform: translateY(-7px) rotate(-5deg); } }
@keyframes mh-float-hat       { 50% { transform: translateY(-6px) rotate(12deg); } }
@keyframes mh-sparkle {
  0%, 100% { opacity: .2;  transform: scale(.75); }
  50%       { opacity: 1;  transform: scale(1.2); }
}
@keyframes mh-twinkle {
  0%, 100% { opacity: .15; transform: scale(.8); }
  50%       { opacity: .75; transform: scale(1.18); }
}
@keyframes mh-orb {
  0%, 100% { transform: scale(.9);  opacity: .7; }
  50%       { transform: scale(1.15); opacity: 1; }
}
@keyframes mh-arrow { 50% { transform: translate(-50%, 6px); } }
@keyframes mh-neon-pulse {
  0%, 100% {
    box-shadow:
      0 0 0 2px rgba(200,60,255,.35),
      0 0 12px rgba(220,80,255,.8),
      0 0 28px rgba(200,60,255,.7),
      0 0 55px rgba(180,40,240,.5),
      0 0 90px rgba(160,20,220,.3),
      0 0 140px rgba(140,0,200,.15),
      0 20px 50px rgba(0,0,0,.6),
      inset 0 0 18px rgba(200,80,255,.15);
    border-color: rgba(230,100,255,.95);
  }
  50% {
    box-shadow:
      0 0 0 2px rgba(255,120,255,.5),
      0 0 18px rgba(255,100,255,.95),
      0 0 40px rgba(220,60,255,.85),
      0 0 75px rgba(200,40,255,.6),
      0 0 120px rgba(180,20,240,.38),
      0 0 180px rgba(160,0,220,.2),
      0 20px 50px rgba(0,0,0,.6),
      inset 0 0 28px rgba(220,80,255,.2);
    border-color: rgba(255,160,255,1);
  }
}
@keyframes mh-card-float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-14px); }
}
@keyframes mh-title-flicker {
  0%, 91%, 93%, 95%, 100% { opacity: 1; text-shadow: 0 0 8px rgba(197,165,255,.7), 0 0 18px rgba(126,63,242,.4); }
  92%, 94% { opacity: .35; text-shadow: none; }
}
@keyframes mh-scan-sweep {
  0%   { top: -4px;  opacity: 0; }
  3%   { opacity: 1; }
  97%  { opacity: .6; }
  100% { top: 100%;  opacity: 0; }
}
@keyframes mh-orbit-1 {
  0%, 100% { transform: translateY(0px)   rotate(0deg)   scale(1);    opacity: .6; }
  25%       { transform: translateY(-11px) rotate(22deg)  scale(1.14); opacity: .95; }
  50%       { transform: translateY(-6px)  rotate(-4deg)  scale(1.06); opacity: .78; }
  75%       { transform: translateY(-13px) rotate(16deg)  scale(1.09); opacity: .88; }
}
@keyframes mh-orbit-2 {
  0%, 100% { transform: translateY(0px)   rotate(0deg)   scale(1);    opacity: .55; }
  30%       { transform: translateY(-15px) rotate(-28deg) scale(1.12); opacity: .95; }
  60%       { transform: translateY(-8px)  rotate(12deg)  scale(1.04); opacity: .72; }
  80%       { transform: translateY(-11px) rotate(-14deg) scale(1.07); opacity: .82; }
}
@keyframes mh-orbit-3 {
  0%, 100% { transform: translateY(0px)  rotate(45deg)  scale(.9);  opacity: .5; }
  35%       { transform: translateY(-9px) rotate(68deg)  scale(1.17); opacity: .98; }
  65%       { transform: translateY(-13px) rotate(32deg) scale(1.0); opacity: .76; }
  90%       { transform: translateY(-5px)  rotate(58deg) scale(.95); opacity: .65; }
}

```

---

## 3. Desktop / laptop hero — social icons just added

JSX inserted in `Home()` right under the `<h1>` title wrapper, before the `<h2>`:
```tsx
            <div className="dh-socials">
              <a
                className="dh-social"
                href="https://github.com/nourah-alotaibi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github />
              </a>
              <a
                className="dh-social"
                href="https://www.linkedin.com/in/nourah-fahad-alotaibi-14b121226/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin />
              </a>
              <a
                className="dh-social"
                href="mailto:noooriii760@gmail.com"
                aria-label="Email"
              >
                <Mail />
              </a>
            </div>
            <h2 className={`text-[0.6rem] sm:text-xl md:text-2xl font-medium mb-1 md:mb-5 ${isDark ? "text-[#c4b5fd]" : "text-purple-600"}`}>
              Computer Engineer | AI Developer
            </h2>
            <p className={`text-[0.55rem] leading-4 mb-2 md:text-base md:leading-7 md:mb-8 ${isDark ? "text-[rgba(203,213,225,0.8)]" : "text-gray-600"}`}>
              Explore the journey that made me who I am.
            </p>
            <a href="#journey" className="premium-btn inline-flex items-center gap-1 md:gap-2 px-2.5 py-1 md:px-6 md:py-3 rounded-full font-semibold text-[0.55rem] md:text-sm text-white">
              <Sparkles className="w-2.5 h-2.5 md:w-4 md:h-4" />
```

CSS (`.dh-*`, in `client/src/index.css`):
```css
/* ── Hero social links (desktop / laptop) ── */
.dh-socials {
  display: flex;
  justify-content: flex-start;
  gap: 14px;
  margin: 6px 0 18px;
}
.dh-social {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  color: #e9d5ff;
  border: 1.5px solid rgba(167,139,250,.55);
  background:
    radial-gradient(circle at 30% 25%, rgba(255,255,255,.18), transparent 55%),
    linear-gradient(135deg, rgba(91,33,182,.6) 0%, rgba(124,58,237,.55) 45%, rgba(192,38,211,.5) 100%);
  box-shadow:
    0 0 16px rgba(139,92,246,.5),
    0 0 34px rgba(124,58,237,.25),
    inset 0 1px 0 rgba(255,255,255,.2);
  transition: transform .2s ease, box-shadow .2s ease, color .2s ease;
}
.dh-social:hover,
.dh-social:focus-visible {
  transform: translateY(-3px);
  color: #fff;
  box-shadow:
    0 0 22px rgba(168,85,247,.95),
    0 0 48px rgba(139,92,246,.55),
    inset 0 1px 0 rgba(255,255,255,.28);
}
.dh-social svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

/* Light mode — softer look to match the pastel hero */
:root:not(.dark) .dh-social {
  color: #7c3aed;
  border-color: rgba(124,58,237,.35);
  background:
    radial-gradient(circle at 30% 25%, rgba(255,255,255,.7), transparent 60%),
    linear-gradient(135deg, rgba(233,213,255,.9) 0%, rgba(216,180,254,.85) 100%);
  box-shadow:
    0 4px 14px rgba(124,58,237,.18),
    inset 0 1px 0 rgba(255,255,255,.7);
}
:root:not(.dark) .dh-social:hover,
:root:not(.dark) .dh-social:focus-visible {
  color: #6d28d9;
  box-shadow:
    0 6px 20px rgba(124,58,237,.3),
    inset 0 1px 0 rgba(255,255,255,.8);
}
```
