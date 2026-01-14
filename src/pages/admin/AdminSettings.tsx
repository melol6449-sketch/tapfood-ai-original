import { useState } from "react";
import { restaurant as initialRestaurant } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Save, Store, MapPin, Clock, CreditCard } from "lucide-react";

const AdminSettings = () => {
  const [restaurant, setRestaurant] = useState(initialRestaurant);

  const handleSave = () => {
    alert("Configurações salvas com sucesso!");
  };

  const updateField = (field: string, value: string | boolean) => {
    setRestaurant((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Configurações
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure as informações da sua lanchonete
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Restaurant Info */}
        <div className="bg-card rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-primary/10">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-display text-lg font-bold text-foreground">
              Informações Gerais
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nome da Lanchonete
              </label>
              <input
                type="text"
                value={restaurant.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Telefone / WhatsApp
              </label>
              <input
                type="text"
                value={restaurant.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">Status da Loja</p>
                <p className="text-sm text-muted-foreground">
                  {restaurant.isOpen ? "Aberto para pedidos" : "Fechado"}
                </p>
              </div>
              <Switch
                checked={restaurant.isOpen}
                onCheckedChange={(checked) => updateField("isOpen", checked)}
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-card rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-primary/10">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-display text-lg font-bold text-foreground">
              Endereço
            </h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Endereço Completo
            </label>
            <input
              type="text"
              value={restaurant.address}
              onChange={(e) => updateField("address", e.target.value)}
              className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Opening Hours */}
        <div className="bg-card rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-primary/10">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-display text-lg font-bold text-foreground">
              Horário de Funcionamento
            </h2>
          </div>

          <div className="space-y-3">
            {Object.entries(restaurant.openingHours).map(([day, hours]) => (
              <div key={day} className="flex items-center justify-between">
                <span className="font-medium text-foreground w-24">{day}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={hours?.open || ""}
                    className="p-2 rounded-lg border border-border bg-background text-foreground text-sm"
                  />
                  <span className="text-muted-foreground">até</span>
                  <input
                    type="time"
                    value={hours?.close || ""}
                    className="p-2 rounded-lg border border-border bg-background text-foreground text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-card rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-primary/10">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-display text-lg font-bold text-foreground">
              Formas de Pagamento
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {restaurant.paymentMethods.map((method) => (
              <span
                key={method}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium"
              >
                {method}
              </span>
            ))}
            <button className="px-4 py-2 border-2 border-dashed border-border text-muted-foreground rounded-lg text-sm font-medium hover:border-primary hover:text-primary transition-colors">
              + Adicionar
            </button>
          </div>
        </div>

        <Button onClick={handleSave} size="lg" className="w-full">
          <Save className="w-5 h-5" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
