import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminWrapper from '@/components/AdminWrapper'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  // Double protection: redirect if not admin
  if (!session || !['admin', 'superadmin'].includes((session.user as any)?.role)) {
    redirect('/?error=unauthorized')
  }

  return <AdminWrapper>{children}</AdminWrapper>
}
