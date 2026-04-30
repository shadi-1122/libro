// /app/api/next-serial/route.ts
import { requireUser } from "@/data/user/require-user";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await requireUser();

  const lastBook = await prisma.book.findFirst({
    where: {
      userId: user.user.id,
    },
    orderBy: {
      serial_number: "desc",
    },
  });

  let nextNumber = 1;

  if (lastBook?.serial_number) {
    nextNumber = parseInt(lastBook.serial_number) + 1;
  }

  const serial = String(nextNumber).padStart(3, "0");

  return Response.json({ serial });
}
