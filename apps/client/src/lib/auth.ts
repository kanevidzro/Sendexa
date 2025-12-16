import { createAuthClient } from "better-auth/client";
import {
  apiKeyClient,
  organizationClient,
  twoFactorClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "https://server.sendexa.co", // Your backend domain
  basePath: "/auth", // This should match your server basePath
  plugins: [apiKeyClient(), organizationClient(), twoFactorClient()],
});
