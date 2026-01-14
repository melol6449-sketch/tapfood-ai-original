import { useState } from "react";
import heroBurger from "@/assets/hero-burger.jpg";
import { RestaurantHeader } from "@/components/customer/RestaurantHeader";
import { RestaurantInfo } from "@/components/customer/RestaurantInfo";
import { CategoryNav } from "@/components/customer/CategoryNav";
import { ProductCard } from "@/components/customer/ProductCard";
import { WhatsAppButton } from "@/components/customer/WhatsAppButton";
import { categories, products } from "@/data/mockData";

const CustomerMenu = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.categoryId === activeCategory);

  const groupedProducts = categories
    .filter(
      (cat) =>
        activeCategory === "all" || cat.id === activeCategory
    )
    .map((cat) => ({
      ...cat,
      products: filteredProducts.filter((p) => p.categoryId === cat.id),
    }))
    .filter((cat) => cat.products.length > 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img
          src={heroBurger}
          alt="Burger House"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative -mt-12 px-4 md:px-6 max-w-5xl mx-auto">
        <RestaurantHeader />

        <div className="grid md:grid-cols-3 gap-6">
          {/* Info Section - Sidebar on desktop */}
          <div className="md:col-span-1 order-2 md:order-1">
            <RestaurantInfo />
          </div>

          {/* Menu Section */}
          <div className="md:col-span-2 order-1 md:order-2">
            <CategoryNav
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            <div className="mt-6 space-y-8">
              {groupedProducts.map((category) => (
                <div key={category.id} className="animate-fade-in">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    {category.name}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {category.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
};

export default CustomerMenu;
