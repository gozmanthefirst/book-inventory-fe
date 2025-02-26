import { Prisma } from "@prisma/client";

export type ServerActionResponse<T = undefined> = T extends undefined
  ? {
      status: "success" | "error" | "info";
      details: string;
      data?: never;
    }
  : {
      status: "success" | "error" | "info";
      details: string;
      data: T;
    };

export type SessionUser =
  | {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      email: string;
      emailVerified: boolean;
      name: string;
      image?: string | null | undefined;
    }
  | undefined;

export type ComplexBook = Prisma.BookGetPayload<{
  include: {
    authors: true;
    genres: true;
  };
}>;
