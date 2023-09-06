import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Activity } from "@prisma/client";
import { revalidatePath } from "next/cache";
import ActivityDuration from "./duration";
import { ArrowRight, Play, Square } from "lucide-react";
import { cn } from "@/lib/utils";

type NewActivityProps = {
  activity?: Activity | null;
};

const NewActivity = ({ activity }: NewActivityProps) => {
  async function startActivity(data: FormData) {
    "use server";

    const user = await getUserSession();

    await prisma.activity.create({
      data: {
        user: { connect: { id: user.id } },
        tenant: { connect: { id: user.tenant.id } },
        name: data.get("name") as string,
        startAt: new Date(),
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
        className="flex items-center gap-4"
      >
        <Input type="text" name="name" defaultValue={activity?.name || ""} />
        <input type="hidden" name="id" defaultValue={activity?.id || ""} />
        {activity && <ActivityDuration startAt={activity.startAt} />}
        <Button
          variant="outline"
          className={cn(
            "rounded-full px-2",
            activity ? "bg-red-600 text-white" : ""
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
  console.log(activities);

  return (
    <div className="space-y-2">
      <h1 className="text-lg font-semibold">What you&apos;ve done today.</h1>
      <ul>
        {activities.map((activity) => (
          <li className="py-2 space-x-2 flex items-center" key={activity.id}>
            <span className="w-1/3">{activity.name}</span>
            <span>
              {new Intl.DateTimeFormat(undefined, {
                hour: "numeric",
                minute: "numeric",
              }).format(activity.startAt)}
            </span>

            <ArrowRight size={16} />

            <span>
              {new Intl.DateTimeFormat(undefined, {
                hour: "numeric",
                minute: "numeric",
              }).format(activity.endAt || new Date())}
            </span>
          </li>
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
    <main className="container py-4 space-y-8">
      <NewActivity activity={currentActivity} />
      <DailyActivities activities={dailyActivities} />
    </main>
  );
}
