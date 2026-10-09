'use client'

import { useParams } from 'next/navigation'

export default function CategoriesDetailPage() {
const params = useParams<{ categories_id: string }>()
    
    return (
        <div className="border rounded-lg p-4 mb-4">
            <p className="text-xs text-gray-400 font-mono">app/categories/[categories_id]/page.tsx</p>
            <h1 className="text-xl font-bold">categories Detail</h1>
            <p>Showing categories #{params.categories_id}</p>
            <p className="text-green-600 font-mono text-sm">→ GET /products/{params.categories_id}</p>
        </div>
    );
}