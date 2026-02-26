export type CourseType = "tutoring" | "learningPath";

export type EventType = "deadline" | "lesson";

export interface CourseEvent {
  eventId: string;
  eventUrl: string;
  title: string;
  startDate: string;
  startTime: string;
  eventType: EventType;
  description: string;
}

export interface ActiveCourse {
  courseId: string;
  instanceId: string;
  courseName: string;
  imageUrl: string;
  teacherName: string;
  courseType: CourseType;
  progress: number;
  upcomingEvents: CourseEvent[];
}

export interface InactiveCourse {
  courseId: string;
  instanceId: string;
  courseName: string;
  imageUrl: string;
  teacherName: string;
  courseType: CourseType;
  progress: number;
}

export interface AttendedCourses {
  active: ActiveCourse[];
  inactive: InactiveCourse[];
}

export interface UpcomingEvent {
  eventId: string;
  eventUrl: string;
  title: string;
  startDate: string;
  startTime: string;
  courseName: string;
  teacherName: string;
  eventType: EventType;
  description: string;
}

export interface LessonPrice {
  amount: number;
  currency: string;
}

export interface PopularCourse {
  courseId: string;
  instanceId: string;
  courseName: string;
  imageUrl: string;
  teacherName: string;
  lessonPrice: LessonPrice;
  description: string;
  courseType: CourseType;
}

export interface LastUnreadNotification {
  notificationId: string;
  eventUrl: string;
  courseName: string;
  text: string;
}

export interface Notifications {
  unreadNotificationNumber: number;
  lastUnread: LastUnreadNotification;
}

export interface DashboardModel {
  attendedCourses: AttendedCourses;
  upcomingEvents: UpcomingEvent[];
  popularCourses: PopularCourse[];
  notifications: Notifications;
}
