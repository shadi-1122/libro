import { prisma } from "@/lib/db";
import { requireUser } from "../user/require-user";

export async function getBookData() {
  const user = await requireUser();
  const data = await prisma.book.findMany({
    where: {
      userId: user.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      serial_number: true,
      language: true,
      title: true,
      author: true,
      publisher: true,
      price: true,
      status: true,
    },
  });

  return data;
}

export type BookDataType = Awaited<ReturnType<typeof getBookData>>[0];