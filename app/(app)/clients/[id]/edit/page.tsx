import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

  if (!client) return redirect("/clients");

  async function editClient(data: FormData) {
    "use server";

    if (!client) return redirect("/clients");

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
    <form action={editClient} className="space-y-4 py-4 h-full w-full">
      <div className="flex w-full justify-between items-center">
        <h2 className="text-lg font-medium">Edit Client</h2>
        <Button type="submit">Save</Button>
      </div>
      <div className="flex items-center gap-4">
        <input type="hidden" name="id" defaultValue={client.id} />
        <Input
          type="color"
          name="color"
          placeholder="Color"
          className="w-12"
          defaultValue={client.color || ""}
        />
        <Input
          type="text"
          name="name"
          placeholder="Client name"
          className="w-full"
          defaultValue={client.name}
        />
      </div>
    </form>
  );
}
