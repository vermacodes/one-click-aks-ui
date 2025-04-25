import { TypeOptions } from "react-toastify";

interface User {
  name: string;
  type: string;
}

export type UserType = User;

interface Tenant {
  tenantId: string;
}

export type TenantType = Tenant[];

export type AccountType = {
  environmentName: string;
  homeTenantId: string;
  id: string;
  isDefault: boolean;
  managedByTenants: TenantType;
  name: string;
  state: string;
  tenantId: string;
  user: UserType;
};

interface Properties {
  provisioningState: string;
}

interface ResourceGroup {
  id: string;
  location: string;
  managedBy: string;
  name: string;
  properties: Properties;
  tags: string;
  type: string;
}

export type ResourceGroupType = ResourceGroup;

interface StorageAccount {
  id: string;
  name: string;
}

export type StorageAccountType = StorageAccount;

interface BlobContainer {
  name: string;
}

export type BlobContainerType = BlobContainer;

interface StateConfiguration {
  resourceGroup: ResourceGroupType;
  storageAccount: StorageAccountType;
  blobContainer: BlobContainerType;
}

export type StateConfigurationType = StateConfiguration;

interface StateConfigurationStatus {
  isStateConfigured: boolean;
}

export type StateConfigurationStatusType = StateConfigurationStatus;

interface ClusterConfiguration {
  networkPlugin: "azure" | "kubenet";
  networkPolicy: "azure" | "calico" | "null";
}

export type ClusterConfigurationType = ClusterConfiguration;

interface tfvarResourceGroup {
  location: string;
}

export type TfvarResourceGroupType = tfvarResourceGroup;

interface tfvarVirtualNetwork {
  addressSpace: string[];
}

export type TfvarVirtualNetworkType = tfvarVirtualNetwork[];

interface tfvarSubnet {
  name: string;
  addressPrefixes: string[];
}

export type TfvarSubnetType = tfvarSubnet[];

export type TfvarNetworkSecurityGroupType = {};

export type TfvarServiceMeshType = {
  enabled: boolean;
  mode: "Istio";
  internalIngressGatewayEnabled: boolean;
  externalIngressGatewayEnabled: boolean;
};

export type TfvarAddonsType = {
  appGateway: boolean;
  microsoftDefender: boolean;
  virtualNode: boolean;
  httpApplicationRouting: boolean;
  serviceMesh: TfvarServiceMeshType;
};

export type TfvarDefaultNodepoolType = {
  enableAutoScaling: boolean;
  minCount: number;
  maxCount: number;
  vmSize: string;
  onlyCriticalAddonsEnabled: boolean;
  osSku: string;
};

export type TfvarKubernetesClusterType = {
  kubernetesVersion: string;
  networkPlugin: "azure" | "kubenet";
  networkPolicy: "azure" | "calico" | "null";
  networkPluginMode: "overlay" | "null";
  outboundType: "loadBalancer" | "userDefinedRouting";
  privateClusterEnabled: "true" | "false";
  workloadIdentityEnabled: boolean;
  oidcIssuerEnabled: boolean;
  addons: TfvarAddonsType;
  defaultNodePool: TfvarDefaultNodepoolType;
};

interface tfvarJumpserver {
  adminUsername: string;
  adminPassword: string;
}

export type TfvarJumpserverType = tfvarJumpserver[];

export type TfvarFirewallType = {
  skuName: string;
  skuTier: string;
};

export type TfvarContainerRegistryType = {};

export type TfvarAppGatewayType = {};

export type TfvarConfigType = {
  resourceGroup: TfvarResourceGroupType;
  kubernetesClusters: TfvarKubernetesClusterType[];
  virtualNetworks: TfvarVirtualNetworkType;
  subnets: TfvarSubnetType;
  networkSecurityGroups: TfvarNetworkSecurityGroupType[];
  jumpservers: TfvarJumpserverType;
  firewalls: TfvarFirewallType[];
  containerRegistries: TfvarContainerRegistryType[];
  appGateways: TfvarAppGatewayType[];
};

export type BlobType = {
  name: string;
  url: string;
};

export type ActionStatusType = {
  inProgress: boolean;
};

export type LogsStreamType = {
  logs: string;
};

export type TerraformWorkspace = {
  name: string;
  selected: boolean;
};

export type Preference = {
  azureRegion: string;
  terminalAutoScroll: boolean;
};

// type LabCategory =
//   | {
//       category: "public";
//       type: "publiclab";
//     }
//   | {
//       category: "private";
//       type: "privatelab" | "challengelab" | "challenge";
//     }
//   | {
//       category: "protected";
//       type: "readinesslab" | "assignment" | "mockcase";
//     };

export const LAB_CATEGORY = {
  PUBLIC: "public",
  PRIVATE: "private",
  PROTECTED: "protected",
} as const;

type ObjectValues<T> = T[keyof T];

export type LabCategory = ObjectValues<typeof LAB_CATEGORY>;

export const LAB_TYPE = {
  TEMPLATE: "template",
  PUBLIC: "publiclab",
  PRIVATE: "privatelab",
  CHALLENGE: "challenge",
  CHALLENGELAB: "challengelab",
  READINESS: "readinesslab",
  ASSIGNMENT: "assignment",
  MOCKCASE: "mockcase",
} as const;

export type LabType = ObjectValues<typeof LAB_TYPE>;

