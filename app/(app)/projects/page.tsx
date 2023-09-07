import { Button } from "@/components/ui/button";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ProjectListHeader, ProjectsList } from "./projects";
import { redirect } from "next/navigation";

const BlankSlate = () => {
  return (
    <div className="rounded-lg bg-slate-200 p-4 gap-4 flex flex-col items-center">
      <h2 className="text-lg font-semibold">Create a project</h2>
      <p>
        A project represents the works that you do for a client. Projects often
        have many activities you perform for them. Create a project to keep your
        work organised.
      </p>
      <Button asChild>
        <Link href="/projects/new">Create</Link>
      </Button>
    </div>
  );
};

export default async function ProjectsPage() {
  const user = await getUserSession();

  const projects = await prisma.project.findMany({
    where: {
      tenantId: user.tenant.id,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  if (projects.length > 0) {
    redirect(`/projects/${projects[0].id}`);
  }

  return (
    <div className="container py-4 space-y-2 h-full">
      <ProjectListHeader />
      {projects.length > 0 ? (
        <ProjectsList projects={projects} />
      ) : (
        <BlankSlate />
      )}
    </div>
  );
}
