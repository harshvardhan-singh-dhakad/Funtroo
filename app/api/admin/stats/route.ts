import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getCollection, getCollectionCount, where } from '@/lib/firestore'
import { IOrder } from '@/models/Order'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now   = new Date()
    const month = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const week  = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const [
      totalOrders, monthOrders, weekOrders,
      totalCustomers, newCustomers,
      totalProducts, lowStock,
      recentOrders,
      paidOrders,
    ] = await Promise.all([
      getCollectionCount('orders'),
      getCollectionCount('orders', [where('createdAt', '>=', month)]),
      getCollectionCount('orders', [where('createdAt', '>=', week)]),
      getCollectionCount('customers', [where('role', '==', 'customer')]),
      getCollectionCount('customers', [where('role', '==', 'customer'), where('createdAt', '>=', month)]),
      getCollectionCount('products', [where('isActive', '==', true)]),
      getCollectionCount('products', [where('isActive', '==', true), where('stock', '<=', 5)]),
      getCollection('orders', [where('createdAt', '>=', week)]), // Just a sample for recent
      getCollection<IOrder>('orders', [where('paymentStatus', '==', 'paid')])
    ])

    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0)
    const monthRevenue = paidOrders
      .filter(o => (o.createdAt as string) >= month)
      .reduce((sum, o) => sum + (o.total || 0), 0)

    // Simplified status distribution
    const statusCounts: Record<string, number> = {}
    paidOrders.forEach(o => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1
    })
    const ordersByStatus = Object.entries(statusCounts).map(([_id, count]) => ({ _id, count }))

    return NextResponse.json({
      orders:    { total: totalOrders, thisMonth: monthOrders, thisWeek: weekOrders },
      customers: { total: totalCustomers, new: newCustomers },
      products:  { total: totalProducts, lowStock },
      revenue:   { total: totalRevenue, thisMonth: monthRevenue },
      recentOrders: recentOrders.slice(0, 8),
      ordersByStatus,
      topProducts: [], // Would require complex grouping
    })
  } catch (e: any) {
    console.error('Stats Error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
