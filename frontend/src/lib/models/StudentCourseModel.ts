export interface StudentsCourse {
  courseBaseId: string;
  instanceId: string;
  teacherName: string;
  courseName: string;
  teacherId: string;
  teacherProfilePictureURL: string;
  courseBannerURL: string;
  status: "Active" | "Pending" | "Completed";
}
