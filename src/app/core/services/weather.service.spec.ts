import { TestBed } from '@angular/core/testing';
import { WeatherService, WeatherData } from './weather.service';
import { ApiService } from './api.service';
import { LocalStorageService, WeatherSearch } from './local-storage.service';
import { LoadingService } from './loading.service';
import { BehaviorSubject, of, throwError } from 'rxjs';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpServiceSpy: jasmine.SpyObj<ApiService>;
  let localStorageSpy: jasmine.SpyObj<LocalStorageService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;

  class MockWeatherService {
    historySubject = new BehaviorSubject<WeatherSearch[]>([]);
    favoritesSubject = new BehaviorSubject<string[]>([]);

    getHistory() {
      return this.historySubject.getValue();
    }

    getFavorites() {
      return this.favoritesSubject.getValue();
    }

    addToHistory(city: WeatherSearch) {
      const currentHistory = this.historySubject.getValue();
      this.historySubject.next([...currentHistory, city]);
    }
  }

  beforeEach(() => {
    const httpSpy = jasmine.createSpyObj('ApiService', ['get']);
    const localSpy = jasmine.createSpyObj('LocalStorageService', [
      'addToHistory',
      'getHistory',
      'clearHistory',
      'addToFavorites',
      'getFavorites',
      'removeFromFavorites',
    ]);
    const loadingSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);

    TestBed.configureTestingModule({
      providers: [
        WeatherService,
        { provide: ApiService, useValue: httpSpy },
        { provide: LocalStorageService, useValue: localSpy },
        { provide: LoadingService, useValue: loadingSpy },
        { provide: WeatherService, useClass: MockWeatherService },
      ],
    });

    service = TestBed.inject(WeatherService);
    httpServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    localStorageSpy = TestBed.inject(
      LocalStorageService,
    ) as jasmine.SpyObj<LocalStorageService>;
    loadingServiceSpy = TestBed.inject(
      LoadingService,
    ) as jasmine.SpyObj<LoadingService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getWeatherByCity', () => {
    it('should return weather data for a city', (done) => {
      const mockWeather: WeatherData = {
        coord: { lon: -66.9036, lat: 10.4806 },
        weather: [
          { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
        ],
        base: 'stations',
        main: {
          temp: 30,
          feels_like: 32,
          temp_min: 29,
          temp_max: 31,
          pressure: 1012,
          humidity: 70,
        },
        visibility: 10000,
        wind: { speed: 3.6, deg: 90 },
        clouds: { all: 0 },
        dt: 1634567890,
        sys: {
          type: 1,
          id: 1234,
          country: 'VE',
          sunrise: 1634523456,
          sunset: 1634567890,
        },
        timezone: -14400,
        id: 3646738,
        name: 'Caracas',
        cod: 200,
      };

      httpServiceSpy.get.and.returnValue(of(mockWeather));

      service.getWeatherByCity('London').subscribe((data) => {
        expect(data).toEqual(mockWeather);
        expect(loadingServiceSpy.show).toHaveBeenCalled();
        expect(loadingServiceSpy.hide).toHaveBeenCalled();
        done();
      });
    });

    it('should return an error message when city is not found (404)', (done) => {
      const errorResponse = { status: 404 };
      httpServiceSpy.get.and.returnValue(throwError(() => errorResponse));

      service.getWeatherByCity('UnknownCity').subscribe({
        error: (error) => {
          expect(error.message).toBe(
            'City not found. Please check your input.',
          );
          expect(loadingServiceSpy.show).toHaveBeenCalled();
          expect(loadingServiceSpy.hide).toHaveBeenCalled();
          done();
        },
      });
    });
  });

  describe('searchCity', () => {
    it('should return city names', (done) => {
      const mockResponse = [
        { name: 'London', country: 'GB' },
        { name: 'Los Angeles', country: 'US' },
      ];

      httpServiceSpy.get.and.returnValue(of(mockResponse));

      service.searchCity('Lond').subscribe((cities) => {
        expect(cities).toEqual(['London, GB', 'Los Angeles, US']);
        done();
      });
    });

    it('should return an empty array for an empty query', (done) => {
      service.searchCity('').subscribe((cities) => {
        expect(cities).toEqual([]);
        done();
      });
    });
  });

  describe('Local Storage Methods', () => {
    it('should save a search', async () => {
      const mockCity: WeatherData = {
        coord: { lon: -66.9036, lat: 10.4806 },
        weather: [
          { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
        ],
        base: 'stations',
        main: {
          temp: 30,
          feels_like: 32,
          temp_min: 29,
          temp_max: 31,
          pressure: 1012,
          humidity: 70,
        },
        visibility: 10000,
        wind: { speed: 3.6, deg: 90 },
        clouds: { all: 0 },
        dt: 1634567890,
        sys: {
          type: 1,
          id: 1234,
          country: 'VE',
          sunrise: 1634523456,
          sunset: 1634567890,
        },
        timezone: -14400,
        id: 3646738,
        name: 'Caracas',
        cod: 200,
      };
      await service.saveSearch(mockCity);
      expect(localStorageSpy.addToHistory).toHaveBeenCalledWith(mockCity);
    });

    it('should get search history', async () => {
      const mockHistory: WeatherSearch[] = [
        {
          city: 'Caracas',
          timestamp: 1739911104975,
          weather: {
            coord: { lon: -66.9036, lat: 10.4806 },
            weather: [
              { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
            ],
            base: 'stations',
            main: {
              temp: 30,
              feels_like: 32,
              temp_min: 29,
              temp_max: 31,
              pressure: 1012,
              humidity: 70,
            },
            visibility: 10000,
            wind: { speed: 3.6, deg: 90 },
            clouds: { all: 0 },
            dt: 1634567890,
            sys: {
              type: 1,
              id: 1234,
              country: 'VE',
              sunrise: 1634523456,
              sunset: 1634567890,
            },
            timezone: -14400,
            id: 3646738,
            name: 'Caracas',
            cod: 200,
          },
        },
      ];

      localStorageSpy.getHistory.and.returnValue(mockHistory);

      const history = await service.getSearchHistory();
      expect(history).toEqual(mockHistory);
    });

    it('should clear search history', async () => {
      await service.clearSearchHistory();
      expect(localStorageSpy.clearHistory).toHaveBeenCalled();
    });

    it('should add a city to favorites', async () => {
      const mockCity: WeatherData = {
        coord: { lon: -66.9036, lat: 10.4806 },
        weather: [
          { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
        ],
        base: 'stations',
        main: {
          temp: 30,
          feels_like: 32,
          temp_min: 29,
          temp_max: 31,
          pressure: 1012,
          humidity: 70,
        },
        visibility: 10000,
        wind: { speed: 3.6, deg: 90 },
        clouds: { all: 0 },
        dt: 1634567890,
        sys: {
          type: 1,
          id: 1234,
          country: 'VE',
          sunrise: 1634523456,
          sunset: 1634567890,
        },
        timezone: -14400,
        id: 3646738,
        name: 'Caracas',
        cod: 200,
      };
      await service.addFavorite(mockCity);
      expect(localStorageSpy.addToFavorites).toHaveBeenCalledWith(mockCity);
    });

    it('should get favorite cities', () => {
      const mockFavorites: WeatherData[] = [
        { name: 'Tokyo', id: 1850147 } as WeatherData,
      ];
      localStorageSpy.getFavorites.and.returnValue(mockFavorites);

      const favorites = service.getFavorites();
      expect(favorites).toEqual(mockFavorites);
    });

    it('should remove a city from favorites', async () => {
      const mockCity = { name: 'Buenos Aires' } as WeatherData;
      await service.removeFavorite(mockCity);
      expect(localStorageSpy.removeFromFavorites).toHaveBeenCalledWith(
        mockCity,
      );
    });
  });

  describe('Pagination', () => {
    it('should load more history', () => {
      const mockHistory: WeatherSearch[] = Array(10).fill({ city: 'Rome' });
      localStorageSpy.getHistory.and.returnValue(mockHistory);

      service.loadMoreHistory();
      expect(service.historyPage).toBe(1);
    });

    it('should load more favorites', () => {
      const mockFavorites: WeatherData[] = Array(10).fill({
        name: 'Dubai',
      } as WeatherData);
      localStorageSpy.getFavorites.and.returnValue(mockFavorites);

      service.loadMoreFavorites();
      expect(service.favoritesPage).toBe(1);
    });
  });
});
