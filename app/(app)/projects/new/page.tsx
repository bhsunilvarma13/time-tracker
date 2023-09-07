import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function NewProjectPage() {
  async function onCreate(data: FormData) {
    "use server";

    const user = await getUserSession();

    const project = await prisma.project.create({
      data: {
        name: data.get("name") as string,
        color: data.get("colour") as string,
        tenantId: user.tenant.id,
      },
    });

    revalidatePath("/projects");
    redirect("/projects");
  }

  return (
    <form
      action={onCreate}
      className="max-w-lg mx-auto py-8 gap-4 flex flex-col"
    >
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email">Project Name</Label>
        <Input type="text" name="name" placeholder="Project name" required />
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email">Project Colour</Label>
        <Input type="color" name="colour" placeholder="Project colour" />
      </div>

      <div>
        <Button type="submit">Add Project</Button>
      </div>
    </form>
  );
}
