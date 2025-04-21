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

export function getUIStateColors(
  state: "hover" | "selected" | "default" | "disabled",
): string {
  let styles = "";
  if (state === "hover") {
    styles = "hover:bg-slate-200 dark:hover:bg-slate-800";
  }
  if (state === "selected") {
    styles = "bg-sky-200 dark:bg-sky-800";
  }
  if (state === "default") {
    styles = "bg-slate-50 dark:bg-slate-900";
  }
  if (state === "disabled") {
    styles = "bg-slate-200 dark:bg-slate-800 cursor-not-allowed";
  }

  return styles;
}

export const defaultUIPrimaryTextColor = "text-sky-700 dark:text-sky-400";
