export interface StudentsCourse {
  courseBaseId: string;
  instanceId: string;
  teacherName: string;
  teacherId: string;
  teacherProfilePictureURL: string;
  courseBannerURL: string;
  status: "Active" | "Inactive" | "Completed";
}
