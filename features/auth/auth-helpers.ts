import { headers } from 'next/headers';
import { auth } from './auth';

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireDashboardAccess() {
  const session = await getSession();
  const role = session?.user.role;

  if (!role || !['admin', 'moderator'].includes(role)) {
    return null;
  }

  return session;
}

export async function requirePermission(permissions: Record<string, string[]>) {
  const session = await getSession();
  if (!session) return false;

  const { success } = await auth.api.userHasPermission({
    headers: await headers(),
    body: {
      userId: session.user.id,
      permissions,
    },
  });

  return success;
}
