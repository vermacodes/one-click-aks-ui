import { TbFidgetSpinner } from "react-icons/tb";
import RootErrorBoundary from "../../ErrorBoundaries/RootErrorBoundary";
import Button from "../../UserInterfaceComponents/Button";

interface AuthenticatingScreenProps {
  error?: string;
}

export function AuthenticatingScreen({ error }: AuthenticatingScreenProps) {
  if (error) {
    return (
      <RootErrorBoundary>
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="mx-4 w-full max-w-md rounded-lg bg-slate-100 p-8 shadow-md ring-1 ring-slate-300 dark:bg-slate-900 dark:ring-slate-700">
            <div className="text-center">
              <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
                Authentication Error
              </h2>
              <p className="mb-4 text-rose-700 dark:text-rose-400">{error}</p>
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </RootErrorBoundary>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="mx-4 w-full max-w-md rounded-lg bg-slate-100 p-8 shadow-md ring-1 ring-slate-300 dark:bg-slate-900 dark:ring-slate-700">
        <div className="text-center">
          <TbFidgetSpinner className="mx-auto mb-4 h-8 w-8 animate-spin text-sky-700 dark:text-sky-400" />
          <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
            Authenticating...
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Please wait while we verify your credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
