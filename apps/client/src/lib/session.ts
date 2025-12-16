import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";

export const getServerSession = async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
};