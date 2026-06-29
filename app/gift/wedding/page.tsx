"use client";
import { useEffect, useRef, useState } from "react";

const W = {
  groom: "محمد", bride: "سارة",
  date: "السبت ١٤ سبتمبر ٢٠٢٦", time: "٧:٠٠ مساءً",
  venue: "قاعة الماسة — الدوحة",
  mapUrl: "https://maps.google.com/?q=Doha",
  verse: "وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
  // ← ضع رابط فيديو Canva هنا
  videoUrl: "",
  targetDate: new Date("2026-09-14T19:00:00").getTime(),
};

function useCountdown(t: number) {
  const [n, setN] = useState(Date.now());
  useEffect(() => { const id = setInterval(() => setN(Date.now()), 1000); return () => clearInterval(id); }, []);
  const d = Math.max(0, t - n);
  return { d: Math.floor(d / 86400000), h: Math.floor((d / 3600000) % 24), m: Math.floor((d / 60000) % 60), s: Math.floor((d / 1000) % 60) };
}

function Petals() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    let W = c.width = innerWidth, H = c.height = innerHeight;
    window.addEventListener("resize", () => { W = c.width = innerWidth; H = c.height = innerHeight; });
    const ps = Array.from({ length: 35 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 3 + Math.random() * 8, vx: (Math.random() - .5) * .8, vy: .5 + Math.random() * 1.2,
      a: Math.random() * Math.PI * 2, va: (Math.random() - .5) * .03,
      w: Math.random() * Math.PI * 2, ws: .02 + Math.random() * .02,
      c: `hsla(${340 + Math.random() * 30},${70 + Math.random() * 20}%,${75 + Math.random() * 15}%,${.3 + Math.random() * .4})`,
    }));
    let raf: number;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      ps.forEach(p => {
        p.w += p.ws; p.x += p.vx + Math.sin(p.w) * .5; p.y += p.vy; p.a += p.va;
        if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
        ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * 1.7, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.c; ctx.fill(); ctx.restore();
      });
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none" }} />;
}

export default function WeddingPage() {
  const [phase, setPhase] = useState<"video" | "card">(W.videoUrl ? "video" : "card");
  const [cardVis, setCardVis] = useState(false);
  const { d, h, m, s } = useCountdown(W.targetDate);
  const gI = W.groom.charAt(0), bI = W.bride.charAt(0);

  const showCard = () => {
    setPhase("card");
    setTimeout(() => setCardVis(true), 80);
  };

  useEffect(() => { if (phase === "card") setTimeout(() => setCardVis(true), 80); }, [phase]);

  return (
    <main className="wc-root" dir="rtl">
      {/* bg */}
      <div className="wc-bg" />
      <div className="wc-bg-noise" />
      <Petals />

      {/* ── VIDEO PHASE ── */}
      {phase === "video" && W.videoUrl && (
        <div className="wc-video-phase">
          <video
            className="wc-video"
            src={W.videoUrl}
            autoPlay
            playsInline
            onEnded={showCard}
          />
          <button className="wc-skip-btn" onClick={showCard}>تخطي ←</button>
        </div>
      )}

      {/* ── CARD PHASE ── */}
      {phase === "card" && (
        <div className={`wc-card-wrap ${cardVis ? "wc-card-in" : ""}`}>

          {/* section 1 — hero */}
          <section className="wc-section wc-hero">
            <p className="wc-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>

            <div className="wc-monogram">
              <div className="wc-ring wc-r1" /><div className="wc-ring wc-r2" /><div className="wc-ring wc-r3" />
              <div className="wc-mono-inner">
                <span className="wc-initial">{gI}</span>
                <span className="wc-heart-icon">♥</span>
                <span className="wc-initial">{bI}</span>
              </div>
            </div>

            <h1 className="wc-names">
              <span>{W.groom}</span>
              <span className="wc-amp">&amp;</span>
              <span>{W.bride}</span>
            </h1>

            <p className="wc-verse">﴿ {W.verse} ﴾</p>
            <p className="wc-verse-ref">— سورة الروم: ٢١ —</p>

            <div className="wc-scroll-hint">
              <span className="wc-scroll-arrow">↓</span>
              <span>اسحب للأسفل</span>
            </div>
          </section>

          {/* section 2 — details */}
          <section className="wc-section wc-details">
            <p className="wc-section-label">تفاصيل الحفل</p>
            <div className="wc-detail-list">
              {[
                { icon: "📅", label: "التاريخ", val: W.date },
                { icon: "🕖", label: "التوقيت", val: W.time },
                { icon: "📍", label: "المكان",  val: W.venue },
              ].map(r => (
                <div className="wc-detail-item" key={r.label}>
                  <div className="wc-detail-ico">{r.icon}</div>
                  <div><p className="wc-detail-lbl">{r.label}</p><p className="wc-detail-val">{r.val}</p></div>
                </div>
              ))}
            </div>
          </section>

          {/* section 3 — countdown */}
          <section className="wc-section wc-cd-section">
            <p className="wc-section-label">يتبقى على الحفل</p>
            <div className="wc-cd">
              {[{v:d,l:"يوم"},{v:h,l:"ساعة"},{v:m,l:"دقيقة"},{v:s,l:"ثانية"}].map(({v,l})=>(
                <div className="wc-cd-box" key={l}>
                  <span className="wc-cd-num">{String(v).padStart(2,"0")}</span>
                  <span className="wc-cd-lbl">{l}</span>
                </div>
              ))}
            </div>
          </section>

          {/* section 4 — cta */}
          <section className="wc-section wc-cta-section">
            <a href={W.mapUrl} target="_blank" rel="noreferrer" className="wc-map-btn">
              <span>📍</span> الطريق إلى قاعة الحفل
            </a>
            <p className="wc-closing">حضوركم يُكمل فرحتنا ❤</p>
            <p className="wc-brand">TREND · دعوة زفاف رقمية</p>
          </section>

        </div>
      )}
    </main>
  );
}
