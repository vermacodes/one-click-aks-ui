import {
  Lab,
  ServerHosting,
  ServerNotification,
  TerraformOperation,
  TfvarAddonsType,
  TfvarAppGatewayType,
  TfvarConfigType,
  TfvarContainerRegistryType,
  TfvarDefaultNodepoolType,
  TfvarFirewallType,
  TfvarKubernetesClusterType,
  TfvarServiceMeshType,
} from "./dataStructures";
import { cn } from "./utils/cn";

const defaultFirewall: TfvarFirewallType = {
  skuName: "AZFW_VNet",
  skuTier: "Standard",
};
export function getDefaultFirewall(): TfvarFirewallType {
  return structuredClone(defaultFirewall);
}

const defaultContainerRegistry: TfvarContainerRegistryType = {};
export function getDefaultContainerRegistry(): TfvarContainerRegistryType {
  return structuredClone(defaultContainerRegistry);
}

const defaultAppGateways: TfvarAppGatewayType = {};
export function getDefaultAppGateways(): TfvarAppGatewayType {
  return structuredClone(defaultAppGateways);
}

const defaultServiceMesh: TfvarServiceMeshType = {
  enabled: false,
  mode: "Istio",
  internalIngressGatewayEnabled: false,
  externalIngressGatewayEnabled: false,
};
export function getDefaultServiceMesh(): TfvarServiceMeshType {
  return structuredClone(defaultServiceMesh);
}

const defaultAKSAddons: TfvarAddonsType = {
  appGateway: false,
  microsoftDefender: false,
  virtualNode: false,
  httpApplicationRouting: false,
  serviceMesh: defaultServiceMesh,
};
export function getDefaultAKSAddons(): TfvarAddonsType {
  return structuredClone(defaultAKSAddons);
}

const defaultNodePool: TfvarDefaultNodepoolType = {
  enableAutoScaling: false,
  minCount: 1,
  maxCount: 1,
  vmSize: "Standard_D2_v5",
  onlyCriticalAddonsEnabled: false,
  osSku: "Ubuntu",
};
export function getDefaultNodePool(): TfvarDefaultNodepoolType {
  return structuredClone(defaultNodePool);
}

const defaultKubernetesCluster: TfvarKubernetesClusterType = {
  kubernetesVersion: "",
  networkPlugin: "kubenet",
  networkPolicy: "null",
  networkPluginMode: "null",
  outboundType: "loadBalancer",
  privateClusterEnabled: "false",
  addons: defaultAKSAddons,
  defaultNodePool: defaultNodePool,
  oidcIssuerEnabled: false,
  workloadIdentityEnabled: false,
};

export function getDefaultKubernetesCluster(): TfvarKubernetesClusterType {
  return structuredClone(defaultKubernetesCluster);
}

const defaultTfvarConfig: TfvarConfigType = {
  resourceGroup: {
    location: "East US",
  },
  kubernetesClusters: [defaultKubernetesCluster],
  virtualNetworks: [
    {
      addressSpace: ["10.1.0.0/16"],
    },
  ],
  subnets: [
    {
      addressPrefixes: ["10.1.1.0/24"],
      name: "AzureFirewallSubnet",
    },
    {
      addressPrefixes: ["10.1.2.0/24"],
      name: "JumpServerSubnet",
    },
    {
      addressPrefixes: ["10.1.3.0/24"],
      name: "KubernetesSubnet",
    },
    {
      addressPrefixes: ["10.1.4.0/24"],
      name: "AppGatewaySubnet",
    },
    {
      addressPrefixes: ["10.1.5.0/24"],
      name: "AROMasterSubnet",
    },
    {
      addressPrefixes: ["10.1.6.0/24"],
      name: "AROWorkerSubnet",
    },
    {
      addressPrefixes: ["10.1.7.0/24"],
      name: "KubernetesVirtualNodeSubnet",
    },
  ],
  networkSecurityGroups: [{}],
  jumpservers: [
    {
      adminUsername: "aksadmin",
      adminPassword: "Password1234!",
    },
  ],
  firewalls: [],
  containerRegistries: [],
  appGateways: [],
};
export function getDefaultTfvarConfig(): TfvarConfigType {
  return structuredClone(defaultTfvarConfig);
}

