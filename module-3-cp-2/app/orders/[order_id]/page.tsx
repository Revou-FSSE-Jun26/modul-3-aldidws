'use client'

import { useParams } from 'next/navigation'

export default function OrdersDetailPage() {
const params = useParams<{ order_id: string }>()
    
    return (
        <div className="border rounded-lg p-4 mb-4">
            <p className="text-xs text-gray-400 font-mono">app/orders/[order_id]/page.tsx</p>
            <h1 className="text-xl font-bold">Order Detail</h1>
            <p>Showing Orders #{params.order_id}</p>
            <p className="text-green-600 font-mono text-sm">→ GET /products/{params.order_id}</p>
        </div>
    );
}