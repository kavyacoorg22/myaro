
export interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
  };
}

export const extractCity = (address: NominatimResult["address"]): string =>
  address.city ?? address.town ?? address.village ?? address.county ?? address.state ?? "";