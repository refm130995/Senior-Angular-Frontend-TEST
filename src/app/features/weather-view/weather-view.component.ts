import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../core/services/weather.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { WeatherSearch } from '../../shared/interfaces/weatherData.interface';

@Component({
  selector: 'app-weather-view',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './weather-view.component.html',
  styleUrl: './weather-view.component.css',
})
export class WeatherViewComponent implements OnInit {
  viewMode: 'table' | 'detailed' = 'table';
  searchHistory: WeatherSearch[] = [];

  selectedCity: WeatherSearch | null = null;
  constructor(private readonly weatherService: WeatherService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.weatherService.history$.subscribe((history) => {
      this.searchHistory = history;
      this.selectCity(history[0]);
    });
  }

  setViewMode(mode: 'table' | 'detailed'): void {
    this.viewMode = mode;
  }

  selectCity(city: WeatherSearch): void {
    this.selectedCity = city;
    this.viewMode = 'detailed';
  }
}
