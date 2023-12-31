import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

export default async function EditClientPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = await getUserSession();

  const client = await prisma.client.findFirst({
    where: {
      id: id,
      tenantId: user.tenant.id,
    },
  });

  if (!client) throw notFound();

  async function editClient(data: FormData) {
    "use server";

    if (!client) throw notFound();

    const user = await getUserSession();

    await prisma.client.update({
      where: {
        id: client.id,
        tenant: {
          id: user.tenant.id,
        },
      },

      data: {
        name: data.get("name") as string,
        color: data.get("color") as string,
      },
    });

    revalidatePath(`/clients/${client.id}`);

    redirect(`/clients/${client.id}`);
  }

  return (
    <>
      <h1 className="text-lg font-semibold py-6">Edit Client</h1>
      <form action={editClient} className="max-w-lg gap-4 flex flex-col">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Project Name</Label>
          <Input
            type="text"
            name="name"
            placeholder="Project name"
            defaultValue={client.name}
            required
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Colour</Label>
          <Input
            type="color"
            name="color"
            placeholder="Project colour"
            defaultValue={client.color || ""}
          />
        </div>

        <div>
          <Button type="submit">Save Project</Button>
        </div>
      </form>
    </>
  );
}
