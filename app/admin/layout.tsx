import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  // Double protection: redirect if not admin
  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/?error=unauthorized')
  }

  return (
    <div className="min-h-screen flex bg-f-soft">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
