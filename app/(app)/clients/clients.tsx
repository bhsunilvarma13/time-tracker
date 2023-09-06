import { Button } from "@/components/ui/button";
import { Client } from "@prisma/client";
import Link from "next/link";

type ClientsListProps = {
  clients: Client[];
};

export const ClientsList = ({ clients }: ClientsListProps) => {
  return (
    <ul>
      {clients.map((client) => {
        return (
          <li key={client.id}>
            <Link href={`/clients/${client.id}`}>{client.name}</Link>
          </li>
        );
      })}
    </ul>
  );
};

export const ClientListHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-medium">Clients</h2>
      <Button asChild>
        <Link href="/clients/new">Create</Link>
      </Button>
    </div>
  );
};
