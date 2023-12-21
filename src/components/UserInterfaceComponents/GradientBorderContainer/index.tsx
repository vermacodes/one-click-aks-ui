type Props = {
  children: React.ReactNode;
};

export default function GradientBorderContainer({ children }: Props) {
  return <div className="h-fit w-full rounded-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[.15rem]">{children}</div>;
}
