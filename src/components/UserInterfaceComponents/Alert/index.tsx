import { useEffect, useState } from "react";
import { cn } from "../../../utils/cn"; // Adjust the import path as needed

type Props = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "success" | "warning" | "danger" | "info";
  children: React.ReactNode;
};

export default function Alert({ variant = "info", children, ...rest }: Props) {
  const [color, setColor] = useState<string>("");

  useEffect(() => {
    switch (variant) {
      case "success":
        setColor(
          "border-green-700 dark:border-green-400 bg-green-700/20 dark:bg-green-400/20",
        );
        break;
      case "warning":
        setColor(
          "border-amber-700 dark:border-amber-400 bg-amber-700/20 dark:bg-amber-400/20",
        );
        break;
      case "danger":
        setColor(
          "border-rose-700 dark:border-rose-400 bg-rose-700/20 dark:bg-rose-400/20",
        );
        break;
      case "info":
        setColor(
          "border-sky-700 dark:border-sky-400 bg-sky-700/20 dark:bg-sky-400/20",
        );
        break;
    }
  }, [variant]);

  return (
    <div
      {...rest} // Spread all additional props onto the div
      className={cn(
        color,
        "top-0 mb-4 rounded-sm border p-2",
        rest.className, // Include any custom className passed via props
      )}
    >
      {children}
    </div>
  );
}
