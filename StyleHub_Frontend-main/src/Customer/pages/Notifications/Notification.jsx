import React from "react";
import { useSelector } from "react-redux";
import NotificationCard from "./NotificationCard";

const Notification = ({type}) => {
  const { notification } = useSelector((store) => store);

  return (
    <div className="flex justify-center  px-5 md:px-20 py-5 md:py-10">
      <div className="space-y-5 w-full lg:w-1/2 ">
      <h1 className="text-2xl font-bold text-center">Notifications</h1>
        {notification.notifications.map((item) => (
          <NotificationCard type={type} key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Notification;
