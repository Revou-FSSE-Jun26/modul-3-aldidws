// Orders page — a Server Component that fetches orders from the Flask API.

import Card from "@/components/Card";
import { getOrders } from "@/lib/api";

export const metadata = {
  title: "Orders — Revo Otoshop",
};

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-foreground/60">No orders yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Card className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold">
                    Orders #{order.id}
                  </span>
                  <span className="text-sm text-foreground/60">
                    {order.customerName}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-bold">
                    Rp {order.total.toLocaleString("id-ID")}
                  </span>
                  <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium">
                    {order.status}
                  </span>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
