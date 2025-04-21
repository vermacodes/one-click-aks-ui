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
				setColor("border-green-500 bg-green-500");
				break;
			case "warning":
				setColor("border-amber-500 bg-amber-500");
				break;
			case "danger":
				setColor("border-rose-500 bg-rose-500");
				break;
			case "info":
				setColor("border-sky-500 bg-sky-500");
				break;
		}
	}, [variant]);

	return <div className={`${color} top-0 mt-2 rounded-sm border bg-opacity-20 p-2`}>{children}</div>;
}
