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
				setColor("green");
				break;
			case "warning":
				setColor("amber");
				break;
			case "danger":
				setColor("rose");
				break;
			case "info":
				setColor("sky");
				break;
		}
	}, [variant]);

	return (
		<div className={`top-0 mt-2 flex rounded border border-${color}-500 bg-${color}-500 bg-opacity-20 p-2`}>
			{children}
		</div>
	);
}
