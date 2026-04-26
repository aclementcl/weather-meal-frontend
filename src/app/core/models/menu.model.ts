export interface MenuSuggestion {
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface MenuWeatherSummary {
  summary: string;
  temperatureMin: number;
  temperatureMax: number;
}

export interface MenuSuggestRequest {
  date: string;
  preferenceIds: number[];
}

export interface MenuSuggestResponse {
  location: string;
  date: string;
  weather: MenuWeatherSummary;
  menu: MenuSuggestion;
}
