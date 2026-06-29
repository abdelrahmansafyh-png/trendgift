"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import StoryRenderer from "@/components/story/StoryRenderer";
import { defaultStoryPage, emptyStoryScreen } from "@/lib/story/defaults";
import type { StoryPage, StoryScreen } from "@/lib/story/types";

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || `story-${Date.now()}`;
}

function storyToDb(story: StoryPage) {
  return {
    id: story.id,
    slug: normalizeSlug(story.slug),
    name: story.name,
    active: story.active !== false,
    direction: story.direction,
    theme: story.theme,
    screens: story.screens,
    updated_at: new Date().toISOString(),
  };
}

async function adminSaveStory(story: StoryPage) {
  const res = await fetch("/api/admin/cms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table: "custom_pages", action: "upsert", payload: storyToDb(story) }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Save failed");
  return json.data;
}

async function adminDeleteStory(id: string) {
  const res = await fetch("/api/admin/cms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table: "custom_pages", action: "delete", id }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Delete failed");
}

async function uploadStoryFile(file: File, folder = "stories") {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Upload failed");
  return json.url as string;
}

function SortableScreen({ screen, active, onClick }: { screen: StoryScreen; active: boolean; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: screen.id });
  return (
    <button ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={`screen-item ${active ? "active" : ""}`} onClick={onClick}>
      <span {...attributes} {...listeners}>☰</span>
      <b>{screen.title || "بدون عنوان"}</b>
      <small>{screen.position}</small>
    </button>
  );
}

function FileUpload({ label, accept, onUploaded }: { label: string; accept: string; onUploaded: (url: string, file: File) => void }) {
  const [status, setStatus] = useState("");
  return (
    <label className="file-picker">
      {status || label}
      <input
        type="file"
        accept={accept}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setStatus("جاري الرفع...");
          try {
            const url = await uploadStoryFile(file);
            onUploaded(url, file);
            setStatus("تم الرفع");
          } catch (err: any) {
            setStatus(err.message || "فشل الرفع");
          } finally {
            e.currentTarget.value = "";
            setTimeout(() => setStatus(""), 1800);
          }
        }}
      />
    </label>
  );
}

