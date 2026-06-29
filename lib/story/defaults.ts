import type { StoryPage, StoryScreen } from "./types";

export function emptyStoryScreen(): StoryScreen {
  return {
    id: `screen-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: "كل عام وأنت بخير",
    subtitle: "هدية صغيرة... بس معناها كبير",
    body: "اضغط ابدأ وشوف المفاجأة اللي جهزناها لك.",
    backgroundType: "color",
    backgroundColor: "#fff4df",
    backgroundUrl: "",
    overlay: 0.35,
    textColor: "#20140b",
    accentColor: "#d4aa48",
    position: "center",
    showTopCard: true,
    showContentCard: true,
    contentCardOpacity: 0.85,
    contentCardBlur: 12,
    contentCardColor: "#ffffff",
    mediaType: "none",
    mediaUrl: "",
    gallery: [],
    buttonText: "التالي",
    buttonAction: "next",
    buttonUrl: "",
  };
}

export function defaultStoryPage(): StoryPage {
  return {
    slug: `story-${Date.now()}`,
    name: "صفحة هدية جديدة",
    active: true,
    direction: "rtl",
    theme: "soft",
    screens: [
      {
        ...emptyStoryScreen(),
        id: "welcome",
        title: "كل عام وأنت بخير يا أحمد 🎂",
        subtitle: "هدية عيد ميلاد أحمد",
        body: "هدية ذكية تفتح بفيديو وصور ورسالة خاصة عبر QR أو NFC.",
        buttonText: "ابدأ المفاجأة",
      },
      {
        ...emptyStoryScreen(),
        id: "video",
        title: "رسالة خاصة لك",
        subtitle: "فيديو تهنئة",
        body: "شاهد الرسالة اللي جهزناها لك بكل حب.",
        mediaType: "video",
        buttonText: "التالي",
      },
    ],
  };
}
