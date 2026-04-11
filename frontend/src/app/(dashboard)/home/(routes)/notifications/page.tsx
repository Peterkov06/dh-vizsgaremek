"use client";

import fetchWithAuth from "@/lib/api-client";
import { CircleAlert, CircleCheckBig, LoaderCircle, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface SystemNotification {
  id: string;
  type: string;
  sender: string;
  referenceText: string;
  referenceId: string;
  message: string | null;
  createdAt: string;
  isRead: boolean;
}

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<SystemNotification[]>();
  const [once, setOnce] = useState<boolean>(true);

  const HandleFetch = async () => {
    await fetchWithAuth("/api/communication/notifications")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setNotifications(data);
      });
  };

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    HandleFetch();
  }, []);

  return (
    <main>
      <h1 className="text-3xl lg:text-5xl text-primary font-bold mb-5">
        Értesítések
      </h1>

      <div className="flex flex-col gap-6">
        {notifications &&
          notifications?.map((n) => (
            <div
              key={n.id}
              className={`relative flex items-center justify-between p-3 rounded-2xl ${n.isRead ? "bg-light-bg-gray" : "bg-secondary"}`}
            >
              <h2 className="absolute bg-background px-2 py-1 rounded-xl right-0 -top-5">
                {new Date(n.createdAt).toLocaleDateString("hu-HU")}
              </h2>
              <div>
                <h1 className="text-lg lg:text-2xl flex items-center gap-3">
                  {/* {n.type === "EnrollmentAcceptance" &&
                    "Jelentkezésedet elfogadták"} */}
                  {n.type}
                </h1>
                <span className="flex gap-2 lg:text-lg text-gray-500">
                  <User className="text-primary"></User>
                  {n.sender}
                </span>
              </div>
              <div className="text-gray-500 truncate max-w-[5em] lg:max-w-[50em]">
                {n.message || ""}
              </div>
              <div className="mr-10">
                {n.isRead ? (
                  <CircleCheckBig className="size-8 lg:size-12 text-gray-500"></CircleCheckBig>
                ) : (
                  <LoaderCircle className="size-8 lg:size-12 text-red-500"></LoaderCircle>
                )}
              </div>
            </div>
          ))}
      </div>
    </main>
  );
};

export default NotificationPage;
