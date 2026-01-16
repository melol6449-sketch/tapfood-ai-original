import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck, Plus, Trash2, GripVertical, MapPin, Loader2 } from "lucide-react";
import { DeliveryZone, searchAddress, GeocodedAddress } from "@/lib/geocoding";
import { AddressAutocomplete } from "@/components/customer/AddressAutocomplete";

interface DeliveryZonesConfigProps {
  baseAddress: string;
  baseAddressLat: number | null;
  baseAddressLng: number | null;
  deliveryZones: DeliveryZone[];
  onBaseAddressChange: (address: string, lat: number, lng: number) => void;
  onZonesChange: (zones: DeliveryZone[]) => void;
}

export function DeliveryZonesConfig({
  baseAddress,
  baseAddressLat,
  baseAddressLng,
  deliveryZones,
  onBaseAddressChange,
  onZonesChange,
}: DeliveryZonesConfigProps) {
  const [address, setAddress] = useState(baseAddress);
  const [zones, setZones] = useState<DeliveryZone[]>(deliveryZones);
  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    setAddress(baseAddress);
  }, [baseAddress]);

  useEffect(() => {
    setZones(deliveryZones);
  }, [deliveryZones]);

  const handleAddressSelect = (geocoded: GeocodedAddress) => {
    setAddress(geocoded.displayName);
    onBaseAddressChange(geocoded.displayName, geocoded.lat, geocoded.lng);
  };

  const handleManualAddressSearch = async () => {
    if (!address || address.length < 5) return;
    
    setIsGeocoding(true);
    const results = await searchAddress(address);
    if (results.length > 0) {
      const first = results[0];
      setAddress(first.displayName);
      onBaseAddressChange(first.displayName, first.lat, first.lng);
    }
    setIsGeocoding(false);
  };

  const addZone = () => {
    const lastZone = zones[zones.length - 1];
    const newDistance = lastZone ? lastZone.max_distance_km + 3 : 3;
    const newFee = lastZone ? lastZone.fee + 2 : 5;
    
    const newZones = [...zones, { max_distance_km: newDistance, fee: newFee }];
    setZones(newZones);
    onZonesChange(newZones);
  };

  const removeZone = (index: number) => {
    const newZones = zones.filter((_, i) => i !== index);
    setZones(newZones);
    onZonesChange(newZones);
  };

  const updateZone = (index: number, field: keyof DeliveryZone, value: number) => {
    const newZones = zones.map((zone, i) =>
      i === index ? { ...zone, [field]: value } : zone
    );
    // Sort by distance
    newZones.sort((a, b) => a.max_distance_km - b.max_distance_km);
    setZones(newZones);
    onZonesChange(newZones);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-primary/10">
          <Truck className="w-6 h-6 text-primary" />
        </div>
        <h2 className="font-display text-lg font-bold text-foreground">
          Taxa de Entrega
        </h2>
      </div>

      {/* Base Address */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Endereço Base da Lanchonete
        </label>
        <div className="flex gap-2">
          <div className="flex-1">
            <AddressAutocomplete
              value={address}
              onChange={setAddress}
              onAddressSelect={handleAddressSelect}
              placeholder="Digite o endereço da lanchonete"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleManualAddressSearch}
            disabled={isGeocoding}
          >
            {isGeocoding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
          </Button>
        </div>
        {baseAddressLat && baseAddressLng && (
          <p className="text-xs text-muted-foreground mt-1">
            Coordenadas: {baseAddressLat.toFixed(6)}, {baseAddressLng.toFixed(6)}
          </p>
        )}
      </div>

      {/* Delivery Zones */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-foreground">
            Faixas de Entrega
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addZone}
            className="gap-1"
          >
            <Plus className="w-4 h-4" />
            Adicionar Faixa
          </Button>
        </div>

        {zones.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center border border-dashed border-border rounded-lg">
            Nenhuma faixa configurada. Entrega será gratuita.
          </p>
        ) : (
          <div className="space-y-2">
            {zones.map((zone, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg"
              >
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    Até
                  </span>
                  <Input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={zone.max_distance_km}
                    onChange={(e) =>
                      updateZone(index, "max_distance_km", parseFloat(e.target.value) || 0)
                    }
                    className="w-20 text-center"
                  />
                  <span className="text-sm text-muted-foreground">km</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">→</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      R$
                    </span>
                    <Input
                      type="number"
                      min="0"
                      step="0.5"
                      value={zone.fee}
                      onChange={(e) =>
                        updateZone(index, "fee", parseFloat(e.target.value) || 0)
                      }
                      className="w-24 pl-9 text-center"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeZone(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {zones.length > 0 && (
          <p className="text-xs text-muted-foreground mt-3">
            Pedidos fora da última faixa ({zones[zones.length - 1]?.max_distance_km} km) serão bloqueados.
          </p>
        )}
      </div>
    </div>
  );
}
