import { useState, useMemo } from "react";
import heroBurger from "@/assets/hero-burger.jpg";
import { RestaurantHeader } from "@/components/customer/RestaurantHeader";
import { RestaurantInfo } from "@/components/customer/RestaurantInfo";
import { CategoryNav } from "@/components/customer/CategoryNav";
import { ProductCard } from "@/components/customer/ProductCard";
import { PizzaCard } from "@/components/customer/PizzaCard";
import { CartButton } from "@/components/customer/CartButton";
import { CartSheet } from "@/components/customer/CartSheet";
import { CheckoutDialog } from "@/components/customer/CheckoutDialog";
import { useCustomerMenu } from "@/hooks/useCustomerMenu";
import { useRestaurantSettings } from "@/hooks/useRestaurantSettings";
import { Loader2 } from "lucide-react";

const CustomerMenu = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { categories, products, loading: menuLoading } = useCustomerMenu();
  const { settings, loading: settingsLoading } = useRestaurantSettings();

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  // Check if a category is "Pizza" category (has pizza flavors)
  const isPizzaCategory = (categoryId: string) => {
    return products.some(
      (p) => p.category_id === categoryId && p.is_pizza_flavor
    );
  };

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category_id === activeCategory);

  const groupedProducts = categories
    .filter(
      (cat) =>
        activeCategory === "all" || cat.id === activeCategory
    )
    .map((cat) => ({
      ...cat,
      isPizza: isPizzaCategory(cat.id),
      products: filteredProducts.filter((p) => p.category_id === cat.id),
    }))
    .filter((cat) => cat.products.length > 0);

  const isLoading = menuLoading || settingsLoading;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img
          src={heroBurger}
          alt={settings?.name || "Restaurante"}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative -mt-12 px-4 md:px-6 max-w-5xl mx-auto">
        <RestaurantHeader settings={settings} loading={settingsLoading} />

        <div className="grid md:grid-cols-3 gap-6">
          {/* Info Section - Sidebar on desktop */}
          <div className="md:col-span-1 order-2 md:order-1">
            <RestaurantInfo settings={settings} loading={settingsLoading} />
          </div>

          {/* Menu Section */}
          <div className="md:col-span-2 order-1 md:order-2">
            <CategoryNav
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              loading={menuLoading}
            />

            {menuLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : groupedProducts.length > 0 ? (
              <div className="mt-6 space-y-8">
                {groupedProducts.map((category) => (
                  <div key={category.id} className="animate-fade-in">
                    <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <span className="text-2xl">{category.icon}</span>
                      {category.name}
                    </h2>
                    {category.isPizza ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <PizzaCard
                          categoryName={category.name}
                          categoryIcon={category.icon}
                          flavors={category.products}
                          priceMethod={settings?.pizza_price_method || 'highest'}
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {category.products.map((product) => (
                          <ProductCard 
                            key={product.id} 
                            product={product} 
                            categoryIcon={category.icon}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum produto disponível no momento.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <CartButton onClick={() => setCartOpen(true)} />
      <CartSheet 
        open={cartOpen} 
        onOpenChange={setCartOpen} 
        onCheckout={handleCheckout} 
      />
      <CheckoutDialog 
        open={checkoutOpen} 
        onOpenChange={setCheckoutOpen} 
      />
    </div>
  );
};

export default CustomerMenu;
