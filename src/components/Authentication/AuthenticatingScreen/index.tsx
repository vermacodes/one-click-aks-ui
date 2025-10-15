import { TbFidgetSpinner } from "react-icons/tb";
import RootErrorBoundary from "../../ErrorBoundaries/RootErrorBoundary";

interface AuthenticatingScreenProps {
  error?: string;
}

export function AuthenticatingScreen({ error }: AuthenticatingScreenProps) {
  if (error) {
    return (
      <RootErrorBoundary>
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full mx-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Authentication Error
              </h2>
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </RootErrorBoundary>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full mx-4">
        <div className="text-center">
          <TbFidgetSpinner className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Authenticating...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we verify your credentials.
          </p>
        </div>
      </div>
    </div>
  );
}