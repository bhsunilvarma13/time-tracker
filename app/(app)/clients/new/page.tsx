import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function NewClientPage() {
  async function onCreate(data: FormData) {
    "use server";

    const user = await getUserSession();

    const client = await prisma.client.create({
      data: {
        name: data.get("name") as string,
        color: data.get("colour") as string,
        tenantId: user.tenant.id,
      },
    });

    revalidatePath("/clients");

    redirect("/clients");
  }

  return (
    <div className="container py-4 space-y-4">
      <h2 className="text-lg font-medium">Create a new client</h2>

      <form action={onCreate} className="flex items-center gap-4">
        <Input
          type="color"
          name="colour"
          className="w-12"
          placeholder="Color"
        />

        <Input
          type="text"
          name="name"
          placeholder="Client name"
          className="w-full"
        />

        <Button type="submit">Create</Button>
      </form>
    </div>
  );
}
