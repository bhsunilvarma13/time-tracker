import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Activity, Client, Project } from "@prisma/client";
import { revalidatePath } from "next/cache";
import ActivityDuration from "./duration";
import {
  ArrowRight,
  Building2,
  FolderOpenDot,
  Play,
  Square,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ActivityItemRow } from "./activity-item-row";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";

type NewActivityProps = {
  activity?: Activity | null;
  clients: Client[];
  projects: Project[];
};

const NewActivity = ({ activity, clients, projects }: NewActivityProps) => {
  async function startActivity(data: FormData) {
    "use server";

    const user = await getUserSession();

    await prisma.activity.create({
      data: {
        user: { connect: { id: user.id } },
        tenant: { connect: { id: user.tenant.id } },
        name: data.get("name") as string,
        startAt: new Date(),
        client: {
          connect: {
            id: (data.get("client") as string) || undefined,
          },
        },
        project: {
          connect: {
            id: (data.get("project") as string) || undefined,
          },
        },
      },
    });

    revalidatePath("/track");
  }

  async function stopActivity(data: FormData) {
    "use server";
    await prisma.activity.update({
      where: {
        id: data.get("id") as string,
      },

      data: {
        endAt: new Date(),
      },
    });
    revalidatePath("/track");
  }

  return (
    <div className="space-y-2">
      <h1 className="text-lg font-semibold">What are you working on?</h1>
      <form
        action={activity ? stopActivity : startActivity}
        className="flex items-center gap-2"
      >
        <Input type="text" name="name" defaultValue={activity?.name || ""} />

        <input type="hidden" name="id" defaultValue={activity?.id} />

        <Select name="client">
          <SelectTrigger className="w-fit">
            <Building2 size={20} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Clients</SelectLabel>

              <SelectItem value="">None</SelectItem>

              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select name="project">
          <SelectTrigger className="w-fit">
            <FolderOpenDot size={20} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Projects</SelectLabel>

              <SelectItem value="">None</SelectItem>

              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {activity && <ActivityDuration startAt={activity.startAt} />}

        <Button
          variant="outline"
          className={cn(
            "rounded-md px-2",
            activity
              ? "bg-red-600 text-white"
              : "hover:bg-green-600 hover:text-white"
          )}
          type="submit"
        >
          {activity ? <Square size={20} /> : <Play size={20} />}
        </Button>
      </form>
    </div>
  );
};

type DialyActivitiesProps = { activities: Activity[] };

const DailyActivities = ({ activities }: DialyActivitiesProps) => {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">What you&apos;ve done today.</h1>
      <ul>
        {activities.map((activity) => (
          <ActivityItemRow key={activity.id} activity={activity} />
        ))}
      </ul>
    </div>
  );
};

export default async function TrackPage() {
  const user = await getUserSession();

  const currentActivity = await prisma.activity.findFirst({
    where: {
      tenantId: user.tenant.id,
      userId: user.id,
      endAt: null,
    },
  });

  const clients = await prisma.client.findMany({
    where: {
      tenantId: user.tenant.id,
    },
  });

  const projects = await prisma.project.findMany({
    where: {
      tenantId: user.tenant.id,
    },
  });

  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  );

  const dailyActivities = await prisma.activity.findMany({
    where: {
      tenantId: user.tenant.id,
      userId: user.id,
      OR: [
        {
          startAt: {
            equals: startOfToday,
          },
        },
        {
          endAt: {
            lte: endOfToday,
          },
        },
      ],
    },
    orderBy: {
      startAt: "asc",
    },
  });

  return (
    <div className="container py-4 space-y-8 h-full">
      <NewActivity
        clients={clients}
        activity={currentActivity}
        projects={projects}
      />
      <DailyActivities activities={dailyActivities} />
    </div>
  );
}
