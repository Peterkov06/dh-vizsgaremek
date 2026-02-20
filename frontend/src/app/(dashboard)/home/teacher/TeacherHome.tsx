import { User } from "@/lib/auth";
import React from "react";

const TeacherHome = (props: { user: User }) => {
  return (
    <div>
      <h1>Tanár oldal</h1>
      <p>Helló {props.user.nickname}</p>
    </div>
  );
};

export default TeacherHome;
