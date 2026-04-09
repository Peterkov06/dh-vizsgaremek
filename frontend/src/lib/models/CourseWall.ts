// ─── Shared ───────────────────────────────────────────────────────────────────

export type User = {
  id: string;
  name: string;
  avatarUrl?: string;
};

// ─── Attachment ───────────────────────────────────────────────────────────────

export type AttachmentType = "pdf" | "link" | "image" | "file";

export type Attachment = {
  id: string;
  label: string; // e.g. "matyika.pdf", "github.com"
  url: string;
  type: AttachmentType;
};

// ─── Post / Announcement ──────────────────────────────────────────────────────

export type Comment = {
  id: string;
  author: User;
  content: string;
  createdAt: Date;
};

export type Post = {
  id: string;
  author: User;
  content: string;
  attachments: Attachment[];
  comments: Comment[];
  createdAt: Date;
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export type SidebarItemBase = {
  id: string;
  title: string;
  time: string; // e.g. "15:30"
  date: string; // e.g. "11.25"
};

export type UpcomingDeadline = SidebarItemBase & {
  kind: "deadline";
};

export type UpcomingLesson = SidebarItemBase & {
  kind: "lesson";
  teacher?: string; // e.g. "Szakács máté"
};

export type SidebarItem = UpcomingDeadline | UpcomingLesson;

export type Sidebar = {
  upcoming: UpcomingDeadline[]; // "Közelgő" section
  nextLessons: UpcomingLesson[]; // "Következő óra" section
};

// ─── Course / Class page ──────────────────────────────────────────────────────

export type CoursePage = {
  id: string;
  title: string; // e.g. "Emelt matek"
  teacher: User; // e.g. "Arany János József"
  posts: Post[];
  sidebar: Sidebar;
};

export interface PostComment {
  senderId: string;
  senderName: string;
  senderImg: string;
  sentTime: string;
  text: string;
}

export interface WallPost {
  id: string;
  posterName: string;
  posterId: string;
  posterImg: string;
  title: string | null;
  text: string;
  handInId: string | null;
  createdAt: string;
  updatedAt: string | null;
  attachmentURLs: string[];
  comments: PostComment[];
}
