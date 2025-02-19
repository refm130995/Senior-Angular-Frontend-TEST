import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  WeatherData,
  WeatherSearch,
} from '../../shared/interfaces/weatherData.interface';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly HISTORY_KEY = 'weather_history';
  private readonly FAVORITES_KEY = 'weather_favorites';

  private readonly favoritesSubject = new BehaviorSubject<WeatherData[]>(
    this.getFavorites(),
  );
  favorites$ = this.favoritesSubject.asObservable();

  private readonly historySubject = new BehaviorSubject<WeatherSearch[]>(
    this.getHistory(),
  );
  history$ = this.historySubject.asObservable();
  historyPage: number = 0;
  favoritesPage: number = 0;
  private readonly PAGE_SIZE = 5;
  constructor() {
    this.favoritesSubject.next(this.getFavorites());
    this.historySubject.next(this.getHistory());
  }

  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  addToHistory(city: WeatherData) {
    if (!this.isLocalStorageAvailable()) return;

    const history = this.getHistory();

    history.push({ city: city.name, timestamp: Date.now(), weather: city });

    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
    this.historySubject.next(history);
  }

  getHistory(): WeatherSearch[] {
    if (!this.isLocalStorageAvailable()) return [];
    return JSON.parse(localStorage.getItem(this.HISTORY_KEY) || '[]');
  }

  clearHistory() {
    if (!this.isLocalStorageAvailable()) return;
    localStorage.removeItem(this.HISTORY_KEY);
    this.historySubject.next([]);
  }

  clearFavorites() {
    if (!this.isLocalStorageAvailable()) return;
    localStorage.removeItem(this.FAVORITES_KEY);
    this.favoritesSubject.next([]);
  }

  addToFavorites(city: WeatherData) {
    if (!this.isLocalStorageAvailable()) return;

    const favorites = this.getFavorites();

    if (!favorites.some((fav) => fav.id === city.id)) {
      favorites.push(city);
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
      this.favoritesSubject.next(favorites);
    }
  }

  getFavorites(): WeatherData[] {
    if (!this.isLocalStorageAvailable()) return [];
    return JSON.parse(localStorage.getItem(this.FAVORITES_KEY) ?? '[]');
  }

  removeFromFavorites(city: WeatherData) {
    if (!this.isLocalStorageAvailable()) return;

    const favorites = this.getFavorites().filter((fav) => fav.id !== city.id);
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
    this.favoritesSubject.next(favorites);
  }
}
