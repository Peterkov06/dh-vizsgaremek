export interface BaseCourse {
  courseName: string;
  courseId: string;
  type: "Tutoring" | "LearningPath" | string;
  coursePictureURL: string;
  courseBannerURL: string;
}

export interface EnrolledCourse extends BaseCourse {
  status: "Draft" | "Active" | "Completed" | string;
  enrolledStudents: number;
  ongoingAssignments: number;
  courseRating: number;
}

export interface CourseDashboardData {
  tutoringCourses: EnrolledCourse[];
  pathCourses: BaseCourse[];
  draftCourses: BaseCourse[];
}
