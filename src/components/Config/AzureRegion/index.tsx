import { useState } from "react";
import { useLab } from "../../../hooks/useLab";
import { useSetLogs } from "../../../hooks/useLogs";
import { usePreference, useSetPreference } from "../../../hooks/usePreference";
import { useGetStorageAccount } from "../../../hooks/useStorageAccount";
import Container from "../../UserInterfaceComponents/Container";
import DropdownSelect from "../../UserInterfaceComponents/DropdownSelect";
import FilterTextBox from "../../UserInterfaceComponents/FilterTextBox";

export default function AzureRegion() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  // az account list-locations --query "[?metadata.regionType!='Logical' && metadata.physicalLocation!=null].displayName" -o tsv | sed -e 's/^/"/' -e 's/$/"/' | paste -sd, -
  const azureRegions: string[] = [
    "East US",
    "East US 2",
    "South Central US",
    "West US 2",
    "West US 3",
    "Australia East",
    "Southeast Asia",
    "North Europe",
    "Sweden Central",
    "UK South",
    "West Europe",
    "Central US",
    "South Africa North",
    "Central India",
    "East Asia",
    "Japan East",
    "Korea Central",
    "Canada Central",
    "France Central",
    "Germany West Central",
    "Italy North",
    "Norway East",
    "Poland Central",
    "Switzerland North",
    "UAE North",
    "Brazil South",
    "Central US EUAP",
    "Israel Central",
    "Qatar Central",
    "Brazil US",
    "East US STG",
    "North Central US",
    "West US",
    "Jio India West",
    "East US 2 EUAP",
    "South Central US STG",
    "West Central US",
    "South Africa West",
    "Australia Central",
    "Australia Central 2",
    "Australia Southeast",
    "Japan West",
    "Jio India Central",
    "Korea South",
    "South India",
    "West India",
    "Canada East",
    "France South",
    "Germany North",
    "Norway West",
    "Switzerland West",
    "UK West",
    "UAE Central",
    "Brazil Southeast",
  ];

  const {
    data: preference,
    isLoading: loadingPreference,
    isFetching: fetchingPreference,
  } = usePreference();

  const { mutate: setPreference, isLoading: settingPreference } =
    useSetPreference();
  const { data: lab } = useLab();
  const { mutate: setLogs } = useSetLogs();

  const { data: storageAccount, isFetching: fetchingStorageAccount } =
    useGetStorageAccount();

  /**
   * Handles the click event.
   *
   * If a preference is set, it updates the preference's azureRegion and the lab template's location with the provided azureRegion.
   * It also updates the logs with the stringified lab template.
   *
   * @param {string} azureRegion - The azureRegion to set.
   */
  function handleOnClick(azureRegion: string) {
    if (preference !== undefined) {
      setPreference({
        ...preference,
        azureRegion: azureRegion,
      });
      if (lab && lab.template) {
        lab.template.resourceGroup.location = azureRegion;
      }
      setLogs({
        logs: JSON.stringify(lab?.template, null, 4),
      });
    }
  }

  /**
   * Function to render a search input field.
   *
   * @returns JSX.Element - The rendered search input field.
   */
  const renderSearchInput = () => {
    return (
      <div className="relative">
        <FilterTextBox
          value={searchTerm}
          onChange={setSearchTerm}
          aria-label="Azure Region Search"
          placeHolderText="Search for a region closer to you"
          customClasses="py-1 ring-1 ring-slate-500 hover:ring-sky-700 dark:hover:ring-sky-500 focus:ring-sky-700 dark:focus:ring-sky-500 border-0"
        />
      </div>
    );
  };

  /**
   * Function to render a heading.
   *
   * If preferences are loading, fetching, or being set, it renders a loading message.
   * Otherwise, it renders the current preference's azureRegion, or a prompt to add a region if no preference is set.
   *
   * @returns JSX.Element - The rendered heading.
   */
  const heading = () => {
    if (loadingPreference || fetchingPreference || settingPreference) {
      return (
        <p className="text-slate-900 dark:text-slate-100">Please wait...</p>
      );
    }
    return (
      <p className="text-slate-900 dark:text-slate-100">
        {preference ? preference.azureRegion : "Add a region."}
      </p>
    );
  };

  /**
   * Function to render an item.
   *
   * @param {PatchVersions} patchVersion - The patch version to render.
   * @returns JSX.Element - The rendered item.
   */
  const renderItem = (item: string) => {
    // Determine the classes to apply based on whether the current version matches the key
    const isActive = item === preference?.azureRegion;

    const baseClasses =
      "mt-1 w-full cursor-pointer items-center justify-between rounded p-1";
    const activeClasses =
      "bg-emerald-700 text-white dark:bg-emerald-400 dark:text-slate-900";
    const hoverClasses =
      "hover:bg-sky-700 hover:text-white dark:hover:bg-sky-500 dark:hover:text-slate-900";
    const inactiveClasses = "text-slate-900 dark:text-slate-100";

    const containerClasses = isActive
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${inactiveClasses} ${hoverClasses}`;

    return <div className={containerClasses}>{item}</div>;
  };

  //const renderItem = (item: string) => <p>{item}</p>;

  return (
    <Container title="Azure Region" collapsible={true}>
      <div
        className={`gap-x-reverse flex items-center justify-end gap-x-2 py-2 ${
          (fetchingStorageAccount ||
            storageAccount === undefined ||
            storageAccount.name === "") &&
          " text-slate-400"
        }`}
      >
        <DropdownSelect
          heading={heading()}
          disabled={
            loadingPreference || fetchingPreference || settingPreference
          }
          search={renderSearchInput()}
          renderItem={renderItem}
          items={azureRegions.filter((item) =>
            item.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          onItemClick={handleOnClick}
          height="h-60"
        />
      </div>
      <p className="text-xs">
        Azure region where your labs will be created. We've not tested all
        regions, if you see issues please let us know.
      </p>
    </Container>
  );
}
