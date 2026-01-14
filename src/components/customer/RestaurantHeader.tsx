import restaurantLogo from "@/assets/restaurant-logo.png";
import type { RestaurantSettings } from "@/hooks/useRestaurantSettings";

interface RestaurantHeaderProps {
  settings: RestaurantSettings | null;
  loading?: boolean;
}

export function RestaurantHeader({ settings, loading }: RestaurantHeaderProps) {
  if (loading || !settings) {
    return (
      <div className="flex items-center gap-4 mb-6 animate-pulse">
        <div className="w-20 h-20 rounded-xl bg-muted" />
        <div>
          <div className="h-8 w-48 bg-muted rounded mb-2" />
          <div className="h-6 w-24 bg-muted rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 mb-6 animate-fade-in">
      <img
        src={settings.logo || restaurantLogo}
        alt={settings.name}
        className="w-20 h-20 rounded-xl object-cover shadow-md"
      />
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          {settings.name}
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              settings.is_open ? "status-open" : "status-closed"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full bg-white animate-pulse`}
            />
            {settings.is_open ? "Aberto agora" : "Fechado"}
          </span>
        </div>
      </div>
    </div>
  );
}
