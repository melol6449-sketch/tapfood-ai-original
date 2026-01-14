import { useState } from "react";
import { orders as initialOrders, type Order } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Phone, Clock, ChevronRight } from "lucide-react";

const statusConfig = {
  pending: {
    label: "Em análise",
    bgColor: "bg-amber-400",
    textColor: "text-amber-950",
  },
  preparing: {
    label: "Em produção",
    bgColor: "bg-orange-500",
    textColor: "text-white",
  },
  ready: {
    label: "Prontos para entrega",
    bgColor: "bg-emerald-500",
    textColor: "text-white",
  },
  delivered: {
    label: "Entregues",
    bgColor: "bg-slate-400",
    textColor: "text-white",
  },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const getNextStatus = (status: Order["status"]): Order["status"] | null => {
    const statusFlow: Record<Order["status"], Order["status"] | null> = {
      pending: "preparing",
      preparing: "ready",
      ready: "delivered",
      delivered: null,
    };
    return statusFlow[status];
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 60000);
    if (diff < 60) return `${diff} min`;
    return `${Math.floor(diff / 60)}h ${diff % 60}min`;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.includes(searchTerm) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: Order["status"][] = ["pending", "preparing", "ready", "delivered"];

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Meus Pedidos
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pedido ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button>
              <Plus className="w-4 h-4" />
              Novo pedido
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 p-6 overflow-x-auto">
        <div className="flex gap-4 h-full min-h-[600px]">
          {columns.map((status) => {
            const config = statusConfig[status];
            const columnOrders = filteredOrders.filter((o) => o.status === status);
            
            return (
              <div
                key={status}
                className="flex-1 min-w-[280px] flex flex-col rounded-xl overflow-hidden shadow-lg"
              >
                {/* Column Header */}
                <div
                  className={`${config.bgColor} ${config.textColor} p-4 flex items-center justify-between`}
                >
                  <h2 className="font-semibold text-lg">{config.label}</h2>
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    {columnOrders.length}
                  </span>
                </div>

                {/* Column Content */}
                <div
                  className={`flex-1 ${config.bgColor} bg-opacity-20 p-3 space-y-3 overflow-y-auto`}
                  style={{ backgroundColor: `color-mix(in srgb, ${config.bgColor === 'bg-amber-400' ? '#fbbf24' : config.bgColor === 'bg-orange-500' ? '#f97316' : config.bgColor === 'bg-emerald-500' ? '#10b981' : '#94a3b8'} 15%, white)` }}
                >
                  {columnOrders.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center p-6">
                      <p className="text-muted-foreground text-sm">
                        Nenhum pedido no momento.
                        <br />
                        {status === "pending" && "Aguardando novos pedidos..."}
                        {status === "preparing" && "Pedidos em preparo aparecerão aqui."}
                        {status === "ready" && "Pedidos prontos para entrega."}
                        {status === "delivered" && "Pedidos entregues com sucesso."}
                      </p>
                    </div>
                  ) : (
                    columnOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-card rounded-lg shadow-md p-4 animate-scale-in hover:shadow-lg transition-shadow"
                      >
                        {/* Order Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">
                              #{order.id}
                            </span>
                            <div className="flex items-center gap-1 text-muted-foreground text-xs">
                              <Clock className="w-3 h-3" />
                              {formatTime(order.createdAt)}
                            </div>
                          </div>
                          <span className="font-bold text-primary">
                            {formatPrice(order.total)}
                          </span>
                        </div>

                        {/* Customer */}
                        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold text-sm">
                              {order.customerName.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground text-sm">
                              {order.customerName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.customerPhone}
                            </p>
                          </div>
                          <a
                            href={`tel:${order.customerPhone}`}
                            className="p-2 rounded-full hover:bg-muted transition-colors"
                          >
                            <Phone className="w-4 h-4 text-primary" />
                          </a>
                        </div>

                        {/* Items */}
                        <div className="space-y-1 mb-3">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-muted-foreground">
                                {item.quantity}x {item.productName}
                              </span>
                              <span className="text-foreground font-medium">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Action */}
                        {getNextStatus(status) && (
                          <Button
                            onClick={() =>
                              handleStatusChange(order.id, getNextStatus(status)!)
                            }
                            size="sm"
                            className="w-full gap-2"
                          >
                            {status === "pending" && "Iniciar Preparo"}
                            {status === "preparing" && "Marcar como Pronto"}
                            {status === "ready" && "Marcar como Entregue"}
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
