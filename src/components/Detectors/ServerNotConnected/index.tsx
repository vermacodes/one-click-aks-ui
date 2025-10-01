import { useEffect, useState } from "react";
import { TbFidgetSpinner } from "react-icons/tb";
import { Link } from "react-router-dom";
import { ServerHosting } from "../../../dataStructures";
import {
  defaultLinkTextStyle,
  getDefaultServerHosting,
} from "../../../defaults";
import { useManagedServer } from "../../../hooks/useManagedServer";
import { useServerStatus } from "../../../hooks/useServerStatus";
import Alert from "../../UserInterfaceComponents/Alert";

interface DetectorCondition {
  condition: () => boolean;
  component: JSX.Element | null;
  delay?: number; // milliseconds
}

export default function ServerNotConnected() {
  const [severHosting, setServerHosting] = useState<ServerHosting>(
    getDefaultServerHosting(),
  );
  const [delayedStates, setDelayedStates] = useState<Record<string, boolean>>(
    {},
  );
  const { data: serverStatus, isError } = useServerStatus();
  const { data: managedServer } = useManagedServer();

  useEffect(() => {
    const serverHostingFromLocalStorage = localStorage.getItem("serverHosting");
    if (
      serverHostingFromLocalStorage != undefined &&
      serverHostingFromLocalStorage !== ""
    ) {
      setServerHosting(JSON.parse(serverHostingFromLocalStorage));
    }
  }, []);

  // Handle delayed states at component level
  useEffect(() => {
    const timers: Record<string, NodeJS.Timeout> = {};

    const setDelayedState = (
      key: string,
      delay: number,
      condition: boolean,
    ) => {
      if (condition && !delayedStates[key]) {
        timers[key] = setTimeout(() => {
          setDelayedStates((prev) => ({ ...prev, [key]: true }));
        }, delay);
      } else if (!condition && delayedStates[key]) {
        setDelayedStates((prev) => ({ ...prev, [key]: false }));
      }
    };

    // Check conditions that need delays
    setDelayedState(
      "dns_sync",
      60000,
      managedServer?.status === "Running" && serverStatus?.status !== "OK",
    );
    setDelayedState(
      "deployment_failed",
      30000,
      managedServer?.status === "Failed" && serverStatus?.status !== "OK",
    );
    setDelayedState("fallback", 60000, true); // Always start fallback timer

    return () => {
      Object.values(timers).forEach((timer) => clearTimeout(timer));
    };
  }, [managedServer?.status, serverStatus?.status, delayedStates]);

  // Define detector conditions with delay flags
  const detectorConditions: DetectorCondition[] = [
    {
      condition: () => !isError && serverStatus?.status === "OK",
      component: null, // Don't show anything if server is OK
    },
    {
      condition: () => severHosting.environment === "docker",
      component: (
        <Alert variant="warning">
          <strong>⚠️ Server Not Connected:</strong> Your self-hosted server is
          not available. Check your{" "}
          <Link to="/settings" className={defaultLinkTextStyle}>
            Settings
          </Link>{" "}
          to make sure server is deployed and{" "}
          <a className="underline">endpoint</a> is correct.
        </Alert>
      ),
    },
    {
      condition: () =>
        managedServer === undefined || managedServer?.status === "Unregistered",
      component: (
        <Alert variant="warning">
          <strong>⚠️ Server Not Deployed:</strong> ACT Labs{" "}
          <a className="underline">requires user to deploy the server.</a> Goto{" "}
          <Link to="/settings" className={defaultLinkTextStyle}>
            Settings
          </Link>{" "}
          to register and deploy managed server or self-host on docker.
        </Alert>
      ),
    },
    {
      condition: () => managedServer?.status === "Deploying",
      component: (
        <Alert variant="info">
          <div className="flex items-center gap-2">
            <TbFidgetSpinner className="animate-spin" />
            <strong>Deploying Managed Server:</strong> Deployment is in
            progress. Page will auto reload once deployment completes.
          </div>
        </Alert>
      ),
    },
    {
      condition: () => managedServer?.status === "Destroyed",
      component: (
        <Alert variant="warning">
          <strong>⚠️ Managed Server Not Deployed:</strong> You have destroyed
          server manually. Please deploy again from{" "}
          <Link to="/settings" className={defaultLinkTextStyle}>
            Settings
          </Link>{" "}
          page.
        </Alert>
      ),
    },
    {
      condition: () =>
        managedServer?.status === "AutoDestroyed" &&
        managedServer?.autoCreate === true,
      component: (
        <Alert variant="info">
          <div className="flex items-center gap-2">
            <TbFidgetSpinner className="animate-spin" />
            <strong>Deploying Managed Server:</strong> Managed server was
            destroyed due to inactivity. Deploying again momentarily.
          </div>
        </Alert>
      ),
    },
    {
      condition: () =>
        managedServer?.status === "AutoDestroyed" &&
        managedServer?.autoCreate === false,
      component: (
        <Alert variant="warning">
          <strong>Managed Server Destroyed:</strong> Managed server was
          destroyed due to inactivity and auto-deploy is disabled. Deploy again
          from{" "}
          <Link to="/settings" className={defaultLinkTextStyle}>
            Settings
          </Link>
          .
        </Alert>
      ),
    },
    {
      condition: () =>
        managedServer?.status === "Running" && serverStatus?.status !== "OK",
      component: (
        <Alert variant="info">
          <div className="flex items-center gap-2">
            <TbFidgetSpinner className="animate-spin" />
            <strong>Waiting for DNS Sync:</strong> This can take several
            minutes. Please don't destroy the managed server.
          </div>
        </Alert>
      ),
      delay: 60000, // Show after 60 seconds to avoid premature DNS warnings
    },
    {
      condition: () =>
        managedServer?.status === "Registered" && serverStatus?.status !== "OK",
      component: (
        <Alert variant="info">
          <strong>☑️ Registration Completed:</strong> Managed server is
          registered, now deploying.
        </Alert>
      ),
    },
    {
      condition: () =>
        managedServer?.status === "Failed" && serverStatus?.status !== "OK",
      component: (
        <Alert variant="danger">
          <strong>⚠️ Managed Server Deployment Failed:</strong> Managed server
          deployment failed. Deploy manually from{" "}
          <Link to="/settings" className={defaultLinkTextStyle}>
            Settings
          </Link>
          .
        </Alert>
      ),
      delay: 30000, // Show after 30 seconds to avoid immediate error flash
    },
  ];

  // Render the first matching condition with delay handling
  const renderDetector = (): JSX.Element | null => {
    for (const { condition, component, delay } of detectorConditions) {
      const isConditionMet = condition();

      if (isConditionMet) {
        if (delay) {
          // Check if delayed state is ready
          const delayKey =
            delay === 60000
              ? "dns_sync"
              : delay === 30000
                ? "deployment_failed"
                : "unknown";
          const shouldShow = delayedStates[delayKey] || false;
          return shouldShow ? component : null;
        }
        return component;
      }
    }

    // Fallback with delay if needed
    const shouldShowFallback = delayedStates["fallback"] || false;

    return shouldShowFallback ? (
      <Alert variant="danger">
        <strong>🛑 Unexpected Error:</strong> Something unexpected happened.
        Engage Support.
      </Alert>
    ) : null;
  };
  return renderDetector();
}
