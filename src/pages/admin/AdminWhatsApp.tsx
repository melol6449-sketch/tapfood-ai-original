import { useState } from "react";
import { whatsappSettings as initialSettings } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MessageCircle, Bot, Save } from "lucide-react";

const AdminWhatsApp = () => {
  const [settings, setSettings] = useState(initialSettings);

  const handleSave = () => {
    // Would save to backend
    alert("Configurações salvas com sucesso!");
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          WhatsApp / IA
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure o atendimento automático via WhatsApp
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Auto Reply Toggle */}
        <div className="bg-card rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#25D366]/10">
                <Bot className="w-6 h-6 text-[#25D366]" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">
                  Resposta Automática
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ativar atendimento automático por IA
                </p>
              </div>
            </div>
            <Switch
              checked={settings.autoReplyEnabled}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, autoReplyEnabled: checked }))
              }
            />
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-card rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">
                Mensagem de Boas-Vindas
              </h2>
              <p className="text-sm text-muted-foreground">
                Enviada quando o cliente inicia uma conversa
              </p>
            </div>
          </div>
          <textarea
            value={settings.welcomeMessage}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                welcomeMessage: e.target.value,
              }))
            }
            className="w-full h-32 p-4 rounded-lg border border-border bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Away Message */}
        <div className="bg-card rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-muted">
              <MessageCircle className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">
                Mensagem Fora do Horário
              </h2>
              <p className="text-sm text-muted-foreground">
                Enviada quando a loja está fechada
              </p>
            </div>
          </div>
          <textarea
            value={settings.awayMessage}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                awayMessage: e.target.value,
              }))
            }
            className="w-full h-32 p-4 rounded-lg border border-border bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Order Confirmation */}
        <div className="bg-card rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-status-open/10">
              <MessageCircle className="w-6 h-6 text-status-open" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">
                Confirmação de Pedido
              </h2>
              <p className="text-sm text-muted-foreground">
                Enviada após o cliente fazer um pedido
              </p>
            </div>
          </div>
          <textarea
            value={settings.orderConfirmation}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                orderConfirmation: e.target.value,
              }))
            }
            className="w-full h-32 p-4 rounded-lg border border-border bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Button onClick={handleSave} size="lg" className="w-full">
          <Save className="w-5 h-5" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default AdminWhatsApp;
