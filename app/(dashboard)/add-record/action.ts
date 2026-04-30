"use server";

import { requireUser } from "@/data/user/require-user";
import arcjet from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { bookSchema, BookSchemaType } from "@/lib/zodSchemas";
import { fixedWindow, request } from "@arcjet/next";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  }),
);

export async function CreateRecord(
  values: BookSchemaType,
): Promise<ApiResponse> {
  const session = await requireUser();
  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "You have been rate limited. Please try again later.",
        };
      } else {
        return {
          status: "error",
          message:
            "You are a bot! if this is a mistake, please contact support.",
        };
      }
    }

    const validation = bookSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid Form Data",
      };
    }

    await prisma.book.create({
      data: {
        ...validation.data,
        userId: session?.user.id as string,
      },
    });

    return {
      status: "success",
      message: "Record created successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Failed to Create Course",
    };
  }
}

export async function EditRecord(
  data: BookSchemaType,
  bookId: string,
): Promise<ApiResponse> {
  const session = await requireUser();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "You have been rate limited. Please try again later.",
        };
      } else {
        return {
          status: "error",
          message:
            "You are a bot! if this is a mistake, please contact support.",
        };
      }
    }

    const result = bookSchema.safeParse(data);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    await prisma.book.update({
      where: {
        id: bookId,
        userId: session?.user.id as string,
      },
      data: {
        ...result.data,
      },
    });

    return {
      status: "success",
      message: "Book record updated succesfully!",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update book record.",
    };
  }
}

export async function DeleteRecord(bookId: string): Promise<ApiResponse> {
  const session = await requireUser();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "You have been rate limited. Please try again later.",
        };
      } else {
        return {
          status: "error",
          message:
            "You are a bot! if this is a mistake, please contact support.",
        };
      }
    }

    await prisma.book.delete({
      where: {
        id: bookId,
        userId: session?.user.id as string,
      },
    });

    return {
      status: "success",
      message: "Book record deleted successfully!",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete book record! Please try again later.",
    };
  }
}

export async function BulkCreateRecords(rows: any[]): Promise<ApiResponse> {
  const session = await requireUser();

  try {
    const validData = [];

    for (const row of rows) {
      const parsed = bookSchema.safeParse(row);

      if (!parsed.success) continue; // skip invalid rows

      validData.push({
        ...parsed.data,
        userId: session.user.id,
      });
    }

    if (validData.length === 0) {
      return {
        status: "error",
        message: "No valid rows found in CSV",
      };
    }

    // 🔥 Fast bulk insert
    await prisma.book.createMany({
      data: validData,
      skipDuplicates: true,
    });

    return {
      status: "success",
      message: `${validData.length} books added successfully`,
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Bulk insert failed",
    };
  }
}
