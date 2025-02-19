import { Component } from '@angular/core';
import { WeatherService } from '../../core/services/weather.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WeatherResultComponent } from '../weather-result/weather-result.component';
import { HistoryListComponent } from '../../shared/components/history-list/history-list.component';
import { FavoriteListComponent } from '../../shared/components/favorite-list/favorite-list.component';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { WeatherViewComponent } from '../weather-view/weather-view.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-weather-search',
  standalone: true,
  imports: [
    FormsModule,
    FormsModule,
    CommonModule,
    WeatherResultComponent,
    HistoryListComponent,
    FavoriteListComponent,
    ReactiveFormsModule,
    WeatherViewComponent,
    TranslateModule,
  ],
  templateUrl: './weather-search.component.html',
  styleUrl: './weather-search.component.css',
})
export class WeatherSearchComponent {
  city: string = '';
  weatherData: any;
  errorMessage: string = '';
  searchControl = new FormControl('');
  filteredCities: string[] = [];
  suggestions: string[] = [];
  constructor(
    private readonly weatherService: WeatherService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) =>
          query ? this.weatherService.searchCity(query) : of([]),
        ),
      )
      .subscribe((results) => {
        this.suggestions = results;
      });
  }

  searchWeather() {
    this.city = this.searchControl.getRawValue() ?? '';
    if (!this.city.trim()) {
      this.errorMessage = 'Por favor, ingrese una ciudad.';
      return;
    }

    this.weatherService.getWeatherByCity(this.city).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.weatherService.saveSearch(data);
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'No se pudo encontrar la ciudad.';
        this.weatherData = null;
        console.error('Error fetching weather data:', error);
      },
    });
  }

  addToFavorites(): void {
    this.weatherService.addFavorite(this.weatherData);
  }

  selectCity(city: string) {
    this.searchControl.setValue(city, { emitEvent: false });
    this.suggestions = [];
  }

  onCitySelected(city: string) {
    this.searchControl.setValue(city);
  }

  switchLanguage() {
    const currentLang = this.translate.currentLang;
    if (currentLang === 'es') {
      this.translate.use('en');
    } else {
      this.translate.use('es');
    }
  }
}
