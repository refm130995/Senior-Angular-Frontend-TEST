import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WeatherData } from './weather.service';

export interface WeatherSearch {
  city: string;
  timestamp: number;
  weather: WeatherData;
}

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
