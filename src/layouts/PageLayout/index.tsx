import { useEffect, useRef } from "react";
import Detectors from "../../components/Detectors/Detectors";
import { cn } from "../../utils/cn";

type Props = {
  heading?: string;
  children: React.ReactNode;
};

export default function PageLayout({ heading, children }: Props) {
  const outerDivRef = useRef<null | HTMLDivElement>(null);
  const pageHeading = useRef<null | HTMLHeadingElement>(null);

  useEffect(() => {
    if (outerDivRef.current !== null) {
      outerDivRef.current.scrollIntoView();
    }
    if (pageHeading.current !== null) {
      pageHeading.current.focus(); // Focus the page heading
    }
  }, [heading]);

  return (
    <div ref={outerDivRef}>
      <Detectors />
      {heading !== undefined && (
        <div
          className={cn(
            "mt-1 flex items-center justify-between text-wrap",
            heading !== "" && "mb-4 border-b-2 border-slate-500",
          )}
        >
          <div className="flex items-center">
            <h2
              className="my-1 pb-4 text-xl md:text-4xl"
              tabIndex={-1}
              ref={pageHeading}
            >
              {heading}
            </h2>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
