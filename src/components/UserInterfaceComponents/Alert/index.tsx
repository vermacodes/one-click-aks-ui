import { useEffect, useState } from "react";

type Props = {
  variant?: "success" | "warning" | "danger" | "info";
  children: React.ReactNode;
};

export default function Alert({ variant = "info", children }: Props) {
  const [color, setColor] = useState<string>("sky");

  useEffect(() => {
    switch (variant) {
      case "success":
        setColor(
          "border-green-700 dark:border-green-400 bg-green-700/10 dark:bg-green-400/10",
        );
        break;
      case "warning":
        setColor(
          "border-amber-700 dark:border-amber-400 bg-amber-700/10 dark:bg-amber-400/10",
        );
        break;
      case "danger":
        setColor(
          "border-rose-700 dark:border-rose-400 bg-rose-700/10 dark:bg-rose-400/10",
        );
        break;
      case "info":
        setColor(
          "border-sky-700 dark:border-sky-400 bg-sky-700/10 dark:bg-sky-400/10",
        );
        break;
    }
  }, [variant]);

  return (
    <div className={`${color} bg-opacity-20 top-0 mt-2 rounded-sm border p-2`}>
      {children}
    </div>
  );
}
