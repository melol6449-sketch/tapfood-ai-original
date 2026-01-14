import restaurantLogo from "@/assets/restaurant-logo.png";
import { restaurant } from "@/data/mockData";

export function RestaurantHeader() {
  return (
    <div className="flex items-center gap-4 mb-6 animate-fade-in">
      <img
        src={restaurantLogo}
        alt={restaurant.name}
        className="w-20 h-20 rounded-xl object-cover shadow-md"
      />
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          {restaurant.name}
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              restaurant.isOpen ? "status-open" : "status-closed"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                restaurant.isOpen ? "bg-white" : "bg-white"
              } animate-pulse`}
            />
            {restaurant.isOpen ? "Aberto agora" : "Fechado"}
          </span>
        </div>
      </div>
    </div>
  );
}
