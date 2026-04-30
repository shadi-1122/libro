import { redirect } from "next/navigation";
import { getUser } from "@/data/user/get-user";

export default async function Page() {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }

  return null;
}
