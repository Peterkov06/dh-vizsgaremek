import { User } from "@/lib/auth";
import React from "react";

const StudentHome = (props: { user: User }) => {
  return (
    <div className="h-full bg-amber-200">
      <h1 className="text-4xl font-bold text-primary">
        Üdv {props.user.nickname}!
      </h1>
    </div>
  );
};

export default StudentHome;
