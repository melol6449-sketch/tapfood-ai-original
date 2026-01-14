import { TrendingUp, ShoppingBag, DollarSign, Clock } from "lucide-react";
import { orders } from "@/data/mockData";

export function DashboardStats() {
  const stats = [
    {
      icon: ShoppingBag,
      label: "Pedidos Hoje",
      value: orders.length,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: DollarSign,
      label: "Faturamento",
      value: `R$ ${orders.reduce((acc, o) => acc + o.total, 0).toFixed(2)}`,
      color: "text-status-open",
      bgColor: "bg-status-open/10",
    },
    {
      icon: Clock,
      label: "Em Preparo",
      value: orders.filter((o) => o.status === "preparing").length,
      color: "text-status-preparing",
      bgColor: "bg-status-preparing/10",
    },
    {
      icon: TrendingUp,
      label: "Ticket Médio",
      value: `R$ ${(
        orders.reduce((acc, o) => acc + o.total, 0) / orders.length
      ).toFixed(2)}`,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="bg-card rounded-xl p-6 shadow-md animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
