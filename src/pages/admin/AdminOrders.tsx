import { useState } from "react";
import { orders as initialOrders, type Order } from "@/data/mockData";
import { OrderCard } from "@/components/admin/OrderCard";

const statusFilters = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendentes" },
  { value: "preparing", label: "Preparando" },
  { value: "ready", label: "Prontos" },
  { value: "delivered", label: "Entregues" },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState("all");

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Pedidos
        </h1>
        <p className="text-muted-foreground mt-1">
          Gerencie os pedidos da sua lanchonete
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {statusFilters.map((status) => (
          <button
            key={status.value}
            onClick={() => setFilter(status.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              filter === status.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-card rounded-xl p-8 text-center">
          <p className="text-muted-foreground">Nenhum pedido encontrado</p>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
