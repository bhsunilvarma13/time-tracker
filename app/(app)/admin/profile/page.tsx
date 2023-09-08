import { getUserSession } from "@/lib/auth";
import Image from "next/image";

export default async function ProfilePage() {
  const user = await getUserSession();
  return (
    <div className="container">
      <div className="flex">
        <div className="flex-grow flex flex-col gap-4">
          <h1 className="text-lg font-semibold">Profile Details</h1>
          <div>
            <h2 className="font-semibold">Name</h2>
            <p>{user.name}</p>
          </div>
          <div>
            <h2 className="font-semibold">Email</h2>
            <p>{user.email}</p>
          </div>
        </div>
        <div className="w-[150px]">
          <h1 className="text-lg font-semibold pb-4">Avatar</h1>
          <Image
            src={user.image}
            alt="Profile picture"
            width={150}
            height={150}
            className="rounded-full"
            priority
          />
          <span className="text-xs text-neutral-600">
            If you&apos;d like to change your profile picture, you can edit it
            here on{" "}
            <a
              className="text-blue-500 hover:text-blue-600 underline"
              href="https://myaccount.google.com/profile/photo/edit"
              target="_blank"
            >
              Google here
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
