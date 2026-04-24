import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './features/weather-planner/pages/weather-planner-page/weather-planner-page.component'
      ).then((module) => module.WeatherPlannerPageComponent),
  },
];
