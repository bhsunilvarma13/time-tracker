import Link from "next/link";
import { getUserSession } from "@/lib/auth";
import Avatar from "./avatar";

const links = [
  { href: "/track", label: "Track" },
  { href: "/clients", label: "Clients" },
];

export async function NavBar() {
  const user = await getUserSession();

  return (
    <div className="shadow w-full">
      <div className="flex container items-center py-2 space-x-4">
        <Link href="/" className="hover:bg-slate-100 py-1 px-2 rounded-md">
          <span className="font-semibold">Time Tracker</span>
        </Link>
        <nav>
          <ul className="flex items-center gap-2">
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
        <Avatar user={user} />
      </div>
    </div>
  );
}
