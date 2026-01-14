import { useState, useRef } from "react";
import { useRestaurantSettings } from "@/hooks/useRestaurantSettings";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Store, MapPin, Clock, CreditCard, Loader2, Plus, X, Upload, Image, Pizza, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { settings, loading, updateSettings } = useRestaurantSettings();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Local form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [logo, setLogo] = useState<string | null>(null);
  const [openingHours, setOpeningHours] = useState<Record<string, { open: string; close: string } | null>>({});
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [pizzaPriceMethod, setPizzaPriceMethod] = useState<'highest' | 'average'>('highest');
  const [newPayment, setNewPayment] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [pixKeyType, setPixKeyType] = useState("random");
  const [initialized, setInitialized] = useState(false);

  // Initialize form when settings load
  if (settings && !initialized) {
    setName(settings.name);
    setPhone(settings.phone || "");
    setAddress(settings.address || "");
    setIsOpen(settings.is_open);
    setLogo(settings.logo);
    setOpeningHours(settings.opening_hours || {});
    setPaymentMethods(settings.payment_methods || []);
    setPizzaPriceMethod(settings.pizza_price_method || 'highest');
    setPixKey(settings.pix_key || "");
    setPixKeyType(settings.pix_key_type || "random");
    setInitialized(true);
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione uma imagem.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo é 2MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingLogo(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `restaurant-logo-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("logos")
        .getPublicUrl(fileName);

      setLogo(urlData.publicUrl);
      toast({ title: "Logo enviado com sucesso!" });
    } catch (error: any) {
      toast({
        title: "Erro ao enviar logo",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        name,
        phone,
        address,
        logo,
        is_open: isOpen,
        opening_hours: openingHours,
        payment_methods: paymentMethods,
        pizza_price_method: pizzaPriceMethod,
        pix_key: pixKey || null,
        pix_key_type: pixKeyType,
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
        {/* Logo Upload */}
        <div className="bg-card rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-primary/10">
              <Image className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-display text-lg font-bold text-foreground">
              Logo da Lanchonete
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-secondary flex items-center justify-center border-2 border-dashed border-border">
              {logo ? (
                <img
                  src={logo}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image className="w-8 h-8 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingLogo}
              >
                {uploadingLogo ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {uploadingLogo ? "Enviando..." : "Enviar logo"}
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Formatos: PNG, JPG. Tamanho máximo: 2MB
              </p>
            </div>
          </div>
        </div>

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
              <div key={day} className="flex items-center justify-between gap-4">
                <span className="font-medium text-foreground w-24 shrink-0">{day}</span>
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <input
                    type="time"
                    value={hours?.open || ""}
                    onChange={(e) => updateHour(day, "open", e.target.value)}
                    className="p-2 rounded-lg border border-border bg-background text-foreground text-sm w-28"
                  />
                  <span className="text-muted-foreground">até</span>
                  <input
                    type="time"
                    value={hours?.close || ""}
                    onChange={(e) => updateHour(day, "close", e.target.value)}
                    className="p-2 rounded-lg border border-border bg-background text-foreground text-sm w-28"
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

        {/* Pizza Price Calculation */}
        <div className="bg-card rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-primary/10">
              <Pizza className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-display text-lg font-bold text-foreground">
              Cálculo de Preço - Pizza
            </h2>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Defina como o preço será calculado quando o cliente selecionar múltiplos sabores de pizza.
          </p>

          <RadioGroup 
            value={pizzaPriceMethod} 
            onValueChange={(value) => setPizzaPriceMethod(value as 'highest' | 'average')}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <RadioGroupItem value="highest" id="highest" />
              <Label htmlFor="highest" className="flex-1 cursor-pointer">
                <p className="font-medium text-foreground">Maior preço</p>
                <p className="text-sm text-muted-foreground">
                  Cobra o valor do sabor mais caro selecionado
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <RadioGroupItem value="average" id="average" />
              <Label htmlFor="average" className="flex-1 cursor-pointer">
                <p className="font-medium text-foreground">Média de preços</p>
                <p className="text-sm text-muted-foreground">
                  Cobra a média dos valores dos sabores selecionados
                </p>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* PIX Configuration */}
        <div className="bg-card rounded-xl p-6 shadow-md">
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
