import { z } from "zod";

export const deploymentNameSchema = z
	.string()
	.min(1, "Deployment name must be at least one character long.")
	.max(12, "Deployment name must not exceed 12 characters in length.")
	.regex(
		/^[a-z][a-z0-9]*$/,
		"Deployment name must start with a lowercase letter and consist of lowercase letters and numbers only."
	);

// lab name
export const labNameSchema = z
	.string()
	.min(3, "Lab name must be at least 3 characters.")
	.max(50, "Lab name must not exceed 50 characters.")
	.regex(
		/^[a-zA-Z0-9_-][a-zA-Z0-9 _-]*[a-zA-Z0-9_-]$/,
		"Lab name must only contain letters, numbers, spaces, underscores and dashes and must not start or end with a space."
	)
	.trim();

//lab description
export const labDescriptionSchema = z
	.string()
	.max(15000, "Lab description too long. Wanna write more? Add wiki page and link here.");

//lab message
export const labMessageSchema = z
	.string()
	.max(15000, "Lab message too long. Wanna write more? Add wiki page and link here.");

//lab tag
export const labTagSchema = z
	.string()
	.min(3, "Tag must be at least 3 characters.")
	.max(50, "Tag must not exceed 50 characters.")
	.regex(/^[a-zA-Z0-9_-]+$/, "Tag must only contain letters, numbers, underscores, and dashes.")
	.trim();

//subscription id
export const subscriptionIdSchema = z.string().uuid("Subscription ID must be a valid UUID.");

//node count schema
export const nodeCountSchema = z
  .number()
  .min(1, "Node count must be at least 1.")
  .max(10, "Node count must not exceed 10.");
