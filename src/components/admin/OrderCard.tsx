import type { Order } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: Order["status"]) => void;
}

const statusLabels = {
  pending: "Pendente",
  preparing: "Preparando",
  ready: "Pronto",
  delivered: "Entregue",
};

const statusColors = {
  pending: "status-pending",
  preparing: "status-preparing",
  ready: "status-ready",
  delivered: "status-delivered",
};

const nextStatus: Record<Order["status"], Order["status"] | null> = {
  pending: "preparing",
  preparing: "ready",
  ready: "delivered",
  delivered: null,
};

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="bg-card rounded-xl shadow-md overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">#{order.id}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                statusColors[order.status]
              }`}
            >
              {statusLabels[order.status]}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {formatTime(order.createdAt)}
          </p>
        </div>
        <span className="text-lg font-bold text-primary">
          {formatPrice(order.total)}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-medium text-foreground">{order.customerName}</span>
          <a
            href={`tel:${order.customerPhone}`}
            className="text-primary hover:text-primary/80"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        <div className="space-y-1 mb-4">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between text-sm text-muted-foreground"
            >
              <span>
                {item.quantity}x {item.productName}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        {nextStatus[order.status] && (
          <Button
            onClick={() => onStatusChange(order.id, nextStatus[order.status]!)}
            className="w-full"
            size="sm"
          >
            {order.status === "pending" && "Iniciar Preparo"}
            {order.status === "preparing" && "Marcar como Pronto"}
            {order.status === "ready" && "Marcar como Entregue"}
          </Button>
        )}
      </div>
    </div>
  );
}
