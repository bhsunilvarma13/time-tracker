"use client";
import React from "react";
import { Avatar as RootAvatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Session } from "next-auth";

function Avatar({ user }: { user: Session["user"] }) {
  return (
    <RootAvatar>
      {user.image ? (
        <AvatarImage src={user.image} referrerPolicy="no-referrer" />
      ) : (
        <AvatarFallback>{user.name}</AvatarFallback>
      )}
    </RootAvatar>
  );
}

export default Avatar;
