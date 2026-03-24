import { logout } from "@/actions/auth";

export async function POST() {
  await logout();
}
