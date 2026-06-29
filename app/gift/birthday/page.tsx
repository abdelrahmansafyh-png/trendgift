"use client";
import { useEffect, useRef, useState } from "react";

/* ─── CONFIG — عدّل هنا ─────────────────────────── */
const D = {
  name: "محمد",
  subtitle: "أنت النور الذي يضوي أيامنا ♥",
  heroImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
  videoUrl: "", // رابط فيديو الرسالة
  photos: [
    "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80",
    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80",
  ],
  song: "Perfect", artist: "Ed Sheeran",
  songCover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&q=80",
  spotifyUrl: "https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v",
  message: "أنت أجمل هدية بالحياة.\nوجودك يجعل كل يوم أجمل من السابق\nشكراً لأنك دائماً في حياتنا",
  firstMeetDate: new Date("2019-06-15").getTime(),
  surpriseMsg: "🎁 رسالة سرية خاصة بك — فقط لك أنت!",
  from: "بكل الحب",
};
/* ────────────────────────────────────────────────── */

function useCountUp(from: number) {
  const [n, setN] = useState(Date.now());
  useEffect(() => { const id = setInterval(() => setN(Date.now()), 1000); return () => clearInterval(id); }, []);
  const diff = Math.max(0, n - from);
  return { d: Math.floor(diff / 86400000), h: Math.floor((diff / 3600000) % 24), m: Math.floor((diff / 60000) % 60), s: Math.floor((diff / 1000) % 60) };
}

function Section({ num, icon, title, sub, children }: { num: number; icon: string; title: string; sub?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: .12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`bd3-section ${vis ? "bd3-vis" : ""}`}>
      <div className="bd3-sec-head">
        <div className="bd3-num">{num}</div>
        <div>
          <div className="bd3-sec-title-row">
            <span className="bd3-sec-title">{title}</span>
            <span className="bd3-sec-icon">{icon}</span>
          </div>
          {sub && <p className="bd3-sec-sub">{sub}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

/* ─── PhotoCarousel ─── */
function PhotoCarousel() {
  const [idx, setIdx] = useState(0);
  return (
    <div className="bd3-carousel">
      <div className="bd3-carousel-track" style={{ transform: `translateX(${idx * -33.33}%)` }}>
        {D.photos.map((p, i) => (
          <div key={i} className="bd3-carousel-item">
            <img src={p} alt="" />
          </div>
        ))}
      </div>
      <button className="bd3-carr-btn bd3-prev" onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}>‹</button>
      <button className="bd3-carr-btn bd3-next" onClick={() => setIdx(i => Math.min(D.photos.length - 2, i + 1))} disabled={idx >= D.photos.length - 2}>›</button>
      <div className="bd3-dots">
        {D.photos.map((_, i) => <button key={i} className={`bd3-dot ${i === idx ? "on" : ""}`} onClick={() => setIdx(i)} />)}
      </div>
    </div>
  );
}

/* ─── AudioPlayer mock ─── */
function AudioPlayer() {
  const [playing, setPlaying] = useState(false);
  const [prog, setProg] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setProg(p => { if (p >= 100) { setPlaying(false); return 0; } return p + .14; }), 100);
    return () => clearInterval(t);
  }, [playing]);
  const fmt = (pct: number) => { const s = Math.floor(85 * pct / 100); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
  return (
    <div className="bd3-audio">
      <button className="bd3-audio-play" onClick={() => setPlaying(p => !p)}>
        {playing ? "⏸" : "▶"}
      </button>
      <div className="bd3-audio-track">
        <div className="bd3-audio-waves">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className={`bd3-wave-bar ${playing ? "bd3-wave-on" : ""}`}
              style={{ height: `${20 + Math.abs(Math.sin(i * .8)) * 28}px`, animationDelay: `${(i * .06) % .8}s` }} />
          ))}
        </div>
        <div className="bd3-audio-prog" style={{ width: `${prog}%` }} />
      </div>
      <span className="bd3-audio-time">01:25</span>
    </div>
  );
}

