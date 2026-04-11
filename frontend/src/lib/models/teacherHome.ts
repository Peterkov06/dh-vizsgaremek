export type EventType = "deadline" | "lesson";

// These three remain the same based on the JSON keys,
// though they are currently empty arrays in your example.
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

// Updated: Added enrollmentId and profilePictureUrl
export interface PendingEnrollment {
  courseId: string;
  courseName: string;
  userId: string;
  userName: string;
  enrollmentDate: string;
  enrollmentId: string;
  profilePictureUrl: string;
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

// UPDATED: Student now has a nested courses array and uses profilePictureUrl/chatId
export interface StudentCourse {
  id: string;
  name: string;
}

export interface Student {
  userId: string;
  fullName: string;
  nickName: string;
  courses: StudentCourse[]; // Changed from flat courseId/courseName
  chatId: string; // Changed from chatUrl
  profilePictureUrl: string;
}

// UPDATED: Notification structure changed field names
export interface LastUnreadNotification {
  notificationId: string;
  referenceId: string; // New field
  firstText: string; // New field
  secondText: string; // New field
}

export interface Notifications {
  unreadNotificationNumber: number;
  lastUnread: LastUnreadNotification | null;
}

// Main Wrapper
export interface TeacherDashboardModel {
  activeCourses: ActiveCourse[];
  upcomingEvents: UpcomingEvent[];
  gradingQueue: GradingQueueItem[];
  pendingEnrollments: PendingEnrollment[];
  pendingPayments: PendingPayment[];
  students: Student[];
  notifications: Notifications;
}
