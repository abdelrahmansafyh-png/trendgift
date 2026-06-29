"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { ADHKAR } from "@/lib/adhkar";

function getRepeatCount(repeat?: string) {
  if (!repeat) return 1;

  const normalized = repeat
    .replace(/[٠۰]/g, "0")
    .replace(/[١۱]/g, "1")
    .replace(/[٢۲]/g, "2")
    .replace(/[٣۳]/g, "3")
    .replace(/[٤۴]/g, "4")
    .replace(/[٥۵]/g, "5")
    .replace(/[٦۶]/g, "6")
    .replace(/[٧۷]/g, "7")
    .replace(/[٨۸]/g, "8")
    .replace(/[٩۹]/g, "9");

  const match = normalized.match(/\d+/);
  return match ? Math.max(1, Number(match[0])) : 1;
}

export default function AdhkarPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentRepeat, setCurrentRepeat] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeWord, setActiveWord] = useState(-1);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [needsStartTouch, setNeedsStartTouch] = useState(false);
  const [hasUserStarted, setHasUserStarted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const textBoxRef = useRef<HTMLDivElement>(null);
  const repeatRef = useRef(1);
  const userStartedRef = useRef(false);
  const scrollTimerRef = useRef<number | null>(null);

  const dhikr = ADHKAR[currentIndex];
  const hasAudio = Boolean(dhikr.audio);
  const words = useMemo(() => dhikr.text.split(/\s+/).filter(Boolean), [dhikr.text]);
  const repeatCount = getRepeatCount(dhikr.repeat);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === ADHKAR.length - 1;

  const textSizeClass =
    dhikr.text.length > 650
      ? "is-xs"
      : dhikr.text.length > 420
        ? "is-sm"
        : dhikr.text.length > 230
          ? "is-md"
          : "is-lg";

  const clearScrollTimer = () => {
    if (scrollTimerRef.current) {
      window.clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = null;
    }
  };

  const startTextScroll = () => {
    clearScrollTimer();
    const box = textBoxRef.current;
    if (!box) return;

    box.scrollTo({ top: 0, behavior: "auto" });
    if (box.scrollHeight <= box.clientHeight + 20) return;

    const delay = Math.min(3500, Math.max(1300, (duration || 20) * 180));
    scrollTimerRef.current = window.setTimeout(() => {
      textBoxRef.current?.scrollTo({
        top: textBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, delay);
  };

  useEffect(() => {
    repeatRef.current = currentRepeat;
  }, [currentRepeat]);

  useEffect(() => {
    return () => clearScrollTimer();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasAudio) return;

    const startAt = dhikr.startAt ?? 0;

    const onTime = () => {
      const d = audio.duration;
      if (!d || !Number.isFinite(d)) return;

      const effectiveDuration = Math.max(0, d - startAt);
      const effectiveTime = Math.max(0, audio.currentTime - startAt);
      const nextProgress = effectiveDuration
        ? Math.min(1, effectiveTime / effectiveDuration)
        : 0;

      setProgress(nextProgress);
      setActiveWord(Math.min(words.length - 1, Math.floor(nextProgress * words.length)));
    };

    const onLoaded = () => setDuration(Math.max(0, (audio.duration || 0) - startAt));
    const onPlay = () => {
      setIsPlaying(true);
      setNeedsStartTouch(false);
      startTextScroll();
    };
    const onPause = () => {
      setIsPlaying(false);
      clearScrollTimer();
    };
    const onEnd = () => {
      setIsPlaying(false);
      clearScrollTimer();
      setActiveWord(-1);
      setProgress(0);

      const playedRepeats = repeatRef.current;
      if (playedRepeats < repeatCount) {
        const nextRepeat = playedRepeats + 1;
        repeatRef.current = nextRepeat;
        setCurrentRepeat(nextRepeat);
        audio.currentTime = startAt;
        audio.play().catch(() => setNeedsStartTouch(true));
        return;
      }

      if (currentIndex < ADHKAR.length - 1) {
        setCurrentIndex((index) => index + 1);
        return;
      }

      audio.currentTime = startAt;
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnd);
    };
  }, [words.length, dhikr.audio, dhikr.startAt, hasAudio, repeatCount, currentIndex, duration]);

  useEffect(() => {
    const audio = audioRef.current;
    repeatRef.current = 1;
    setCurrentRepeat(1);
    clearScrollTimer();
    textBoxRef.current?.scrollTo({ top: 0, behavior: "auto" });

    if (!audio || !hasAudio) {
      setIsPlaying(false);
      setActiveWord(-1);
      setProgress(0);
      setDuration(0);
      setNeedsStartTouch(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      audio.pause();
      audio.currentTime = dhikr.startAt ?? 0;
      audio.load();
      setIsPlaying(false);
      setActiveWord(-1);
      setProgress(0);
      setDuration(0);

      try {
        if (dhikr.startAt) audio.currentTime = dhikr.startAt;
        await audio.play();
        if (!cancelled) {
          setIsPlaying(true);
          setNeedsStartTouch(false);
        }
      } catch {
        if (!cancelled) {
          setIsPlaying(false);
          setNeedsStartTouch(!userStartedRef.current);
        }
      }
    };

    const timer = window.setTimeout(run, userStartedRef.current ? 80 : 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [currentIndex, hasAudio, dhikr.startAt, dhikr.audio]);

  const playCurrentAudio = async () => {
    const audio = audioRef.current;
    if (!audio || !hasAudio) return;

    try {
      if ((dhikr.startAt ?? 0) > audio.currentTime || audio.currentTime === 0) {
        audio.currentTime = dhikr.startAt ?? 0;
      }
      await audio.play();
      setNeedsStartTouch(false);
    } catch {
      setNeedsStartTouch(true);
    }
  };

  const startByTouch = async () => {
    userStartedRef.current = true;
    setHasUserStarted(true);
    setNeedsStartTouch(false);
    await playCurrentAudio();
  };

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio || !hasAudio) return;

    userStartedRef.current = true;
    setHasUserStarted(true);

    if (isPlaying) {
      audio.pause();
      return;
    }

    await playCurrentAudio();
  };

  const goNext = () => {
    userStartedRef.current = true;
    setHasUserStarted(true);
    setCurrentIndex((index) => Math.min(index + 1, ADHKAR.length - 1));
  };

  const goPrevious = () => {
    userStartedRef.current = true;
    setHasUserStarted(true);
    setCurrentIndex((index) => Math.max(index - 1, 0));
  };

  const seek = (event: MouseEvent<HTMLButtonElement>) => {
    const audio = audioRef.current;
    if (!audio || !hasAudio || !duration) return;

    userStartedRef.current = true;
    setHasUserStarted(true);

    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    audio.currentTime = (dhikr.startAt ?? 0) + ratio * duration;
    setProgress(ratio);
  };

  const fmt = (seconds: number) => {
    if (!seconds || !Number.isFinite(seconds)) return "٠:٠٠";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <main dir="rtl" className="trend-adhkar-page">
      <div className="trend-adhkar-glow trend-adhkar-glow-right" />
      <div className="trend-adhkar-glow trend-adhkar-glow-left" />

      {(needsStartTouch || !hasUserStarted) && hasAudio ? (
        <button
          type="button"
          onClick={startByTouch}
          onTouchStart={startByTouch}
          className="trend-adhkar-start"
          aria-label="تشغيل الأذكار"
        >
          <span className="trend-adhkar-start-card">
            <span className="trend-adhkar-start-icon">🌿</span>
            <span className="trend-adhkar-start-title">ابدأ أذكار الصباح</span>
            <span className="trend-adhkar-start-sub">
              اضغط مرة واحدة، وبعدها يعمل الصوت والانتقال تلقائيًا.
            </span>
          </span>
        </button>
      ) : null}

      <section className="trend-adhkar-shell">
        <header className="trend-adhkar-header">
          <Link href="/" className="trend-adhkar-back">العودة للمتجر</Link>
          <p className="trend-adhkar-badge">أذكار الصباح</p>
          <p>
            صفحة الأذكار، مخصصة لميداليات NFC و QR من Trend.
          </p>
        </header>

        <article className="trend-adhkar-card">
          <div className="trend-adhkar-card-head">
            <div>
              <p className="trend-adhkar-count">{currentIndex + 1} / {ADHKAR.length}</p>
              <h2>{dhikr.title}</h2>
              {dhikr.subtitle ? <p className="trend-adhkar-subtitle">{dhikr.subtitle}</p> : null}
            </div>

            {dhikr.repeat ? (
              <div className="trend-adhkar-tags">
                <span>{dhikr.repeat}</span>
                <strong>التكرار: {currentRepeat} / {repeatCount}</strong>
              </div>
            ) : null}
          </div>

          <div ref={textBoxRef} className="trend-adhkar-text-box">
            <p className={`trend-adhkar-text ${textSizeClass}`}>
              {words.map((word, index) => (
                <span
                  key={`${dhikr.id}-${index}`}
                  className={
                    "trend-adhkar-word " +
                    (index === activeWord
                      ? "is-active"
                      : index < activeWord
                        ? "is-past"
                        : "")
                  }
                >
                  {word}{" "}
                </span>
              ))}
            </p>
          </div>

          {hasAudio ? (
            <div className="trend-adhkar-player">
              <button
                type="button"
                onClick={toggle}
                aria-label={isPlaying ? "إيقاف" : "تشغيل"}
                className="trend-adhkar-play"
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>

              <div className="trend-adhkar-track">
                <button
                  type="button"
                  onClick={seek}
                  className="trend-adhkar-progress"
                  aria-label="تغيير مكان التشغيل"
                >
                  <span style={{ width: `${progress * 100}%` }} />
                </button>

                <div className="trend-adhkar-times">
                  <span>{fmt(duration * progress)}</span>
                  <span>{fmt(duration)}</span>
                </div>
              </div>

              <audio ref={audioRef} src={dhikr.audio} preload="auto" playsInline />
            </div>
          ) : (
            <p className="trend-adhkar-no-audio">
              هذا الدعاء نصي فقط ولا يوجد له ملف صوت حاليًا.
            </p>
          )}

          <div className="trend-adhkar-nav">
            <button type="button" onClick={goPrevious} disabled={isFirst}>
              <span aria-hidden="true">→</span>
              السابق
            </button>

            <button type="button" onClick={goNext} disabled={isLast}>
              التالي
              <span aria-hidden="true">←</span>
            </button>
          </div>
        </article>

        <footer className="trend-adhkar-footer">
          ﴿ وَاذْكُر رَّبَّكَ إِذَا نَسِيتَ ﴾
        </footer>
      </section>
    </main>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="25" height="25" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="25" height="25" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}
