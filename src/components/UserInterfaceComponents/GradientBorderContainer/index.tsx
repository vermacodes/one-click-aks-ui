type Props = {
	children: React.ReactNode;
};

export default function GradientBorderContainer({ children }: Props) {
	return (
		<div className="group relative">
			<div className="absolute h-full w-full rounded-md bg-linear-to-r from-indigo-600 from-10% via-sky-600 via-30% to-purple-600 to-90% blur-xs transition duration-1000 group-hover:blur-md group-hover:duration-200"></div>
			<div className="relative">{children}</div>
		</div>
	);
}
