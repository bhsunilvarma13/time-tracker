import Link from "next/link";
import React from "react";

export default function ProjectNotFound() {
  return (
    <div className="py-4 space-y-2">
      <div>
        <h2 className="text-lg font-semibold">Not Found</h2>
        <p className="text-sm">Could not find requested project</p>
      </div>
      <p className="underline text-blue-500">
        <Link href="/projects">View all projects</Link>
      </p>
    </div>
  );
}
