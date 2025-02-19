import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WeatherService } from '../../../core/services/weather.service';
import { TranslateModule } from '@ngx-translate/core';
import { WeatherSearch } from '../../interfaces/weatherData.interface';

@Component({
  selector: 'app-history-list',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css'],
})
export class HistoryListComponent implements OnInit {
  @Output() citySelected: EventEmitter<string> = new EventEmitter<string>();
  history: WeatherSearch[] = [];

  constructor(private readonly weatherService: WeatherService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.weatherService.history$.subscribe((hist) => {
      this.history = hist;
    });
  }

  clearHistory(): void {
    this.weatherService.clearSearchHistory();
    this.history = [];
  }

  trackByFn(index: number, item: WeatherSearch): string {
    return item.city + item.timestamp;
  }

  onCitySelect(city: string) {
    this.citySelected.emit(city);
  }

  loadMore() {
    this.weatherService.loadMoreHistory();
  }
}
