import { useGlobalStateContext } from "../../../../context/GlobalStateContext";
import Container from "../../../UserInterfaceComponents/Container";
import AroClusterVersion from "../AroClusterVersion";

export default function AroCluster() {
  const { lab } = useGlobalStateContext();

  // If lab or its template or aroClusters is undefined or empty, return null
  if (!lab?.template?.aroClusters?.length) {
    return null;
  }

  return (
    <>
      {lab.template.aroClusters.map((cluster, index) => (
        <Container
          key={index + "cluster"}
          title={`ARO Cluster ${index + 1}`}
          additionalClasses="outline outline-slate-300 dark:outline-slate-700 flex"
          additionalContainerBodyClasses="flex flex-col gap-4"
          hoverEffect={false}
          collapsible={true}
        >
          <Container
            key={index + "features"}
            title="Features"
            additionalClasses="outline outline-slate-300 dark:outline-slate-700 flex"
            additionalContainerBodyClasses="flex flex-col gap-4"
            hoverEffect={false}
            collapsible={true}
          >
            <div className={`mt-4 flex flex-wrap items-center gap-x-2 gap-y-2`}>
              <AroClusterVersion index={index} />
            </div>
          </Container>
        </Container>
      ))}
    </>
  );
}
