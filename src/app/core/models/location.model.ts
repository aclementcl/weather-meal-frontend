export interface Region {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
  regionId: string;
  regionName: string;
  latitude: number;
  longitude: number;
}