const defaultLab: Lab = {
  id: "",
  name: "",
  description: "",
  tags: [""],
  category: "private",
  type: "privatelab",
  template: defaultTfvarConfig,
  extendScript: "",
  message: "",
  createdBy: "",
  updatedBy: "",
  createdOn: "",
  updatedOn: "",
  owners: [],
  editors: [],
  viewers: [],
  rbacEnforcedProtectedLab: false,
  isPublished: false,
  versionId: "",
  isCurrentVersion: true,
  supportingDocumentId: "",
};
export function getDefaultLab(): Lab {
  return structuredClone(defaultLab);
}

const defaultTerraformOperation: TerraformOperation = {
  inProgress: false,
  operationId: "",
  status: "Deployment Not Started",
};
export function getDefaultTerraformOperation(): TerraformOperation {
  return structuredClone(defaultTerraformOperation);
}

const defaultServerNotification: ServerNotification = {
  id: "",
  message: "",
  type: "info",
  autoClose: 0,
};
export function getDefaultServerNotification(): ServerNotification {
  return structuredClone(defaultServerNotification);
}

const defaultServerHosting: ServerHosting = {
  endpoint: "",
  environment: "azure",
};
export function getDefaultServerHosting(): ServerHosting {
  return structuredClone(defaultServerHosting);
}

export const defaultScrollbarStyle =
  "scrollbar-thin scrollbar-track-slate-400 scrollbar-thumb-slate-600 scrollbar-thumb-rounded-full dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-400";

export const defaultScrollbarOnContainerStyle =
  "scrollbar-thin scrollbar-track-slate-300 scrollbar-thumb-slate-500 scrollbar-thumb-rounded-full dark:scrollbar-track-slate-800 dark:scrollbar-thumb-slate-500";

/**
 * Returns the appropriate UI state colors based on the provided state.
 *
 * @param options - An object containing the following optional properties:
 *   - colors: The color scheme to use. Defaults to "default".
 *   - disabled: Whether the element is disabled. Defaults to `false`.
 *   - hover: Whether the hover state is active. Defaults to `false`.
 *   - selected: Whether the selected state is active. Defaults to `false`.
 *   - inverted: Whether the inverted state is active. Defaults to `false`.
 * @returns A string containing the Tailwind CSS classes for the specified state.
 */
