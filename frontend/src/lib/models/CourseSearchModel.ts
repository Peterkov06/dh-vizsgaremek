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

// Rendes

export type IdName = {
  id: string;
  name: string;
};

export type Currency = {
  id: string;
  name: string;
  currencyCode: string;
  currencySymbol: string;
};

export type CourseReview = {
  id: string;
  courseId: string;
  reviewerName: string;
  reviewerImage: string;
  recommended: boolean;
  text: string;
  reviewScore: number;
};

export type Course = {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherImage: string;
  teacherLocation: string;
  courseName: string;
  description: string;
  type: string;
  courseDomainId: string;
  courseLevelId: string;
  price: number;
  firstConsultationFree: boolean;
  currency: Currency;
  status: string;
  iconImageId: string | null;
  bannerImageId: string | null;
  tags: IdName[];
  languages: IdName[];
  reviews: CourseReview[];
};

export type CoursesPage = {
  courses: Course[];
  totalCourses: number;
  totalPages: number;
  pageNum: number;
  coursesPerPage: number;
};

export type CourseFilterResponse = {
  domains: IdName[];
  tags: IdName[];
  languages: IdName[];
  levels: IdName[];
  courses: CoursesPage;
  minPrice: number;
  maxPrice: number;
};
