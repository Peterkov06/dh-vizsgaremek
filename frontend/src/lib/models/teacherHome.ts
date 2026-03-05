export type EventType = "deadline" | "lesson";

export interface ActiveCourse {
  courseId: string;
  courseName: string;
  imageUrl: string;
  courseType: string;
  enrolledStudents: number;
}

export interface UpcomingEvent {
  eventId: string;
  eventUrl: string;
  title: string;
  startDate: string;
  startTime: string;
  courseName: string;
  studentName: string;
  eventType: EventType;
  description: string;
}

export interface GradingQueueItem {
  submissionId: string;
  courseId: string;
  courseName: string;
  handInTitle: string;
  studentName: string;
  submittedDate: string;
}

export interface PendingEnrollment {
  courseId: string;
  courseName: string;
  userId: string;
  userName: string;
  enrollmentDate: string;
}

export interface PendingPayment {
  courseId: string;
  instanceId: string;
  courseName: string;
  userId: string;
  userName: string;
  paymentValue: number;
  paymentCurrency: string;
  tokenCount: number;
  paymentDate: string;
}

export interface Student {
  userId: string;
  fullName: string;
  nickName: string;
  courseId: string;
  courseName: string;
  chatUrl: string;
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

export interface TeacherDashboardModel {
  activeCourses: ActiveCourse[];
  upcomingEvents: UpcomingEvent[];
  gradingQueue: GradingQueueItem[];
  pendingEnrollments: PendingEnrollment[];
  pendingPayments: PendingPayment[];
  students: Student[];
  notifications: Notifications;
}
