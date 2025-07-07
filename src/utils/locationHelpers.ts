export interface Coordinates {
  lat: number;
  lng: number;
}
export interface LocationInfo {
  coordinates: Coordinates;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  formatted: string;
}
export const getCurrentLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }
    const timeoutId = setTimeout(() => {
      reject(new Error("Location request timed out"));
    }, 10000);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        clearTimeout(timeoutId);
        reject(new Error(`Location error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
};
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else if (distance < 10) {
    return `${distance.toFixed(1)}km`;
  } else {
    return `${Math.round(distance)}km`;
  }
};
export const getLocationFromCoordinates = async (
  coordinates: Coordinates
): Promise<LocationInfo> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.lat}&lon=${coordinates.lng}&addressdetails=1`
    );
    if (!response.ok) {
      throw new Error("Failed to get location from coordinates");
    }
    const data = await response.json();
    return {
      coordinates,
      address: data.display_name || "Unknown location",
      city: data.address?.city || data.address?.town || data.address?.village,
      state: data.address?.state,
      country: data.address?.country,
      formatted: data.display_name || "Unknown location",
    };
  } catch (error) {
    console.error("Error getting location from coordinates:", error);
    return {
      coordinates,
      address: "Unknown location",
      formatted: "Unknown location",
    };
  }
};
export const getCoordinatesFromLocation = async (
  location: string
): Promise<Coordinates | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        location
      )}&limit=1`
    );
    if (!response.ok) {
      throw new Error("Failed to get coordinates from location");
    }
    const data = await response.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting coordinates from location:", error);
    return null;
  }
};
export const isWithinRadius = (
  centerLat: number,
  centerLng: number,
  targetLat: number,
  targetLng: number,
  radiusKm: number
): boolean => {
  const distance = calculateDistance(
    centerLat,
    centerLng,
    targetLat,
    targetLng
  );
  return distance <= radiusKm;
};
export const getBoundingBox = (
  centerLat: number,
  centerLng: number,
  radiusKm: number
): {
  north: number;
  south: number;
  east: number;
  west: number;
} => {
  const latDelta = radiusKm / 111.32;
  const lngDelta = radiusKm / (111.32 * Math.cos(centerLat * (Math.PI / 180)));
  return {
    north: centerLat + latDelta,
    south: centerLat - latDelta,
    east: centerLng + lngDelta,
    west: centerLng - lngDelta,
  };
};
export const formatLocation = (
  location: string,
  includeCountry: boolean = false
): string => {
  const parts = location.split(",").map((part) => part.trim());
  if (parts.length === 1) {
    return parts[0];
  }
  if (includeCountry) {
    return parts.join(", ");
  }
  const withoutCountry = parts.slice(0, -1);
  return withoutCountry.join(", ");
};
export const getLocationSuggestions = async (
  query: string,
  limit: number = 5
): Promise<Array<{ display_name: string; lat: string; lon: string }>> => {
  if (!query.trim()) return [];
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=${limit}&addressdetails=1`
    );
    if (!response.ok) {
      throw new Error("Failed to get location suggestions");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting location suggestions:", error);
    return [];
  }
};
export const storeUserLocation = (location: LocationInfo): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      "loopit_user_location",
      JSON.stringify({
        ...location,
        storedAt: Date.now(),
      })
    );
  } catch (error) {
    console.error("Error storing user location:", error);
  }
};
export const getStoredUserLocation = (): LocationInfo | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("loopit_user_location");
    if (!stored) return null;
    const location = JSON.parse(stored);
    const storedAt = location.storedAt || 0;
    const now = Date.now();
    if (now - storedAt > 24 * 60 * 60 * 1000) {
      localStorage.removeItem("loopit_user_location");
      return null;
    }
    return location;
  } catch (error) {
    console.error("Error getting stored user location:", error);
    return null;
  }
};
export const clearStoredUserLocation = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("loopit_user_location");
};
export const getLocationPermissionStatus = (): Promise<PermissionState> => {
  if (!navigator.permissions) {
    return Promise.resolve("granted" as PermissionState);
  }
  return navigator.permissions
    .query({ name: "geolocation" as PermissionName })
    .then((result) => result.state)
    .catch(() => "prompt" as PermissionState);
};
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    await getCurrentLocation();
    return true;
  } catch (error) {
    console.error("Location permission denied:", error);
    return false;
  }
};
export const getNearbyLocations = (
  centerLat: number,
  centerLng: number,
  radiusKm: number,
  locations: Array<{ lat: number; lng: number; [key: string]: any }>
): Array<{
  lat: number;
  lng: number;
  distance: number;
  [key: string]: any;
}> => {
  return locations
    .map((location) => ({
      ...location,
      distance: calculateDistance(
        centerLat,
        centerLng,
        location.lat,
        location.lng
      ),
    }))
    .filter((location) => location.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
};