export type Lab = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  template: TfvarConfigType | undefined;
  extendScript: string;
  message: string;
  category: LabCategory;
  type: LabType;
  createdBy: string;
  createdOn: string;
  updatedBy: string;
  updatedOn: string;
  owners: string[];
  editors: string[];
  viewers: string[];
  rbacEnforcedProtectedLab: boolean;
  isPublished: boolean;
  versionId: string;
  isCurrentVersion: boolean;
  supportingDocumentId: string;
};

export type Assignment = {
  assignmentId: string;
  userId: string;
  displayName: string;
  labId: string;
  labName: string;
  createdBy: string;
  deletedBy: string;
  createdAt: string;
  startedAt: string;
  completedAt: string;
  deletedAt: string;
  status: "Created" | "InProgress" | "Completed" | "Deleted" | "Cancelled";
};

export type BulkAssignment = {
  userIds: string[];
  labIds: string[];
};

export type Challenge = {
  challengeId: string;
  userId: string;
  labId: string;
  createdBy: string;
  createdOn: string;
  acceptedOn: string;
  completedOn: string;
  status: "created" | "accepted" | "completed" | "failed";
};

export type Privilege = {
  user: string;
  isAdmin: boolean;
  isMentor: boolean;
};

// export type KubernetesOrchestrators = {
//   id: string;
//   name: string;
//   orchestrators: Orchestrator[];
//   type: string;
// };

export type KubernetesOrchestrators = {
  values: Value[];
};

export type Orchestrator = {
  default: boolean | null;
  isPreview: boolean | null;
  orchestratorType: OrchestratorType;
  orchestratorVersion: string;
  upgrades: Upgrade[] | null;
};

export type OrchestratorType = {
  Kubernetes: "Kubernetes";
};

export type Upgrade = {
  isPreview: boolean | null;
  orchestratorType: OrchestratorType;
  orchestratorVersion: string;
};

export type PatchVersions = {
  [key: string]: {
    upgrades: string[];
  };
};

export type Capabilities = {
  SupportPlan: string[];
};

export type Value = {
  capabilities: Capabilities;
  isPreview: boolean | null;
  patchVersions: PatchVersions;
  version: string;
};

export type ServerStatus = {
  status: "" | "OK";
  version: string;
};

export type LoginStatus = {
  isLoggedIn: boolean;
};

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "primary-text"
  | "secondary-outline"
  | "danger-outline"
  | "success-outline"
  | "primary-text"
  | "secondary-text"
  | "danger-text"
  | "success-text"
  | "primary-icon"
  | "secondary-icon"
  | "danger-icon"
  | "text";

export type ButtonContainerObj = {
  id: string;
  order: number;
  button: React.ReactNode;
};

export type Profile = {
  objectId: string;
  displayName: string;
  userPrincipal: string;
  roles: string[];
};

export type ProfileMutation = {
  userPrincipal: string;
  role: string;
};

export type GraphData = {
  businessPhones: string[];
  displayName: string;
  givenName: string;
  jobTitle: string;
  mail: string;
  mobilePhone: string;
  officeLocation: string;
  preferredLanguage: string;
  surname: string;
  userPrincipalName: string;
  id: string;
};

export type DeploymentStatus =
  | "Init In Progress"
  | "Init Failed"
  | "Init Completed"
  | "Plan In Progress"
  | "Plan Failed"
  | "Plan Completed"
  | "Deployment In Progress"
  | "Deployment Failed"
  | "Deployment Completed"
  | "Deployment Not Started"
  | "Destroy In Progress"
  | "Destroy Completed"
  | "Destroy Failed";

export type DeploymentType = {
  deploymentId: string;
  deploymentUserId: string;
  deploymentWorkspace: string;
  deploymentSubscriptionId: string;
  deploymentStatus: DeploymentStatus;
  deploymentLab: Lab;
  deploymentAutoDelete: boolean;
  deploymentLifespan: number;
  deploymentAutoDeleteUnixTime: number;
};

export type TerraformOperation = {
  operationId: string;
  inProgress: boolean;
  status: DeploymentStatus;
};

export type ServerNotification = {
  id: string;
  type: TypeOptions;
  message: string;
  autoClose: number;
};

export type TerraformOperationType =
  | "init"
  | "plan"
  | "apply"
  | "destroy"
  | "delete"
  | "extend-validate"
  | "extend-apply"
  | "extend-destroy";

export type ManagedServer = {
  endpoint: string;
  status:
    | "AutoDestroyed"
    | "Deployed"
    | "Deploying"
    | "Destroyed"
    | "Destroying"
    | "Failed"
    | "Registered"
    | "Running"
    | "Starting"
    | "Stopped"
    | "Stopping"
    | "Succeeded"
    | "Unknown"
    | "Unregistered"
    | "Updating";
  region: string;
  userPrincipalId: string;
  userPrincipalName: string;
  userAlias: string;
  managedIdentityResourceId: string;
  managedIdentityClientId: string;
  managedIdentityPrincipalId: string;
  subscriptionId: string;
  resourceGroup: string;
  logLevel: "0" | "-4";
  lastActivityTime: string;
  destroyedAtTime: string;
  deployedAtTime: string;
  autoCreate: boolean;
  autoDestroy: boolean;
  inactivityDurationInSeconds: number;
  version: string;
};

export type ServerHosting = {
  environment: "docker" | "azure";
  endpoint: string;
};

export type Theme = "system" | "dark" | "light";
