import Link from "next/link";
import React from "react";

export default function ClientNotFound() {
  return (
    <div className="py-4 space-y-2">
      <div>
        <h2 className="text-lg font-semibold">Not Found</h2>
        <p className="text-sm">Could not find requested client</p>
      </div>
      <p className="underline text-blue-500">
        <Link href="/clients">View all clients</Link>
      </p>
    </div>
  );
}
