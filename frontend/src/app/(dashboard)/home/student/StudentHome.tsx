import { User } from "@/lib/auth";
import React from "react";

const StudentHome = (props: { user: User }) => {
  return (
    <div>
      <h1>Diák oldal</h1>
      <p>Helló {props.user.nickname}</p>
    </div>
  );
};

export default StudentHome;
