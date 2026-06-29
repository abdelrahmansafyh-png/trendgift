"use client";

import { useState } from "react";
import type { StoryPage, StoryScreen } from "@/lib/story/types";

function hexToRgba(hex: string | undefined, opacity: number) {
  const value = (hex || "#ffffff").replace("#", "");
  const full = value.length === 3 ? value.split("").map((c) => c + c).join("") : value;
  const num = parseInt(full || "ffffff", 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function Media({ screen }: { screen: StoryScreen }) {
  if (screen.mediaType === "image" && screen.mediaUrl) {
    return <img className="story-media-img" src={screen.mediaUrl} alt="" />;
  }

  if (screen.mediaType === "video") {
    return screen.mediaUrl ? (
      <video className="story-media-video" src={screen.mediaUrl} controls playsInline />
    ) : (
      <div className="story-video-placeholder">ارفع فيديو من لوحة التحكم</div>
    );
  }

  if (screen.mediaType === "audio" && screen.mediaUrl) {
    return <audio className="story-audio" src={screen.mediaUrl} controls />;
  }

  if (screen.mediaType === "gallery") {
    return (
      <div className="story-gallery">
        {(screen.gallery || []).filter(Boolean).map((src, i) => (
          <img key={`${src}-${i}`} src={src} alt="" />
        ))}
      </div>
    );
  }

  return null;
}

export default function StoryRenderer({ story, preview = false }: { story: StoryPage; preview?: boolean }) {
  const [index, setIndex] = useState(0);
  const screen = story.screens[index] || story.screens[0];

  if (!screen) return null;

  const goAction = () => {
    if (screen.buttonAction === "next") setIndex((i) => Math.min(i + 1, story.screens.length - 1));
    if (screen.buttonAction === "prev") setIndex((i) => Math.max(i - 1, 0));
    if (screen.buttonAction === "link" && screen.buttonUrl) window.open(screen.buttonUrl, "_blank");
    if (screen.buttonAction === "whatsapp") window.open(`https://wa.me/${screen.buttonUrl || "97400000000"}`, "_blank");
  };

  const bgStyle: React.CSSProperties = {
    backgroundColor: screen.backgroundColor,
    color: screen.textColor,
  };

  if (screen.backgroundType === "image" && screen.backgroundUrl) {
    bgStyle.backgroundImage = `linear-gradient(rgba(0,0,0,${screen.overlay}), rgba(0,0,0,${screen.overlay})), url(${screen.backgroundUrl})`;
  }

  const cardVisible = screen.showContentCard ?? true;
  const cardStyle: React.CSSProperties = {
    borderColor: screen.accentColor,
    background: cardVisible ? hexToRgba(screen.contentCardColor, screen.contentCardOpacity ?? 0.85) : "transparent",
    backdropFilter: cardVisible ? `blur(${screen.contentCardBlur ?? 12}px)` : "none",
    WebkitBackdropFilter: cardVisible ? `blur(${screen.contentCardBlur ?? 12}px)` : "none",
  };

  return (
    <main className={`story-page ${preview ? "is-preview" : ""}`} dir={story.direction} style={bgStyle}>
      {screen.backgroundType === "video" && screen.backgroundUrl && (
        <video className="story-bg-video" src={screen.backgroundUrl} autoPlay muted loop playsInline />
      )}
      {screen.backgroundType === "video" && (
        <div className="story-overlay" style={{ background: `rgba(0,0,0,${screen.overlay})` }} />
      )}

      <section className={`story-screen pos-${screen.position}`}>
        <div className="story-progress">
          {story.screens.map((_, i) => (
            <button key={i} className={i === index ? "active" : ""} onClick={() => setIndex(i)} />
          ))}
        </div>

        <div className={`story-card ${cardVisible ? "" : "no-card"}`} style={cardStyle}>
          {(screen.showTopCard ?? true) && <Media screen={screen} />}
          <span className="story-kicker" style={{ color: screen.accentColor }}>{story.name}</span>
          <h1>{screen.title}</h1>
          <h2>{screen.subtitle}</h2>
          <p>{screen.body}</p>
          {screen.buttonAction !== "none" && (
            <button className="story-main-btn" style={{ background: screen.accentColor }} onClick={goAction}>
              {screen.buttonText || "التالي"}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
