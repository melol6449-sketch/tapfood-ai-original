import { DashboardStats } from "@/components/admin/DashboardStats";
import { OrderCard } from "@/components/admin/OrderCard";
import { orders as initialOrders } from "@/data/mockData";
import { useState } from "react";
import type { Order } from "@/data/mockData";

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const activeOrders = orders.filter((o) => o.status !== "delivered");

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Visão geral do seu negócio
        </p>
      </div>

      <DashboardStats />

      <div className="mt-8">
        <h2 className="font-display text-xl font-bold text-foreground mb-4">
          Pedidos Ativos ({activeOrders.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
        {activeOrders.length === 0 && (
          <div className="bg-card rounded-xl p-8 text-center">
            <p className="text-muted-foreground">Nenhum pedido ativo no momento</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
