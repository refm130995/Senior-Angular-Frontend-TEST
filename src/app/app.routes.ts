import { Routes } from '@angular/router';
import { WeatherSearchComponent } from './features/weather-search/weather-search.component';

export const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'search', component: WeatherSearchComponent },
  { path: '**', redirectTo: 'search' },
];
