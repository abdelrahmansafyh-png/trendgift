export type ButtonAction = "next" | "prev" | "link" | "whatsapp" | "none";
export type MediaType = "none" | "image" | "video" | "audio" | "gallery";
export type ContentPosition = "top" | "center" | "bottom";

export type StoryScreen = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  backgroundType: "color" | "image" | "video";
  backgroundColor: string;
  backgroundUrl: string;
  overlay: number;
  textColor: string;
  accentColor: string;
  position: ContentPosition;
  showTopCard: boolean;
  showContentCard?: boolean;
  contentCardOpacity?: number;
  contentCardBlur?: number;
  contentCardColor?: string;
  mediaType: MediaType;
  mediaUrl: string;
  gallery: string[];
  buttonText: string;
  buttonAction: ButtonAction;
  buttonUrl: string;
};

export type StoryPage = {
  id?: string;
  slug: string;
  name: string;
  active: boolean;
  direction: "rtl" | "ltr";
  theme: "light" | "dark" | "soft";
  screens: StoryScreen[];
  createdAt?: string;
  updatedAt?: string;
};
