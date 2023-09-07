"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/teams", label: "Team" },
  { href: "/admin/billing", label: "Billing" },
];

export const SidebarListItem = () => {
  const pathname = usePathname();

  return links.map((link) => (
    <Link key={link.href} href={link.href}>
      <li
        className={cn(
          "hover:bg-neutral-100 rounded-md p-2 mr-8",
          pathname === link.href && "bg-neutral-100"
        )}
      >
        {link.label}
      </li>
    </Link>
  ));
};
