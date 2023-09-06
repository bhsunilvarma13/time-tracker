"use client";

import { useEffect, useState } from "react";

const pad = (n: number) => n.toString().padStart(2, "0");

type DurationProps = {
  startAt: Date;
};

const ActivityDuration = ({ startAt }: DurationProps) => {
  const now = new Date();

  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = now.getTime() - startAt.getTime();
      setElapsed(elapsed);
    }, 1000);
    return () => clearInterval(interval);
  });

  const sec = elapsed / 1000;

  const seconds = Math.floor(sec % 60);
  const minutes = Math.floor((sec / 60) % 60);
  const hours = Math.floor(sec / 60 / 60);

  return (
    <div className="tabular-nums slashed-zero font-medium">
      {pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </div>
  );
};

export default ActivityDuration;
