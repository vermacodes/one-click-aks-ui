import { Change, diffTrimmedLines } from "diff";
import { useEffect, useState } from "react";
import { getUIStateColors } from "../../../defaults";
import { cn } from "../../../utils/cn";
import Container from "../../UserInterfaceComponents/Container";

type Props = {
  versionA: string;
  versionB: string;
  heading: string;
};

export default function DiffLines({ versionA, versionB, heading }: Props) {
  const [differences, setDifferences] = useState<Change[]>([]);

  useEffect(() => {
    setDifferences(diffTrimmedLines(versionA, versionB));
  }, [versionA, versionB]);

  // If there are no differences, don't render the component
  if (differences.length <= 1) {
    return (
      <Container title={heading}>
        <div className="w-full">No differences.</div>
      </Container>
    );
  }

  return (
    <Container title={heading}>
      <div className="w-full">
        {differences.map((part, index) => (
          <pre
            key={index}
            className={cn(
              "text-sm whitespace-pre-wrap",
              part.added &&
                getUIStateColors({ colors: "success", selected: true }),
              part.removed &&
                getUIStateColors({ colors: "danger", selected: true }),
            )}
          >
            {part.value}
          </pre>
        ))}
      </div>
    </Container>
  );
}
