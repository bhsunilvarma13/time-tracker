import { getUserSession } from "@/lib/auth";
import { ClientListHeader, ClientsList } from "../clients";
import { prisma } from "@/lib/prisma";

export default async function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserSession();
  const clients = await prisma.client.findMany({
    where: {
      tenantId: user.tenant.id,
    },
  });
  return (
    <div className="container mx-auto flex gap-4 divide-x-2 h-full">
      <div className="w-1/2 space-y-2 py-4">
        <ClientListHeader />
        <ClientsList clients={clients} />
      </div>
      <div className="px-4">{children}</div>
    </div>
  );
}
