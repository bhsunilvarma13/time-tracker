import { Button } from "@/components/ui/button";
import { Project } from "@prisma/client";
import Link from "next/link";

type ProjectsListProps = {
  projects: Project[];
};

export const ProjectsList = ({ projects }: ProjectsListProps) => {
  return (
    <ul>
      {projects.map((project) => {
        return (
          <li key={project.id} className="flex gap-2 items-center">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: project.color || "" }}
            />
            <Link href={`/projects/${project.id}`}>{project.name}</Link>
          </li>
        );
      })}
    </ul>
  );
};

export const ProjectListHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Projects</h2>
      <Button asChild>
        <Link href="/projects/new">Create</Link>
      </Button>
    </div>
  );
};
