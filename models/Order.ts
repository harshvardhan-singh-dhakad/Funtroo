export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
export type PaymentMethod = 'razorpay' | 'cod'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface IOrder {
  id?: string
  orderNumber: string
  customerId: string
  customerSnapshot: { name: string; email: string; phone: string }
  items: {
    productId: string
    name: string
    image: string
    price: number
    qty: number
  }[]
  address: {
    line1: string; line2: string; city: string; state: string; pincode: string
  }
  subtotal: number
  cardDiscount: number
  couponDiscount: number
  couponCode: string
  shipping: number
  total: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  razorpayOrderId: string
  razorpayPaymentId: string
  status: OrderStatus
  trackingNumber: string
  notes: string
  createdAt: string | Date
  updatedAt?: string | Date
}
