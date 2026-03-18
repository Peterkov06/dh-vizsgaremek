"use client";

import { useSearchParams } from "next/navigation";

const CourseOverView = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  return (
    <main>
      <h1>{id}</h1>
    </main>
  );
};

export default CourseOverView;
