import { MapPin, Clock, CreditCard, Phone } from "lucide-react";
import type { RestaurantSettings } from "@/hooks/useRestaurantSettings";

interface RestaurantInfoProps {
  settings: RestaurantSettings | null;
  loading?: boolean;
}

export function RestaurantInfo({ settings, loading }: RestaurantInfoProps) {
  if (loading || !settings) {
    return (
      <div className="bg-card rounded-xl p-6 shadow-md animate-pulse">
        <div className="h-6 w-32 bg-muted rounded mb-4" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 bg-muted rounded" />
              <div className="flex-1">
                <div className="h-4 w-24 bg-muted rounded mb-2" />
                <div className="h-3 w-40 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-6 shadow-md animate-fade-in">
      <h2 className="font-display text-xl font-bold text-foreground mb-4">
        Informações
      </h2>
      
      <div className="space-y-4">
        {settings.address && (
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-foreground">Endereço</p>
              <p className="text-muted-foreground text-sm">{settings.address}</p>
            </div>
          </div>
        )}

        {settings.phone && (
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-foreground">Telefone</p>
              <p className="text-muted-foreground text-sm">{settings.phone}</p>
            </div>
          </div>
        )}

        {settings.opening_hours && Object.keys(settings.opening_hours).length > 0 && (
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-foreground">Horário de Funcionamento</p>
              <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
                {Object.entries(settings.opening_hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between min-w-[200px]">
                    <span>{day}</span>
                    <span>{hours ? `${hours.open} - ${hours.close}` : "Fechado"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {settings.payment_methods && settings.payment_methods.length > 0 && (
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-foreground">Formas de Pagamento</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {settings.payment_methods.map((method) => (
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
        )}
      </div>
    </div>
  );
}
