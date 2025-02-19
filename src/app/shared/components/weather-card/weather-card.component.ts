import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherData } from '../../../core/services/weather.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './weather-card.component.html',
  styleUrls: ['./weather-card.component.css']
})
export class WeatherCardComponent {
  @Input() weather: WeatherData | null = null;
}