/* ─── Spotify Player ─── */
function SpotifyPlayer() {
  const [prog, setProg] = useState(27);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setProg(p => { if (p >= 100) { setPlaying(false); return 0; } return p + .18; }), 100);
    return () => clearInterval(t);
  }, [playing]);
  const fmt = (pct: number) => { const s = Math.floor(263 * pct / 100); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
  return (
    <div className="bd3-spotify">
      <img src={D.songCover} alt="" className="bd3-spotify-cover" />
      <div className="bd3-spotify-info">
        <p className="bd3-spotify-song">{D.song}</p>
        <p className="bd3-spotify-artist">{D.artist}</p>
        <div className="bd3-spotify-bar-wrap" onClick={e => {
          const r = e.currentTarget.getBoundingClientRect();
          setProg(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
        }}>
          <div className="bd3-spotify-bar-bg" />
          <div className="bd3-spotify-bar-fill" style={{ width: `${prog}%` }} />
        </div>
        <div className="bd3-spotify-times"><span>{fmt(prog)}</span><span>4:23</span></div>
        <div className="bd3-spotify-controls">
          <button className="bd3-sp-ctrl">⇄</button>
          <button className="bd3-sp-ctrl" onClick={() => setProg(0)}>⏮</button>
          <button className="bd3-sp-main" onClick={() => setPlaying(p => !p)}>{playing ? "⏸" : "▶"}</button>
          <button className="bd3-sp-ctrl">⏭</button>
          <button className="bd3-sp-ctrl">↺</button>
        </div>
      </div>
      <a href={D.spotifyUrl} target="_blank" rel="noreferrer" className="bd3-spotify-logo">●</a>
    </div>
  );
}

/* ─── Surprise box ─── */
function SurpriseBox() {
  const [open, setOpen] = useState(false);
  return (
    <div className="bd3-surprise">
      {open ? (
        <div className="bd3-surprise-msg">{D.surpriseMsg}</div>
      ) : (
        <div className="bd3-surprise-closed">
          <div className="bd3-surprise-gift">🎁</div>
          <button className="bd3-surprise-btn" onClick={() => setOpen(true)}>
            <span>✕</span> افتح المفاجأة
          </button>
        </div>
      )}
    </div>
  );
}

export default function BirthdayPage() {
  const { d, h, m, s } = useCountUp(D.firstMeetDate);
  const [heroVid, setHeroVid] = useState(false);

  return (
    <main className="bd3-page" dir="rtl">
      {/* ── HERO ── */}
      <div className="bd3-hero">
        <img src={D.heroImg} alt="" className="bd3-hero-img" />
        <div className="bd3-hero-overlay" />
        <div className="bd3-hero-content">
          <div className="bd3-hero-icon">🎂</div>
          <h1 className="bd3-hero-title">عيد ميلاد سعيد</h1>
          <h2 className="bd3-hero-name">يا {D.name}</h2>
          <p className="bd3-hero-sub">{D.subtitle}</p>
          <button className="bd3-hero-btn" onClick={() => setHeroVid(true)}>
            <span className="bd3-play-icon">▶</span> تشغيل رسالة الفيديو
          </button>
        </div>
        <button className="bd3-hero-scroll" onClick={() => document.getElementById("bd3-content")?.scrollIntoView({ behavior: "smooth" })}>
          <span>↓</span>
        </button>
        {/* navbar */}
        <div className="bd3-nav">
          <button className="bd3-nav-share">مشاركة ↗</button>
          <span className="bd3-nav-brand">.Trend</span>
        </div>
      </div>

      {/* ── VIDEO MODAL ── */}
      {heroVid && (
        <div className="bd3-modal" onClick={() => setHeroVid(false)}>
          <div className="bd3-modal-inner" onClick={e => e.stopPropagation()}>
            {D.videoUrl
              ? <video src={D.videoUrl} controls autoPlay playsInline className="bd3-modal-video" />
              : <div className="bd3-modal-placeholder"><span>🎬</span><p>ستظهر رسالة الفيديو هنا</p></div>
            }
            <button className="bd3-modal-close" onClick={() => setHeroVid(false)}>✕</button>
          </div>
        </div>
      )}

      {/* ── SECTIONS ── */}
      <div id="bd3-content" className="bd3-content">

        {/* 1 — video message */}
        <Section num={1} icon="♡" title="رسالة فيديو" sub="رسالة خاصة من شخص مميز إلى شخص مميز">
          <div className="bd3-video-block">
            <div className="bd3-video-thumb" onClick={() => setHeroVid(true)}>
              <img src={D.heroImg} alt="" />
              <div className="bd3-video-play-overlay">
                <div className="bd3-video-play-btn">▶</div>
              </div>
              <span className="bd3-video-duration">02:18</span>
            </div>
            <button className="bd3-video-cta" onClick={() => setHeroVid(true)}>
              <span>▶</span> تشغيل الفيديو
            </button>
          </div>
        </Section>

        {/* 2 & 3 — photos + audio */}
        <div className="bd3-row-2">
          <Section num={2} icon="🖼" title="ذكرياتنا" sub="لحظات جميلة لا تُنسى">
            <PhotoCarousel />
          </Section>
          <Section num={3} icon="🎙" title="رسالة صوتية" sub="استمع إلى رسالة صوتية خاصة">
            <AudioPlayer />
          </Section>
        </div>

        {/* 4 & 5 — song + message */}
        <div className="bd3-row-2">
          <Section num={4} icon="🎵" title="أغنية لأجلك" sub="أغنية خاصة تعبر عن مشاعرنا">
            <SpotifyPlayer />
          </Section>
          <Section num={5} icon="♡" title="رسالة خاصة" sub="كلمات من القلب">
            <div className="bd3-msg-card">
              {D.message.split("\n").map((l, i) => <p key={i}>{l}</p>)}
              <span className="bd3-msg-heart">♥</span>
            </div>
          </Section>
        </div>

        {/* 6 & 7 — counter + surprise */}
        <div className="bd3-row-2">
          <Section num={6} icon="📅" title="منذ أول لقاء" sub="لحظات لا تُقدر بثمن">
            <div className="bd3-counter">
              {[{v:d,l:"يوم"},{v:h,l:"ساعة"},{v:m,l:"دقيقة"},{v:s,l:"ثانية"}].map(({v,l})=>(
                <div key={l} className="bd3-counter-box">
                  <span className="bd3-counter-num">{v}</span>
                  <span className="bd3-counter-lbl">{l}</span>
                </div>
              ))}
            </div>
            <span className="bd3-counter-heart">♥</span>
          </Section>
          <Section num={7} icon="🎁" title="مفاجأة خاصة" sub="اضغط لفتح مفاجأتك">
            <SurpriseBox />
          </Section>
        </div>

        {/* footer */}
        <div className="bd3-footer">
          <div className="bd3-footer-balloons" aria-hidden>🎈 🎀 🎈</div>
          <p className="bd3-footer-msg">شكراً لأنك جزء من هذه الرحلة الجميلة</p>
          <p className="bd3-footer-sub">— كل عام وأنت بخير —</p>
          <div className="bd3-footer-bar">
            <button className="bd3-footer-action">مشاركة الهدية ↗</button>
            <span className="bd3-footer-brand">.Trend<br /><small>هدية مقدمة من القلب</small></span>
            <button className="bd3-footer-action">حفظ الذكرى 🔖</button>
          </div>
        </div>

      </div>
    </main>
  );
}
