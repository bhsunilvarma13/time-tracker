import Link from "next/link";
import { SidebarListItem } from "./sidebar-list-item";

const Sidebar = () => {
  return (
    <ul className="w-1/5 py-6">
      <SidebarListItem />
    </ul>
  );
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto flex divide-x-2 h-full">
      <Sidebar />
      <div className="py-6 w-4/5">{children}</div>
    </div>
  );
}
