"use client";
import { useEffect, useState } from "react";

const DATA = {
  song: "Perfect", artist: "Ed Sheeran",
  from: "محمد", to: "سارة",
  msg: "هذي أغنيتنا — كل مرة أسمعها بتذكرك 🎵",
  cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
  spotifyUrl: "https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v",
  videoUrl: "", // ← رابط فيديو Canva اختياري
};

function FloatNotes() {
  return (
    <div className="sp2-notes" aria-hidden>
      {["♪","♫","♩","♬","♪","♫","♩"].map((n,i)=>(
        <span key={i} className="sp2-note" style={{
          left:`${8+i*13}%`,
          animationDelay:`${i*.7}s`,
          animationDuration:`${5+i*.6}s`,
          fontSize:`${14+Math.floor(Math.random()*16)}px`,
        }}>{n}</span>
      ))}
    </div>
  );
}

export default function SpotifyPage() {
  const [vis, setVis] = useState(false);
  const [prog, setProg] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => { setTimeout(() => setVis(true), 100); }, []);
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setProg(p => { if (p >= 100) { setPlaying(false); return 0; } return p + .25; }), 100);
    return () => clearInterval(t);
  }, [playing]);

  const fmt = (pct: number) => { const t = Math.floor(243 * pct / 100); return `${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`; };

  return (
    <main className="sp2-page" dir="rtl">
      <div className="sp2-bg" style={{ backgroundImage: `url(${DATA.cover})` }} />
      <div className="sp2-blur" />
      {playing && <FloatNotes />}

      <div className={`sp2-card ${vis ? "sp2-in" : ""}`}>

        {/* album */}
        <div className={`sp2-album-wrap ${playing ? "sp2-spin" : ""}`}>
          <img src={DATA.cover} alt="" className="sp2-album" />
          <div className="sp2-album-center" />
        </div>

        {/* dedication */}
        <div className="sp2-ded">
          <span>{DATA.from}</span>
          <span className="sp2-ded-arrow">→</span>
          <span>{DATA.to}</span>
        </div>

        {/* song info */}
        <div className="sp2-info">
          <h1 className="sp2-song">{DATA.song}</h1>
          <p className="sp2-artist">{DATA.artist}</p>
        </div>

        <p className="sp2-msg">"{DATA.msg}"</p>

        {/* player */}
        <div className="sp2-player">
          <div
            className="sp2-bar-wrap"
            onClick={e => {
              const r = e.currentTarget.getBoundingClientRect();
              setProg(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
            }}
          >
            <div className="sp2-bar-bg" />
            <div className="sp2-bar-fill" style={{ width: `${prog}%` }} />
            <div className="sp2-bar-dot" style={{ left: `${prog}%` }} />
          </div>
          <div className="sp2-times"><span>{fmt(prog)}</span><span>4:03</span></div>
          <div className="sp2-controls">
            <button className="sp2-ctrl" onClick={() => setProg(0)}>⏮</button>
            <button className="sp2-play" onClick={() => setPlaying(p => !p)}>
              {playing
                ? <span className="sp2-pause-icon">⏸</span>
                : <span>▶</span>
              }
            </button>
            <button className="sp2-ctrl">⏭</button>
          </div>
        </div>

        {DATA.videoUrl && (
          <div className="sp2-video-wrap">
            <video src={DATA.videoUrl} controls playsInline className="sp2-video" />
          </div>
        )}

        <a href={DATA.spotifyUrl} target="_blank" rel="noreferrer" className="sp2-open">
          <span className="sp2-green-dot">●</span> افتح على Spotify
        </a>

        <p className="sp2-brand">TREND · هدية أغنية</p>
      </div>
    </main>
  );
}
