export interface Region {
  id: number;
  name: string;
}

export interface Location {
  id: number;
  name: string;
  regionId: number;
  regionName: string;
  latitude: number;
  longitude: number;
}
