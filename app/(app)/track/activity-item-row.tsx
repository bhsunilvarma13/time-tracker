"use client";
import { Input } from "@/components/ui/input";
import { Activity } from "@prisma/client";
import { ArrowRight, Calendar } from "lucide-react";
import { useState } from "react";
import { updateActivity } from "./actions";
import { Button } from "@/components/ui/button";
import { pad } from "@/lib/utils";

type Props = {
  activity: Activity;
};

type EditDateTimeProps = {
  name?: string;
  value: Date;
  onChange?: (date: Date) => void;
};

const EditDateTime = ({ name, value, onChange }: EditDateTimeProps) => {
  const [date, setDate] = useState(value);
  return (
    <div>
      <div className="relative flex items-center">
        <input type="hidden" name={name} defaultValue={date.toISOString()} />
        <Input
          type="time"
          className="pr-8"
          value={`${pad(date.getHours())}:${pad(date.getMinutes())}`}
          onChange={(e) => {
            const [hours, minutes] = e.target.value.split(":");
            const newDate = new Date(date);
            newDate.setHours(parseInt(hours) || 0);
            newDate.setMinutes(parseInt(minutes) || 0);
            setDate(newDate);
            onChange && onChange(newDate);
          }}
        />
        <Calendar size={16} className="absolute right-2" />
      </div>
    </div>
  );
};

type EditRowProps = Props & {
  onSave: () => void;
};

const EditItemRow = ({ activity, onSave }: EditRowProps) => {
  return (
    <li>
      <form
        action={async (data) => {
          await updateActivity(data);
          onSave();
        }}
        className="flex items-center space-x-2"
      >
        <Input
          className="w-96"
          type="text"
          name="name"
          defaultValue={activity.name || ""}
        />

        <EditDateTime name="startAt" value={activity.startAt} />
        <EditDateTime name="endAt" value={activity.endAt || new Date()} />

        <Button type="submit">Save</Button>
      </form>
    </li>
  );
};

const ReadItemRow = ({ activity }: Props) => {
  return (
    <li className="flex-grow py-2 space-x-2 flex items-center">
      <span className="w-1/2">{activity.name}</span>
      <span className="text-sm">
        {new Intl.DateTimeFormat("hi-IN", {
          hour: "numeric",
          minute: "numeric",
        }).format(activity.startAt)}
      </span>

      <ArrowRight size={16} />

      <span className="text-sm">
        {new Intl.DateTimeFormat("hi-IN", {
          hour: "numeric",
          minute: "numeric",
        }).format(activity.endAt || new Date())}
      </span>
    </li>
  );
};

export const ActivityItemRow = ({ activity }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  return isEditing ? (
    <EditItemRow activity={activity} onSave={() => setIsEditing(false)} />
  ) : (
    <div className="flex justify-between items-center">
      <ReadItemRow activity={activity} />
      <Button onClick={() => setIsEditing(true)}>Edit</Button>
    </div>
  );
};
