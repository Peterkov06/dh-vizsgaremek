export interface SearchCourseType {
  id: string;
  bannerImg: string;
  avatarImg: string;
  courseName: string;
  teacherName: string;
  location: string;
  price: string;
}

export interface SingleCourseType {
  id: string;
  bannerImg: string;
  avatarImg: string;
  courseName: string;
  teacherName: string;
  location: string;
  price: string;
  rating: number;
  teacherIntroduction: string;
  courseDescription: string;
  tags: string[];
  languages: string[];
}
