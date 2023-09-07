import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Label } from "@/components/ui/label";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

export default async function EditProjectPage({
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

  if (!project) throw notFound();

  async function editProject(data: FormData) {
    "use server";

    if (!project) throw notFound();

    const user = await getUserSession();

    await prisma.project.update({
      where: {
        id: project.id,
        tenant: {
          id: user.tenant.id,
        },
      },

      data: {
        name: data.get("name") as string,
        color: data.get("color") as string,
      },
    });

    revalidatePath(`/projects/${project.id}`);

    redirect(`/projects/${project.id}`);
  }

  return (
    <>
      <h1 className="text-lg font-semibold py-6">Edit Project</h1>
      <form action={editProject} className="max-w-lg gap-4 flex flex-col">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Project Name</Label>
          <Input
            type="text"
            name="name"
            placeholder="Project name"
            defaultValue={project.name}
            required
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Colour</Label>
          <Input
            type="color"
            name="color"
            placeholder="Project colour"
            defaultValue={project.color || ""}
          />
        </div>

        <div>
          <Button type="submit">Save Project</Button>
        </div>
      </form>
    </>
  );
}
