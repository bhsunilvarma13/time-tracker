import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  return (
    <div className="space-y-2 py-4 h-full">
      <h2 className="text-lg font-medium">Client</h2>
      <h3>{client.name}</h3>
    </div>
  );
}
