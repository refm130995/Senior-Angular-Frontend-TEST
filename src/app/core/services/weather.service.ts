import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map, shareReplay } from 'rxjs/operators';
import {
  WeatherData,
  WeatherSearch,
} from '../../shared/interfaces/weatherData.interface';
import { ApiService } from './api.service';
import { LoadingService } from './loading.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly API_URL = 'https://api.openweathermap.org/data/2.5/weather';
  private readonly API_KEY = '45f18a4248ed765e86410d8b3efc75b1';
  private readonly GEO_API_URL =
    'https://api.openweathermap.org/geo/1.0/direct';

  private readonly favoritesSubject = new BehaviorSubject<WeatherData[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  private readonly historySubject = new BehaviorSubject<WeatherSearch[]>([]);
  history$ = this.historySubject.asObservable();

  private readonly cache = new Map<string, Observable<any>>();

  private readonly historyPage = new BehaviorSubject<number>(1);

  private readonly favoritesPage = new BehaviorSubject<number>(1);

  private readonly pageSize = 5;

  constructor(
    private readonly httpService: ApiService,
    private readonly localStorageService: LocalStorageService,
    private readonly loadingService: LoadingService,
  ) {
    this.loadPaginatedHistory();
    this.loadPaginatedFavorites();
    this.localStorageService.favorites$.subscribe((favs) =>
      this.favoritesSubject.next(favs),
    );
    this.localStorageService.history$.subscribe((hist) =>
      this.historySubject.next(hist),
    );
  }

  getWeatherByCity(city: string): Observable<WeatherData> {
    if (this.cache.has(city)) {
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

  async clearFavorites() {
    this.localStorageService.clearFavorites();
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

  private loadPaginatedHistory() {
    this.historyPage.subscribe((page) => {
      const fullHistory = this.localStorageService.getHistory();
      const paginatedHistory = fullHistory.slice(0, page * this.pageSize);
      this.historySubject.next(paginatedHistory);
    });
  }

  private loadPaginatedFavorites() {
    this.favoritesPage.subscribe((page) => {
      const fullFavorites = this.localStorageService.getFavorites();
      const paginatedFavorites = fullFavorites.slice(0, page * this.pageSize);
      this.favoritesSubject.next(paginatedFavorites);
    });
  }

  loadMoreHistory() {
    this.historyPage.next(this.historyPage.getValue() + 1);
  }

  loadMoreFavorites() {
    this.favoritesPage.next(this.favoritesPage.getValue() + 1);
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
