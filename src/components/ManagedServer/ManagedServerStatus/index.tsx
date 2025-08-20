import { ReactNode } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaTimesCircle,
} from "react-icons/fa";
import { ManagedServer } from "../../../dataStructures";

type Props = {
  managedServer: ManagedServer;
};

export default function ManagedServerStatus({ managedServer }: Props) {
  function render(status: ManagedServer["status"]): ReactNode {
    switch (status) {
      case "AutoDestroyed":
        return (
          <div className="flex items-center gap-1">
            <FaCheckCircle className="text-purple-700 dark:text-purple-400" />
            Auto Destroyed
          </div>
        );
      case "Deployed":
        return (
          <div className="flex items-center gap-1">
            <FaCheckCircle className="text-green-600 dark:text-green-400" />
            Deployed
          </div>
        );
      case "Deploying":
        return (
          <div className="flex items-center gap-1">
            <FaSpinner className="animate-spin text-blue-600 dark:text-blue-400" />
            Deploying
          </div>
        );
      case "Destroyed":
        return (
          <div className="flex items-center gap-1">
            <FaExclamationCircle className="text-amber-700 dark:text-amber-400" />
            User Destroyed
          </div>
        );
      case "Destroying":
        return (
          <div className="flex items-center gap-1">
            <FaSpinner className="animate-spin text-gray-500 dark:text-gray-400" />
            Destroying
          </div>
        );
      case "Failed":
        return (
          <div className="flex items-center gap-1">
            <FaTimesCircle className="text-red-600 dark:text-red-400" />
            Failed
          </div>
        );
      case "Registered":
        return (
          <div className="flex items-center gap-1">
            <FaCheckCircle className="text-blue-700 dark:text-blue-400" />
            Registered
          </div>
        );
      case "Running":
        return (
          <div className="flex items-center gap-1">
            <FaCheckCircle className="text-green-700 dark:text-green-400" />
            Running
          </div>
        );
      case "Starting":
        return (
          <div className="flex items-center gap-1">
            <FaSpinner className="animate-spin text-blue-600 dark:text-blue-400" />
            Starting
          </div>
        );
      case "Stopped":
        return (
          <div className="flex items-center gap-1">
            <FaCheckCircle className="text-gray-500 dark:text-gray-400" />
            Stopped
          </div>
        );
      case "Stopping":
        return (
          <div className="flex items-center gap-1">
            <FaSpinner className="animate-spin text-gray-500 dark:text-gray-400" />
            Stopping
          </div>
        );
      case "Succeeded":
        return (
          <div className="flex items-center gap-1">
            <FaCheckCircle className="text-green-600 dark:text-green-400" />
            Succeeded
          </div>
        );
      case "Unregistered":
        return (
          <div className="flex items-center gap-1">
            <FaCheckCircle className="text-gray-400 dark:text-gray-500" />
            Unregistered
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1">
            <FaExclamationCircle className="text-gray-700 dark:text-gray-500" />
            Unknown
          </div>
        );
    }
  }

  return (
    <div className="flex flex-col justify-center gap-2 px-2">
      <p className="font-bold">Status</p>
      {render(managedServer.status)}
    </div>
  );
}