export function getUIStateColors({
  colors = "default",
  disabled = false,
  hover = false,
  selected = false,
  inverted = false,
}: {
  colors?:
    | "default"
    | "primary"
    | "secondary"
    | "danger"
    | "warning"
    | "success"
    | "dark";
  disabled?: boolean;
  hover?: boolean;
  selected?: boolean;
  inverted?: boolean;
} = {}): string {
  // Define static class mappings for each color scheme
  const colorClasses = {
    default: {
      base: "bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-slate-50",
      baseHover: "hover:bg-slate-200 dark:hover:bg-slate-800",
      selected:
        "bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-slate-50",
      selectedHover: "hover:bg-slate-200/80 dark:hover:bg-slate-800/80",
      disabled:
        "bg-slate-200/50 dark:bg-slate-800/50 cursor-not-allowed text-slate-950 dark:text-slate-50",
      inverted:
        "bg-slate-950 dark:bg-slate-50 text-slate-50 dark:text-slate-950",
      invertedHover:
        "hover:bg-slate-950/80 dark:hover:bg-slate-50/80 text-slate-50 dark:text-slate-950",
    },
    primary: {
      base: "bg-sky-700 text-slate-50 dark:bg-sky-400 dark:text-slate-950",
      baseHover: "hover:bg-sky-800 dark:hover:bg-sky-300",
      selected: "bg-sky-200 dark:bg-sky-800 text-slate-950 dark:text-slate-50",
      selectedHover: "hover:bg-sky-200/80 dark:hover:bg-sky-800/80",
      disabled:
        "bg-sky-200/50 dark:bg-sky-800/50 cursor-not-allowed text-slate-950 dark:text-slate-50",
      inverted: "bg-sky-950 dark:bg-sky-50 text-sky-50 dark:text-sky-950",
      invertedHover:
        "hover:bg-sky-950/80 dark:hover:bg-sky-50/80 text-sky-50 dark:text-sky-950",
    },
    secondary: {
      base: "bg-slate-700 text-slate-50 dark:bg-slate-400 dark:text-slate-950",
      baseHover: "hover:bg-slate-800 dark:hover:bg-slate-300",
      selected:
        "bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-slate-50",
      selectedHover: "hover:bg-slate-200/80 dark:hover:bg-slate-800/80",
      disabled:
        "bg-slate-200/50 dark:bg-slate-800/50 cursor-not-allowed text-slate-950 dark:text-slate-50",
      inverted:
        "bg-slate-950 dark:bg-slate-50 text-slate-50 dark:text-slate-950",
      invertedHover:
        "hover:bg-slate-950/80 dark:hover:bg-slate-50/80 text-slate-50 dark:text-slate-950",
    },
    danger: {
      base: "bg-rose-700 text-slate-50 dark:bg-rose-300 dark:text-slate-950",
      baseHover: "hover:bg-rose-800 dark:hover:bg-rose-200",
      selected:
        "bg-rose-200 dark:bg-rose-800 text-slate-950 dark:text-slate-50",
      selectedHover: "hover:bg-rose-200/80 dark:hover:bg-rose-800/80",
      disabled:
        "bg-rose-200/50 dark:bg-rose-800/50 cursor-not-allowed text-slate-950 dark:text-slate-50",
      inverted: "bg-rose-950 dark:bg-rose-50 text-rose-50 dark:text-rose-950",
      invertedHover:
        "hover:bg-rose-950/80 dark:hover:bg-rose-50/80 text-rose-50 dark:text-rose-950",
    },
    warning: {
      base: "bg-amber-700 text-slate-50 dark:bg-amber-400 dark:text-slate-950",
      baseHover: "hover:bg-amber-800 dark:hover:bg-amber-300",
      selected:
        "bg-amber-200 dark:bg-amber-800 text-slate-950 dark:text-slate-50",
      selectedHover: "hover:bg-amber-200/80 dark:hover:bg-amber-800/80",
      disabled:
        "bg-amber-200/50 dark:bg-amber-800/50 cursor-not-allowed text-slate-950 dark:text-slate-50",
      inverted:
        "bg-amber-950 dark:bg-amber-50 text-amber-50 dark:text-amber-950",
      invertedHover:
        "hover:bg-amber-950/80 dark:hover:bg-amber-50/80 text-amber-50 dark:text-amber-950",
    },
    success: {
      base: "bg-green-700 text-slate-50 dark:bg-green-400 dark:text-slate-950",
      baseHover: "hover:bg-green-800 dark:hover:bg-green-300",
      selected:
        "bg-green-200 dark:bg-green-800 text-slate-950 dark:text-slate-50",
      selectedHover: "hover:bg-green-200/80 dark:hover:bg-green-800/80",
      disabled:
        "bg-green-200/50 dark:bg-green-800/50 cursor-not-allowed text-slate-950 dark:text-slate-50",
      inverted:
        "bg-green-950 dark:bg-green-50 text-green-50 dark:text-green-950",
      invertedHover:
        "hover:bg-green-950/80 dark:hover:bg-green-50/80 text-green-50 dark:text-green-950",
    },
    dark: {
      base: "bg-slate-950 dark:bg-slate-950 text-slate-50 dark:text-slate-50",
      baseHover: "hover:bg-slate-950/80 dark:hover:bg-slate-950/80",
      selected:
        "bg-slate-800 dark:bg-slate-800 text-slate-50 dark:text-slate-50",
      selectedHover:
        "hover:bg-slate-800/80 dark:hover:bg-slate-800/80 text-slate-50 dark:text-slate-50",
      disabled:
        "bg-slate-800/50 dark:bg-slate-800/50 cursor-not-allowed text-slate-50 dark:text-slate-50",
      inverted:
        "bg-slate-50 dark:bg-slate-50 text-slate-950 dark:text-slate-950",
      invertedHover:
        "hover:bg-slate-50/80 dark:hover:bg-slate-50/80 text-slate-950 dark:text-slate-950",
    },
  };

  // Get the classes for the specified color scheme
  const colorScheme = colorClasses[colors] || colorClasses.default;

  let styles = colorScheme.base;

  // Apply styles based on the state
  if (selected && !disabled) {
    styles = cn(styles, colorScheme.selected);
  }
  if (hover && !disabled) {
    styles = cn(styles, colorScheme.baseHover);
  }

  if (selected && hover && !disabled) {
    styles = cn(styles, colorScheme.selectedHover);
  }

  if (inverted) {
    styles = cn(styles, colorScheme.inverted);
  }

  if (inverted && hover && !disabled) {
    styles = cn(styles, colorScheme.invertedHover);
  }

  if (disabled) {
    styles = cn(styles, colorScheme.disabled);
  }

  return styles;
}

export const defaultUIPrimaryTextColor = "text-sky-700 dark:text-sky-400";
export const defaultLinkTextStyle = "text-sky-700 underline dark:text-sky-400";
