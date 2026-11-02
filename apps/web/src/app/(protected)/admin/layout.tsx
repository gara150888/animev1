import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@Zlo/auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "admin") redirect("/home");

  return children;
}