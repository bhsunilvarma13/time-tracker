import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function ProjectDetailsPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = await getUserSession();

  const project = await prisma.project.findFirst({
    where: {
      id: id,
      tenantId: user.tenant.id,
    },
    include: {
      client: true,
    },
  });

  if (!project) {
    throw notFound();
  }

  async function deleteProject() {
    "use server";
    if (!project) throw new Error("Project not found");

    const user = await getUserSession();

    await prisma.project.delete({
      where: {
        id: project?.id,
        tenant: {
          id: user.tenant.id,
        },
      },
    });

    redirect("/projects");
  }

  return (
    <div className="space-y-2 py-4 h-full w-full">
      <div className="flex w-full justify-between items-center">
        <h2 className="text-lg font-semibold">Project Details</h2>
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreHorizontal />
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuLabel>Options</DropdownMenuLabel>

              <DropdownMenuSeparator />

              <Link href={`/projects/${project.id}/edit`}>
                <DropdownMenuItem>Edit</DropdownMenuItem>
              </Link>

              <DialogTrigger asChild>
                <DropdownMenuItem className="text-red-600">
                  Delete
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Do you want to delete this project?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Make sure you want to delete this
                project.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <form action={deleteProject}>
                <Button type="submit" variant="destructive">
                  Delete
                </Button>
              </form>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex gap-4 items-center">
        <span
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: project.color || "" }}
        />
        <h3>{project.name}</h3>
        {project?.client && (
          <div>
            <h1>Client</h1>
            <div>{project.client.name}</div>
          </div>
        )}
        <div></div>
      </div>
    </div>
  );
}
