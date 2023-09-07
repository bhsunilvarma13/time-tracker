import { Button } from "@/components/ui/button";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ClientListHeader, ClientsList } from "./clients";
import Link from "next/link";
import { redirect } from "next/navigation";

const BlankSlate = () => {
  return (
    <div className="rounded-lg bg-slate-200 p-4 gap-4 flex flex-col items-center">
      <h2 className="text-lg font-semibold">Create a client</h2>
      <p>
        A client represents an entity that you do work for. Clients often have
        many projects you do for them. Create a client to keep your work
        organised.
      </p>
      <Button asChild>
        <Link href="/clients/new">Create</Link>
      </Button>
    </div>
  );
};

export default async function ClientsPage() {
  const user = await getUserSession();

  const clients = await prisma.client.findMany({
    where: {
      tenantId: user.tenant.id,
    },
  });

  if (clients.length > 0) {
    redirect(`/clients/${clients[0].id}`);
  }

  return (
    <div className="container py-4 space-y-2 h-full">
      <ClientListHeader />
      {clients.length > 0 ? <ClientsList clients={clients} /> : <BlankSlate />}
    </div>
  );
}
