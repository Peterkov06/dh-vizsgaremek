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
  type: string;
  courseDomain: IdName;
  courseLevel: IdName;
  price: number;
  firstConsultationFree: boolean;
  ratingAverage: number;
  currency: Currency;
  iconImage: string;
  bannerImage: string;
  tags: IdName[];
  languages: IdName[];
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

export type CourseDetail = {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherImage: string;
  teacherLocation: string;
  courseName: string;
  description: string;
  type: string;
  classLenght: number;
  courseDomain: IdName;
  courseLevel: IdName;
  price: number;
  firstConsultationFree: boolean;
  currency: Currency;
  status: string;
  ratingAverage: number;
  iconImage: string;
  locations: IdName[];
  bannerImage: string;
  tags: IdName[];
  languages: IdName[];
  reviews: CourseReview[];
};
