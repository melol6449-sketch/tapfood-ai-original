import { useState } from "react";
import { useRestaurantSettings } from "@/hooks/useRestaurantSettings";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Save, Store, MapPin, Clock, CreditCard, Loader2, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { settings, loading, updateSettings } = useRestaurantSettings();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  // Local form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [openingHours, setOpeningHours] = useState<Record<string, { open: string; close: string } | null>>({});
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [newPayment, setNewPayment] = useState("");
  const [initialized, setInitialized] = useState(false);

  // Initialize form when settings load
  if (settings && !initialized) {
    setName(settings.name);
    setPhone(settings.phone || "");
    setAddress(settings.address || "");
    setIsOpen(settings.is_open);
    setOpeningHours(settings.opening_hours || {});
    setPaymentMethods(settings.payment_methods || []);
    setInitialized(true);
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        name,
        phone,
        address,
        is_open: isOpen,
        opening_hours: openingHours,
        payment_methods: paymentMethods,
      });
    } finally {
      setSaving(false);
    }
  };

  const updateHour = (day: string, field: "open" | "close", value: string) => {
    setOpeningHours((prev) => ({
      ...prev,
      [day]: {
        open: prev[day]?.open || "18:00",
        close: prev[day]?.close || "23:00",
        [field]: value,
      },
    }));
  };

  const addPaymentMethod = () => {
    if (newPayment.trim() && !paymentMethods.includes(newPayment.trim())) {
      setPaymentMethods((prev) => [...prev, newPayment.trim()]);
      setNewPayment("");
    }
  };

  const removePaymentMethod = (method: string) => {
    setPaymentMethods((prev) => prev.filter((m) => m !== method));
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Telefone / WhatsApp
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">Status da Loja</p>
                <p className="text-sm text-muted-foreground">
                  {isOpen ? "Aberto para pedidos" : "Fechado"}
                </p>
              </div>
              <Switch
                checked={isOpen}
                onCheckedChange={setIsOpen}
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
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
            {Object.entries(openingHours).map(([day, hours]) => (
              <div key={day} className="flex items-center justify-between">
                <span className="font-medium text-foreground w-24">{day}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={hours?.open || ""}
                    onChange={(e) => updateHour(day, "open", e.target.value)}
                    className="p-2 rounded-lg border border-border bg-background text-foreground text-sm"
                  />
                  <span className="text-muted-foreground">até</span>
                  <input
                    type="time"
                    value={hours?.close || ""}
                    onChange={(e) => updateHour(day, "close", e.target.value)}
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
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="inline-flex items-center gap-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium"
              >
                {method}
                <button
                  onClick={() => removePaymentMethod(method)}
                  className="ml-1 hover:text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newPayment}
                onChange={(e) => setNewPayment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addPaymentMethod()}
                placeholder="Adicionar..."
                className="w-32 px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="icon" variant="outline" onClick={addPaymentMethod}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} size="lg" className="w-full" disabled={saving}>
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
