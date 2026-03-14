import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decryptSession } from "@/lib/auth";
import { DashboardWrapper } from "@/components/dashboard/dashboard-shell";
import AuthProvider from "@/context/auth-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  const user = await decryptSession();

  if (!user) {
    redirect("/login");
  }

  return (
    <AuthProvider user={user} isAuthenticated>
      <DashboardWrapper>{children}</DashboardWrapper>
    </AuthProvider>
  );
}