export default function StoryBuilderAdmin() {
  const [pages, setPages] = useState<StoryPage[]>([]);
  const [story, setStory] = useState<StoryPage>(defaultStoryPage());
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState("");
  const screen = story.screens[active];

  useEffect(() => {
    fetch("/api/admin/stories")
      .then((r) => r.json())
      .then((data) => {
        setPages(data.pages || []);
        if (data.pages?.[0]) setStory(data.pages[0]);
      })
      .catch(() => setPages([]));
  }, []);

  const publicUrl = useMemo(() => `/custom/${normalizeSlug(story.slug)}`, [story.slug]);

  const flash = (msg: string) => {
    setStatus(msg);
    setTimeout(() => setStatus(""), 2500);
  };

  const updateScreen = (patch: Partial<StoryScreen>) => {
    setStory((s) => ({ ...s, screens: s.screens.map((item, i) => (i === active ? { ...item, ...patch } : item)) }));
  };

  const addScreen = () => {
    const next = emptyStoryScreen();
    setStory((s) => ({ ...s, screens: [...s.screens, next] }));
    setActive(story.screens.length);
  };

  const removeScreen = () => {
    if (story.screens.length <= 1) return;
    setStory((s) => ({ ...s, screens: s.screens.filter((_, i) => i !== active) }));
    setActive(0);
  };

  const newStory = () => {
    const next = defaultStoryPage();
    setStory(next);
    setActive(0);
  };

  const saveStory = async () => {
    try {
      const clean = { ...story, slug: normalizeSlug(story.slug) };
      const saved = await adminSaveStory(clean);
      const nextStory = { ...clean, id: saved?.id || clean.id };
      setStory(nextStory);
      setPages((items) => {
        const exists = items.some((p) => p.id === nextStory.id || p.slug === nextStory.slug);
        return exists ? items.map((p) => (p.id === nextStory.id || p.slug === nextStory.slug ? nextStory : p)) : [nextStory, ...items];
      });
      flash("تم حفظ الصفحة في Supabase");
    } catch (err: any) {
      flash(err.message || "فشل الحفظ");
    }
  };

  const deleteStory = async () => {
    if (!story.id) return flash("هذه الصفحة غير محفوظة بعد");
    if (!confirm("حذف الصفحة؟")) return;
    try {
      await adminDeleteStory(story.id);
      setPages((items) => items.filter((p) => p.id !== story.id));
      newStory();
      flash("تم حذف الصفحة");
    } catch (err: any) {
      flash(err.message || "فشل الحذف");
    }
  };

  const uploadSingle = async (file: File | undefined, target: "background" | "media") => {
    if (!file) return;
    const url = await uploadStoryFile(file);
    if (target === "background") {
      updateScreen({ backgroundUrl: url, backgroundType: file.type.startsWith("video/") ? "video" : "image" });
    } else {
      const mediaType = file.type.startsWith("video/") ? "video" : file.type.startsWith("audio/") ? "audio" : "image";
      updateScreen({ mediaUrl: url, mediaType });
    }
  };

  const uploadGallery = async (files: FileList | null) => {
    if (!files?.length || !screen) return;
    setStatus("جاري رفع المعرض...");
    try {
      const urls = await Promise.all(Array.from(files).map((file) => uploadStoryFile(file)));
      updateScreen({ mediaType: "gallery", gallery: [...(screen.gallery || []).filter(Boolean), ...urls] });
      flash("تم رفع الصور");
    } catch (err: any) {
      flash(err.message || "فشل رفع المعرض");
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { active: dragged, over } = e;
    if (!over || dragged.id === over.id) return;
    const oldIndex = story.screens.findIndex((item) => item.id === dragged.id);
    const newIndex = story.screens.findIndex((item) => item.id === over.id);
    setStory((s) => ({ ...s, screens: arrayMove(s.screens, oldIndex, newIndex) }));
    setActive(newIndex);
  };

  if (!screen) return null;

  return (
    <div className="builder-page" dir="rtl">
      <aside className="builder-sidebar">
        <div className="builder-topline">
          <Link href="/admin" className="back-to-list">← لوحة التحكم</Link>
          {status && <small className="saved-badge">{status}</small>}
        </div>
        <h2>Story Builder</h2>

        <label>اختر صفحة محفوظة
          <select value={story.id || story.slug} onChange={(e) => {
            const found = pages.find((p) => (p.id || p.slug) === e.target.value);
            if (found) { setStory(found); setActive(0); }
          }}>
            <option value={story.id || story.slug}>{story.name}</option>
            {pages.filter((p) => (p.id || p.slug) !== (story.id || story.slug)).map((p) => <option key={p.id || p.slug} value={p.id || p.slug}>{p.name} — /custom/{p.slug}</option>)}
          </select>
        </label>

        <label>اسم الصفحة<input value={story.name} onChange={(e) => setStory({ ...story, name: e.target.value })} /></label>
        <label>Slug<input dir="ltr" value={story.slug} onChange={(e) => setStory({ ...story, slug: e.target.value })} /></label>
        <label>الاتجاه<select value={story.direction} onChange={(e) => setStory({ ...story, direction: e.target.value as any })}><option value="rtl">RTL عربي</option><option value="ltr">LTR English</option></select></label>
        <label className="builder-check"><input type="checkbox" checked={story.active !== false} onChange={(e) => setStory({ ...story, active: e.target.checked })} /> الصفحة فعالة</label>

        <div className="builder-actions"><button onClick={addScreen}>+ شاشة</button><button onClick={saveStory}>حفظ</button></div>
        <div className="builder-actions"><button onClick={newStory}>+ صفحة جديدة</button><button className="danger" onClick={deleteStory}>حذف الصفحة</button></div>
        <a className="public-link" href={publicUrl} target="_blank">فتح الصفحة ↗</a>

        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={story.screens.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="screen-list">
              {story.screens.map((s, i) => <SortableScreen key={s.id} screen={s} active={i === active} onClick={() => setActive(i)} />)}
            </div>
          </SortableContext>
        </DndContext>
      </aside>

      <section className="builder-editor">
        <div className="editor-card">
          <h3>تعديل الشاشة</h3>
          <div className="two-cols">
            <label>العنوان<input value={screen.title} onChange={(e) => updateScreen({ title: e.target.value })} /></label>
            <label>الوصف<input value={screen.subtitle} onChange={(e) => updateScreen({ subtitle: e.target.value })} /></label>
          </div>
          <label>النص<textarea value={screen.body} onChange={(e) => updateScreen({ body: e.target.value })} /></label>

          <div className="three-cols">
            <label>الخلفية<select value={screen.backgroundType} onChange={(e) => updateScreen({ backgroundType: e.target.value as any })}><option value="color">لون</option><option value="image">صورة</option><option value="video">فيديو</option></select></label>
            <label>لون الخلفية<input type="color" value={screen.backgroundColor} onChange={(e) => updateScreen({ backgroundColor: e.target.value })} /></label>
            <label>Overlay<input type="range" min="0" max="0.8" step="0.05" value={screen.overlay} onChange={(e) => updateScreen({ overlay: Number(e.target.value) })} /></label>
          </div>
          <div className="upload-row">
            <label>رابط خلفية<input dir="ltr" value={screen.backgroundUrl} onChange={(e) => updateScreen({ backgroundUrl: e.target.value })} /></label>
            <FileUpload label="رفع خلفية" accept="image/*,video/*" onUploaded={(url, file) => updateScreen({ backgroundUrl: url, backgroundType: file.type.startsWith("video/") ? "video" : "image" })} />
          </div>

          <div className="three-cols">
            <label>لون النص<input type="color" value={screen.textColor} onChange={(e) => updateScreen({ textColor: e.target.value })} /></label>
            <label>Accent<input type="color" value={screen.accentColor} onChange={(e) => updateScreen({ accentColor: e.target.value })} /></label>
            <label>مكان المحتوى<select value={screen.position} onChange={(e) => updateScreen({ position: e.target.value as any })}><option value="top">فوق</option><option value="center">وسط</option><option value="bottom">تحت</option></select></label>
          </div>

          <div className="builder-checks">
            <label className="builder-check"><input type="checkbox" checked={screen.showContentCard ?? true} onChange={(e) => updateScreen({ showContentCard: e.target.checked })} /> إظهار كرت المحتوى الكبير</label>
            <label className="builder-check"><input type="checkbox" checked={screen.showTopCard ?? true} onChange={(e) => updateScreen({ showTopCard: e.target.checked })} /> إظهار الكرت / الميديا العلوية</label>
            <div className="three-cols">
              <label>لون الكرت<input type="color" value={screen.contentCardColor || "#ffffff"} onChange={(e) => updateScreen({ contentCardColor: e.target.value })} /></label>
              <label>شفافية الكرت<input type="range" min="0" max="1" step="0.05" value={screen.contentCardOpacity ?? 0.85} onChange={(e) => updateScreen({ contentCardOpacity: Number(e.target.value) })} /></label>
              <label>Blur الكرت<input type="range" min="0" max="30" step="1" value={screen.contentCardBlur ?? 12} onChange={(e) => updateScreen({ contentCardBlur: Number(e.target.value) })} /></label>
            </div>
          </div>

          <div className="two-cols">
            <label>نوع الميديا<select value={screen.mediaType} onChange={(e) => updateScreen({ mediaType: e.target.value as any })}><option value="none">بدون</option><option value="image">صورة</option><option value="video">فيديو</option><option value="audio">صوت</option><option value="gallery">Gallery</option></select></label>
            <label>رابط الميديا<input dir="ltr" value={screen.mediaUrl} onChange={(e) => updateScreen({ mediaUrl: e.target.value })} /></label>
            <FileUpload label="رفع ميديا" accept="image/*,video/*,audio/*" onUploaded={(url, file) => updateScreen({ mediaUrl: url, mediaType: file.type.startsWith("video/") ? "video" : file.type.startsWith("audio/") ? "audio" : "image" })} />
          </div>

          <div className="upload-row">
            <label>روابط Gallery، كل رابط بسطر<textarea dir="ltr" value={(screen.gallery || []).join("\n")} onChange={(e) => updateScreen({ gallery: e.target.value.split("\n") })} /></label>
            <label className="file-picker">رفع صور Gallery<input type="file" accept="image/*" multiple onChange={(e) => uploadGallery(e.target.files)} /></label>
          </div>

          <div className="three-cols">
            <label>نص الزر<input value={screen.buttonText} onChange={(e) => updateScreen({ buttonText: e.target.value })} /></label>
            <label>Action<select value={screen.buttonAction} onChange={(e) => updateScreen({ buttonAction: e.target.value as any })}><option value="next">التالي</option><option value="prev">السابق</option><option value="link">رابط</option><option value="whatsapp">واتساب</option><option value="none">بدون زر</option></select></label>
            <label>رابط/رقم<input dir="ltr" value={screen.buttonUrl} onChange={(e) => updateScreen({ buttonUrl: e.target.value })} /></label>
          </div>
          <button className="danger" onClick={removeScreen}>حذف الشاشة</button>
        </div>
      </section>

      <section className="builder-preview">
        <div className="phone-frame"><StoryRenderer story={story} preview /></div>
      </section>
    </div>
  );
}
