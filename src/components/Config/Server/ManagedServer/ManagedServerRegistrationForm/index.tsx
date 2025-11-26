import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRegisterSubscription } from "../../../../../hooks/useManagedServer";
import { cn } from "../../../../../utils/cn";
import {
  subscriptionIdSchema,
  tenantIdSchema,
  userAliasSchema,
  userPrincipalIdSchema,
} from "../../../../../zodSchemas";
import Alert from "../../../../UserInterfaceComponents/Alert";
import Button from "../../../../UserInterfaceComponents/Button";
import Input from "../../../../UserInterfaceComponents/Input";

const ManagedServerRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    userAlias: "",
    userPrincipalId: "",
    subscriptionId: "",
    tenantId: "",
  });

  const [errors, setErrors] = useState({
    userAlias: "",
    userPrincipalId: "",
    subscriptionId: "",
    tenantId: "",
  });

  const [isModified, setIsModified] = useState({
    userAlias: false,
    userPrincipalId: false,
    subscriptionId: false,
    tenantId: false,
  });

  const timeoutRefs = useRef<{
    [key: string]: NodeJS.Timeout | null;
  }>({
    userAlias: null,
    userPrincipalId: null,
    subscriptionId: null,
    tenantId: null,
  });

  const { mutateAsync: registerServer, isLoading: isRegistering } =
    useRegisterSubscription();

  const validateField = (
    fieldName: string,
    value: string,
    schema: any,
  ): void => {
    const validationResult = schema.safeParse(value);

    // Clear the previous timeout
    if (timeoutRefs.current[fieldName]) {
      clearTimeout(timeoutRefs.current[fieldName]!);
    }

    if (validationResult.success) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    } else {
      // Set timeout to display error message after 1 second
      timeoutRefs.current[fieldName] = setTimeout(() => {
        const errorMessages = validationResult.error.errors
          .map((err: any) => err.message)
          .join(" ");
        setErrors((prev) => ({ ...prev, [fieldName]: errorMessages }));
      }, 1000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setIsModified((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate field in real-time
    switch (name) {
      case "userAlias":
        validateField(name, value, userAliasSchema);
        break;
      case "userPrincipalId":
        validateField(name, value, userPrincipalIdSchema);
        break;
      case "subscriptionId":
        validateField(name, value, subscriptionIdSchema);
        break;
      case "tenantId":
        validateField(name, value, tenantIdSchema);
        break;
    }
  };

  const validateForm = (): boolean => {
    const validations = [
      { name: "userAlias", value: formData.userAlias, schema: userAliasSchema },
      {
        name: "userPrincipalId",
        value: formData.userPrincipalId,
        schema: userPrincipalIdSchema,
      },
      {
        name: "subscriptionId",
        value: formData.subscriptionId,
        schema: subscriptionIdSchema,
      },
      { name: "tenantId", value: formData.tenantId, schema: tenantIdSchema },
    ];

    let isValid = true;
    const newErrors = { ...errors };

    validations.forEach(({ name, value, schema }) => {
      const result = schema.safeParse(value);
      if (!result.success) {
        newErrors[name as keyof typeof errors] = result.error.errors
          .map((err) => err.message)
          .join(" ");
        isValid = false;
      }
    });

    if (!isValid) {
      setErrors(newErrors);
      setIsModified({
        userAlias: true,
        userPrincipalId: true,
        subscriptionId: true,
        tenantId: true,
      });
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

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
          placeholder="e.g., abc or a-bcd (3-50 chars, lowercase)"
          className={cn(
            isModified.userAlias &&
              errors.userAlias &&
              "border-rose-500 outline-rose-500 dark:border-rose-500 dark:outline-rose-500",
          )}
        />
        {isModified.userAlias && errors.userAlias && (
          <Alert
            variant="danger"
            className="mt-1 rounded-sm p-2"
            role="alert"
            aria-live="polite"
            aria-atomic="true"
          >
            <p className="error-message text-sm">{errors.userAlias}</p>
          </Alert>
        )}
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
          placeholder="UUID format (e.g., 123e4567-e89b-12d3-a456-426614174000)"
          className={cn(
            isModified.userPrincipalId &&
              errors.userPrincipalId &&
              "border-rose-500 outline-rose-500 dark:border-rose-500 dark:outline-rose-500",
          )}
        />
        {isModified.userPrincipalId && errors.userPrincipalId && (
          <Alert
            variant="danger"
            className="mt-1 rounded-sm p-2"
            role="alert"
            aria-live="polite"
            aria-atomic="true"
          >
            <p className="error-message text-sm">{errors.userPrincipalId}</p>
          </Alert>
        )}
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
          placeholder="UUID format (e.g., 123e4567-e89b-12d3-a456-426614174000)"
          className={cn(
            isModified.subscriptionId &&
              errors.subscriptionId &&
              "border-rose-500 outline-rose-500 dark:border-rose-500 dark:outline-rose-500",
          )}
        />
        {isModified.subscriptionId && errors.subscriptionId && (
          <Alert
            variant="danger"
            className="mt-1 rounded-sm p-2"
            role="alert"
            aria-live="polite"
            aria-atomic="true"
          >
            <p className="error-message text-sm">{errors.subscriptionId}</p>
          </Alert>
        )}
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
          placeholder="UUID format (e.g., 123e4567-e89b-12d3-a456-426614174000)"
          className={cn(
            isModified.tenantId &&
              errors.tenantId &&
              "border-rose-500 outline-rose-500 dark:border-rose-500 dark:outline-rose-500",
          )}
        />
        {isModified.tenantId && errors.tenantId && (
          <Alert
            variant="danger"
            className="mt-1 rounded-sm p-2"
            role="alert"
            aria-live="polite"
            aria-atomic="true"
          >
            <p className="error-message text-sm">{errors.tenantId}</p>
          </Alert>
        )}
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
