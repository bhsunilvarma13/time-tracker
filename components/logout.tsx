"use client";
import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { signOut } from "next-auth/react";

export const Logout = () => (
  <DropdownMenuItem
    className="text-red-600 cursor-pointer"
    onClick={() => signOut()}
  >
    <LogOut className="mr-2 h-4 w-4" />
    <span>Log out</span>
  </DropdownMenuItem>
);
