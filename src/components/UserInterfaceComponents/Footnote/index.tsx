import { useEffect, useState } from "react";

type Props = {
  variant?: "success" | "warning" | "danger" | "info" | "default";
  children: React.ReactNode;
};

export default function Footnote({ variant = "default", children }: Props) {
  const [color, setColor] = useState<string>("sky");

  useEffect(() => {
    switch (variant) {
      case "success":
        setColor(
          "rounded-sm border p-1 border-green-700 dark:border-green-400 bg-green-700/10 dark:bg-green-400/10",
        );
        break;
      case "warning":
        setColor(
          "rounded-sm border p-1 border-amber-700 dark:border-amber-400 bg-amber-700/10 dark:bg-amber-400/10",
        );
        break;
      case "danger":
        setColor(
          "rounded-sm border p-1 border-rose-700 dark:border-rose-400 bg-rose-700/10 dark:bg-rose-400/10",
        );
        break;
      case "info":
        setColor(
          "rounded-sm border p-1 border-sky-700 dark:border-sky-400 bg-sky-700/10 dark:bg-sky-400/10",
        );
        break;
      case "default":
        setColor("");
        break;
    }
  }, [variant]);

  return (
    <div className={`${color} mt-4 h-fit w-fit text-sm italic`}>{children}</div>
  );
}
