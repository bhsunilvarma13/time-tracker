import Link from "next/link";
import { Avatar, AvatarImage } from "../ui/avatar";
import { getUserSession } from "@/lib/auth";

const links = [{ href: "/track", label: "Track" }];

export async function NavBar() {
  const user = await getUserSession();

  return (
    <div className="shadow w-full">
      <div className="flex container mx-auto items-center py-2 space-x-4">
        <Link href="/" className="hover:bg-slate-100 py-1 px-2 rounded-md">
          <span className="font-semibold">Time Tracker</span>
        </Link>
        <nav>
          <ul>
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  className="hover:bg-slate-100 py-1 px-2 rounded-md text-blue-500 hover:text-blue-600"
                  href={href}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <span className="flex-grow" />
        <Avatar>
          <AvatarImage src={user.image} referrerPolicy="no-referrer" />
        </Avatar>
      </div>
    </div>
  );
}
