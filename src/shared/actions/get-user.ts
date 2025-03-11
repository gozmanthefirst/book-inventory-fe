"use server";

import { headers } from "next/headers";
import { User } from "better-auth";

import { auth } from "@/shared/lib/auth/auth";
import { createParallelAction } from "../lib/utils/parallel-server-action";
import { ServerActionResponse } from "../types/shared-types";

// get user
export const getUser = createParallelAction(
  async (): Promise<ServerActionResponse | ServerActionResponse<User>> => {
    try {
      const headersList = await headers();

      const session = await auth.api.getSession({
        headers: headersList,
      });

      if (session?.user) {
        return {
          status: "success",
          details: "User gotten!",
          data: session.user,
        };
      } else {
        return { status: "error", details: "No user available!" };
      }
    } catch (error) {
      console.log(error);
      return {
        status: "error",
        details: `Error fetching user: ${error}`,
      };
    }
  },
);
