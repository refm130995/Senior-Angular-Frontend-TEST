import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map, shareReplay } from 'rxjs/operators';
import { ApiService } from './api.service';
import { LocalStorageService, WeatherSearch } from './local-storage.service';
import { LoadingService } from './loading.service';

export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly API_URL = 'https://api.openweathermap.org/data/2.5/weather';
  private readonly API_KEY = '45f18a4248ed765e86410d8b3efc75b1';
  private readonly GEO_API_URL =
    'https://api.openweathermap.org/geo/1.0/direct';

  private readonly PAGE_SIZE = 5;

  private readonly favoritesSubject = new BehaviorSubject<WeatherData[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  private readonly historySubject = new BehaviorSubject<WeatherSearch[]>([]);
  history$ = this.historySubject.asObservable();

  private readonly cache = new Map<string, Observable<any>>();
  historyPage: number = 0;
  favoritesPage: number = 0;

  constructor(
    private readonly httpService: ApiService,
    private readonly localStorageService: LocalStorageService,
    private readonly loadingService: LoadingService,
  ) {
    this.localStorageService.favorites$.subscribe((favs) =>
      this.favoritesSubject.next(favs),
    );
    this.localStorageService.history$.subscribe((hist) =>
      this.historySubject.next(hist),
    );
  }

  getWeatherByCity(city: string): Observable<WeatherData> {
    if (this.cache.has(city)) {
      console.log(`Cache hit for: ${city}`);
      return this.cache.get(city)!;
    }
    this.loadingService.show();
    const params = { q: city, appid: this.API_KEY, units: 'metric' };

    const request = this.httpService
      .get<WeatherData>(this.API_URL, params)
      .pipe(
        shareReplay(1),
        finalize(() => this.loadingService.hide()),
        catchError((error) => this.handleError(error, 'weather')),
      );

    this.cache.set(city, request);
    return request;
  }

  searchCity(query: string): Observable<string[]> {
    if (!query.trim()) return of([]);
    console.log('searchCity', query);

    return this.httpService
      .get<
        any[]
      >(`${this.GEO_API_URL}?q=${query}&limit=5&appid=${this.API_KEY}`)
      .pipe(
        map((response) =>
          response.map((city) => `${city.name}, ${city.country}`),
        ),
        catchError((error) => this.handleError(error, 'city search')),
      );
  }

  async saveSearch(city: any) {
    this.localStorageService.addToHistory(city);
  }

  async getSearchHistory() {
    return this.localStorageService.getHistory();
  }

  async clearSearchHistory() {
    this.localStorageService.clearHistory();
  }

  async addFavorite(city: any) {
    this.localStorageService.addToFavorites(city);
  }

  getFavorites(): WeatherData[] {
    return this.localStorageService.getFavorites();
  }

  async removeFavorite(city: WeatherData) {
    this.localStorageService.removeFromFavorites(city);
  }

  private async loadFavorites() {
    const favorites = this.getFavorites();
    this.favoritesSubject.next(
      favorites.slice(0, this.favoritesPage * this.PAGE_SIZE),
    );
  }

  private async loadHistory() {
    const history = this.localStorageService.getHistory();
    this.historySubject.next(
      history.slice(0, this.historyPage * this.PAGE_SIZE),
    );
  }

  loadMoreHistory() {
    this.historyPage++;
    const history = this.localStorageService.getHistory();
    const newHistory = history.slice(
      0,
      (this.historyPage + 1) * this.PAGE_SIZE,
    );
    this.historySubject.next(newHistory);
  }

  loadMoreFavorites() {
    this.favoritesPage++;
    const favorites = this.localStorageService.getFavorites();
    const newFavorites = favorites.slice(
      0,
      (this.favoritesPage + 1) * this.PAGE_SIZE,
    );
    this.favoritesSubject.next(newFavorites);
  }
  private handleError(error: any, context: string): Observable<never> {
    console.error(`Error in ${context}:`, error);

    let errorMessage = 'An unexpected error occurred. Please try again later.';
    if (error.status === 404) {
      errorMessage = 'City not found. Please check your input.';
    } else if (error.status === 401) {
      errorMessage = 'Invalid API key. Please update your API settings.';
    } else if (error.status === 500) {
      errorMessage = 'Server error. Please try again later.';
    }

    return throwError(() => new Error(errorMessage));
  }
}
