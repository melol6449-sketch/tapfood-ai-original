// Nominatim (OpenStreetMap) geocoding utilities - FREE, no API key required

export interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    road?: string;
    house_number?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

export interface GeocodedAddress {
  displayName: string;
  lat: number;
  lng: number;
}

// Search for addresses using Nominatim
export async function searchAddress(query: string): Promise<GeocodedAddress[]> {
  if (!query || query.length < 3) return [];

  try {
    const params = new URLSearchParams({
      q: query,
      format: "json",
      addressdetails: "1",
      limit: "5",
      countrycodes: "br", // Brazil only
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          "Accept-Language": "pt-BR",
          "User-Agent": "DeliveryApp/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to search address");
    }

    const results: NominatimResult[] = await response.json();

    return results.map((result) => ({
      displayName: result.display_name,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    }));
  } catch {
    return [];
  }
}

// Geocode a single address to coordinates
export async function geocodeAddress(address: string): Promise<GeocodedAddress | null> {
  const results = await searchAddress(address);
  return results.length > 0 ? results[0] : null;
}

// Calculate distance between two points using Haversine formula
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in km
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Delivery zone type
export interface DeliveryZone {
  max_distance_km: number;
  fee: number;
}

// Calculate delivery fee based on distance and zones
export function calculateDeliveryFee(
  distanceKm: number,
  zones: DeliveryZone[]
): { fee: number; inRange: boolean } {
  if (!zones || zones.length === 0) {
    return { fee: 0, inRange: true }; // No zones configured = free delivery
  }

  // Sort zones by distance (ascending)
  const sortedZones = [...zones].sort((a, b) => a.max_distance_km - b.max_distance_km);

  // Find the first zone that covers the distance
  for (const zone of sortedZones) {
    if (distanceKm <= zone.max_distance_km) {
      return { fee: zone.fee, inRange: true };
    }
  }

  // Distance is beyond all configured zones
  return { fee: 0, inRange: false };
}
