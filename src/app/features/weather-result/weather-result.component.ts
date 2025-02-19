import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { WeatherCardComponent } from "../../shared/components/weather-card/weather-card.component";

@Component({
  selector: 'app-weather-result',
  standalone: true,
  imports: [CommonModule, TranslateModule, WeatherCardComponent],
  templateUrl: './weather-result.component.html',
})
export class WeatherResultComponent {
  @Input() weatherData: any;

  convertToFahrenheit(celsius: number): string {
    return ((celsius * 9) / 5 + 32).toFixed(1);
  }
  getWeatherIcon(iconCode: string): string {

    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

 show(){
    console.log(this.weatherData);
 }
}
