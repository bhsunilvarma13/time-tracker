import { getUserSession } from "@/lib/auth";
import { ProjectListHeader, ProjectsList } from "../projects";
import { prisma } from "@/lib/prisma";

export default async function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserSession();

  const projects = await prisma.project.findMany({
    where: {
      tenantId: user.tenant.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto flex gap-4 divide-x-2 h-full">
      <div className="w-1/2 space-y-2 py-4">
        <ProjectListHeader />
        <ProjectsList projects={projects} />
      </div>
      <div className="px-4 w-1/2">{children}</div>
    </div>
  );
}
