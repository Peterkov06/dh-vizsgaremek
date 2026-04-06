"use client";

import dynamic from "next/dynamic";

const MyCalendar = dynamic(() => import("./components/MyCalendar"), {
  ssr: false,
});

const TimeTablePage = () => {
  return (
    <main>
      <section>
        <MyCalendar />
      </section>
    </main>
  );
};

export default TimeTablePage;
