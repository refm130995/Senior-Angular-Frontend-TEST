import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../../core/services/weather.service';
import { TranslateModule } from '@ngx-translate/core';
import { WeatherData } from '../../interfaces/weatherData.interface';

@Component({
  selector: 'app-favorite-list',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './favorite-list.component.html',
  styleUrls: ['./favorite-list.component.css'],
})
export class FavoriteListComponent implements OnInit {
  favorites: WeatherData[] = [];

  constructor(private readonly weatherService: WeatherService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.weatherService.favorites$.subscribe((fav) => {
      this.favorites = fav;
    });
  }

  removeFromFavorites(city: any): void {
    this.weatherService.removeFavorite(city);
    this.loadFavorites();
  }

  clearFavorites(): void {
    this.favorites = [];
    this.weatherService.clearFavorites();
  }

  trackByFn(index: number, city: any): string {
    return city.name;
  }

  loadMore() {
    this.weatherService.loadMoreFavorites();
  }
}
