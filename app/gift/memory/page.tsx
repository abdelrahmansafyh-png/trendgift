"use client";
import { useEffect, useState } from "react";

const DATA = {
  title: "لحظة لا تُنسى",
  caption: "رحلة الشمال — نوفمبر ٢٠٢٤ 📍",
  from: "أحمد",
  msg: "كل مرة أشوف هذه الصورة، بتضحك. ذكرياتنا أجمل شيء عندي.",
  photo: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80",
  videoUrl: "", // ← رابط فيديو Canva اختياري
};

export default function MemoryPage() {
  const [vis, setVis] = useState(false);
  const [audioPlay, setAudioPlay] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 100); }, []);

  return (
    <main className="mem2-page" dir="rtl">
      <div className="mem2-photo-bg" style={{ backgroundImage: `url(${DATA.photo})` }} />
      <div className="mem2-gradient" />

      <div className={`mem2-card ${vis ? "mem2-in" : ""}`}>

        <div className="mem2-top-meta">
          <span className="mem2-from-badge">من: {DATA.from}</span>
          <span className="mem2-caption">{DATA.caption}</span>
        </div>

        <h1 className="mem2-title">{DATA.title}</h1>

        <div className="mem2-photo-frame">
          <img src={DATA.photo} alt="" className="mem2-photo" />
          <div className="mem2-photo-vignette" />
        </div>

        <blockquote className="mem2-quote">
          <span className="mem2-qmark">"</span>{DATA.msg}<span className="mem2-qmark">"</span>
        </blockquote>

        {DATA.videoUrl ? (
          <div className="mem2-video-wrap">
            <video src={DATA.videoUrl} controls playsInline className="mem2-video" />
          </div>
        ) : (
          <button
            className={`mem2-audio-btn ${audioPlay ? "mem2-playing" : ""}`}
            onClick={() => setAudioPlay(p => !p)}
          >
            <span className="mem2-audio-icon">{audioPlay ? "⏸" : "▶"}</span>
            <span>{audioPlay ? "يشتغل الرسالة الصوتية..." : "استمع للرسالة"}</span>
            {audioPlay && (
              <span className="mem2-waves">
                {[1,2,3,4,5].map(i => <span key={i} style={{ animationDelay: `${i * 0.1}s` }} />)}
              </span>
            )}
          </button>
        )}

        <p className="mem2-brand">TREND · هدية ذكريات</p>
      </div>
    </main>
  );
}
