import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRegisterSubscription } from "../../../../../hooks/useManagedServer";
import Button from "../../../../UserInterfaceComponents/Button";
import Input from "../../../../UserInterfaceComponents/Input";

const ManagedServerRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    userAlias: "",
    userPrincipalId: "",
    subscriptionId: "",
    tenantId: "",
  });

  const { mutateAsync: registerServer, isLoading: isRegistering } =
    useRegisterSubscription();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const response = toast.promise(registerServer(formData), {
      pending: "Registering managed server...",
      success: {
        render() {
          setFormData({
            userAlias: "",
            userPrincipalId: "",
            subscriptionId: "",
            tenantId: "",
          });
          return "Server registered successfully!";
        },
        autoClose: 2000,
      },
      error: {
        render({ data }: any) {
          return (
            data?.response?.data?.message ||
            "Failed to register server. Please try again."
          );
        },
        autoClose: 5000,
      },
    });

    response.finally(() => {});
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="userAlias"
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          User Alias
        </label>
        <Input
          type="text"
          id="userAlias"
          name="userAlias"
          value={formData.userAlias}
          onChange={handleChange}
          required
          placeholder="Enter your user alias"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="userPrincipalId"
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          User Principal ID
        </label>
        <Input
          type="text"
          id="userPrincipalId"
          name="userPrincipalId"
          value={formData.userPrincipalId}
          onChange={handleChange}
          required
          placeholder="Enter your user principal ID"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="subscriptionId"
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Subscription ID
        </label>
        <Input
          type="text"
          id="subscriptionId"
          name="subscriptionId"
          value={formData.subscriptionId}
          onChange={handleChange}
          required
          placeholder="Enter your Azure subscription ID"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="tenantId"
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Tenant ID
        </label>
        <Input
          type="text"
          id="tenantId"
          name="tenantId"
          value={formData.tenantId}
          onChange={handleChange}
          required
          placeholder="Enter your Azure tenant ID"
        />
      </div>
      <div className="flex justify-end">
        <Button variant="primary" type="submit" disabled={isRegistering}>
          {isRegistering ? "Registering..." : "Register"}
        </Button>
      </div>
    </form>
  );
};

export default ManagedServerRegistrationForm;
