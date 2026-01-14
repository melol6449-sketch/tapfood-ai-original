import { MapPin, Clock, CreditCard, Phone } from "lucide-react";
import { restaurant } from "@/data/mockData";

export function RestaurantInfo() {
  return (
    <div className="bg-card rounded-xl p-6 shadow-md animate-fade-in">
      <h2 className="font-display text-xl font-bold text-foreground mb-4">
        Informações
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-foreground">Endereço</p>
            <p className="text-muted-foreground text-sm">{restaurant.address}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-foreground">Telefone</p>
            <p className="text-muted-foreground text-sm">{restaurant.phone}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-foreground">Horário de Funcionamento</p>
            <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
              {Object.entries(restaurant.openingHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between min-w-[200px]">
                  <span>{day}</span>
                  <span>{hours ? `${hours.open} - ${hours.close}` : "Fechado"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-foreground">Formas de Pagamento</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {restaurant.paymentMethods.map((method) => (
                <span
                  key={method}
                  className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
