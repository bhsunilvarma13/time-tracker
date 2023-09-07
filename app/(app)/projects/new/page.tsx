import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default async function NewProjectPage() {
  async function onCreate(data: FormData) {
    "use server";

    console.log("data:", data);

    const user = await getUserSession();

    const client = data.get("client") as string;

    const project = await prisma.project.create({
      data: {
        name: data.get("name") as string,
        color: data.get("colour") as string,
        tenantId: user.tenant.id,
        clientId: client ? client : undefined,
      },
    });

    revalidatePath("/projects");
    redirect("/projects");
  }

  const user = await getUserSession();

  const clients = (
    await prisma.client.findMany({
      where: {
        tenantId: user.tenant.id,
      },
    })
  ).map((client) => ({
    value: client.id,
    label: client.name,
  }));

  return (
    <form
      action={onCreate}
      className="max-w-lg mx-auto py-8 gap-4 flex flex-col"
    >
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label>Project Name</Label>
        <Input type="text" name="name" placeholder="Project name" required />
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label>Project Colour</Label>
        <Input type="color" name="colour" placeholder="Project colour" />
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label>Client</Label>
        <Select name="client">
          <SelectTrigger>
            <SelectValue placeholder="Choose a client" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Clients</SelectLabel>
              <SelectItem value="">None</SelectItem>
              {clients.map((client) => (
                <SelectItem value={client.value} key={client.value}>
                  {client.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Button type="submit">Add Project</Button>
      </div>
    </form>
  );
}
