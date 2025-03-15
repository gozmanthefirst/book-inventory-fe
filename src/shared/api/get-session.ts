"use server";

import { headers } from "next/headers";
import { Session } from "better-auth";

import { auth } from "@/shared/lib/auth/auth";
import { createParallelAction } from "../lib/utils/parallel-server-action";
import { ServerActionResponse } from "../types/shared-types";

export const getSession = createParallelAction(
  async (): Promise<ServerActionResponse | ServerActionResponse<Session>> => {
    try {
      const headersList = await headers();

      const session = await auth.api.getSession({
        headers: headersList,
      });

      if (session?.session) {
        return {
          status: "success",
          details: "Session gotten!",
          data: session.session,
        };
      } else {
        return { status: "error", details: "No session available!" };
      }
    } catch (error) {
      console.log(error);
      return {
        status: "error",
        details: `Error fetching session: ${error}`,
      };
    }
  },
);
