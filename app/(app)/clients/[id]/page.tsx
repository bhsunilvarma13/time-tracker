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
import { redirect } from "next/navigation";

export default async function ClientPage({
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

  if (!client) {
    return <div>Client not found</div>;
  }

  async function deleteClient() {
    "use server";
    if (!client) throw new Error("Client not found");

    const user = await getUserSession();

    await prisma.client.delete({
      where: {
        id: client?.id,
        tenant: {
          id: user.tenant.id,
        },
      },
    });

    redirect("/clients");
  }

  return (
    <div className="space-y-2 py-4 h-full w-full">
      <div className="flex w-full justify-between items-center">
        <h2 className="text-lg font-medium">Client</h2>
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreHorizontal />
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuLabel>Options</DropdownMenuLabel>

              <DropdownMenuSeparator />

              <Link href={`/clients/${client.id}/edit`}>
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
              <DialogTitle>Do you want to delete this client?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Make sure you want to delete this
                client.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <form action={deleteClient}>
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
          style={{ backgroundColor: client.color || "" }}
        />
        <h3>{client.name}</h3>
      </div>
    </div>
  );
}
