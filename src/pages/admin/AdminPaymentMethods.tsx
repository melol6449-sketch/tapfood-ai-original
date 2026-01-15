import { useState } from "react";
import { useRestaurantSettings } from "@/hooks/useRestaurantSettings";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Loader2, CreditCard, Banknote, QrCode } from "lucide-react";

const PAYMENT_OPTIONS = [
  { id: "cartao", label: "Cartão", icon: CreditCard },
  { id: "pix", label: "PIX", icon: QrCode },
  { id: "dinheiro", label: "Dinheiro", icon: Banknote },
];

const AdminPaymentMethods = () => {
  const { settings, loading, updateSettings } = useRestaurantSettings();
  const [saving, setSaving] = useState(false);

  // Local form state
  const [enabledMethods, setEnabledMethods] = useState<string[]>([]);
  const [pixKey, setPixKey] = useState("");
  const [pixKeyType, setPixKeyType] = useState("random");
  const [initialized, setInitialized] = useState(false);

  // Initialize form when settings load
  if (settings && !initialized) {
    setEnabledMethods(settings.payment_methods || []);
    setPixKey(settings.pix_key || "");
    setPixKeyType(settings.pix_key_type || "random");
    setInitialized(true);
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        payment_methods: enabledMethods,
        pix_key: pixKey || null,
        pix_key_type: pixKeyType,
      });
    } finally {
      setSaving(false);
    }
  };

  const togglePaymentMethod = (methodId: string) => {
    setEnabledMethods((prev) =>
      prev.includes(methodId)
        ? prev.filter((m) => m !== methodId)
        : [...prev, methodId]
    );
  };

  const isPixEnabled = enabledMethods.includes("pix");

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
          Formas de Pagamento
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure as formas de pagamento aceitas
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Payment Methods Toggle */}
        <div className="bg-card rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-primary/10">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-display text-lg font-bold text-foreground">
              Métodos de Pagamento
            </h2>
          </div>

          <div className="space-y-4">
            {PAYMENT_OPTIONS.map((method) => {
              const isEnabled = enabledMethods.includes(method.id);
              const Icon = method.icon;

              return (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary">
                      <Icon className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <Label htmlFor={method.id} className="font-medium text-foreground cursor-pointer">
                      {method.label}
                    </Label>
                  </div>
                  <Switch
                    id={method.id}
                    checked={isEnabled}
                    onCheckedChange={() => togglePaymentMethod(method.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* PIX Configuration - only show when PIX is enabled */}
        {isPixEnabled && (
          <div className="bg-card rounded-xl p-6 shadow-md animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary/10">
                <QrCode className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-display text-lg font-bold text-foreground">
                Configuração do PIX
              </h2>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Configure sua chave PIX para receber pagamentos. Quando o cliente escolher PIX, ele verá o QR Code e poderá copiar a chave.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tipo de Chave
                </label>
                <Select value={pixKeyType} onValueChange={setPixKeyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cpf">CPF</SelectItem>
                    <SelectItem value="cnpj">CNPJ</SelectItem>
                    <SelectItem value="email">E-mail</SelectItem>
                    <SelectItem value="phone">Telefone</SelectItem>
                    <SelectItem value="random">Chave aleatória</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Chave PIX
                </label>
                <input
                  type="text"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  placeholder="Digite sua chave PIX"
                  className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  A chave será exibida para o cliente no momento do pagamento
                </p>
              </div>
            </div>
          </div>
        )}

        <Button onClick={handleSave} size="lg" className="w-full" disabled={saving}>
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </div>
  );
};

export default AdminPaymentMethods;
