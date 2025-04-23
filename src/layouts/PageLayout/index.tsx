import { useEffect, useRef } from "react";
import Detectors from "../../components/Detectors/Detectors";

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
          className={`${
            heading !== ""
              ? "mb-4 mt-[1px] border-b-2 border-slate-500 "
              : "mt-[1px]"
          } flex items-center justify-between text-wrap`}
        >
          <div className="flex items-center">
            <h2
              className="pb-4 text-xl md:text-4xl"
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
