# Weather App - Angular 17.3.0 with SSR (Server-Side Rendering)

Este proyecto es una aplicación para visualizar el clima en tiempo real, utilizando Angular 17.3.0 con SSR (Server-Side Rendering). La aplicación se conecta a WeatherAPI para obtener los datos meteorológicos y presenta las condiciones del clima, historial de búsqueda, y favoritos de manera interactiva.

## Índice

1. [Instrucciones para configurar y ejecutar el proyecto](##configuración-y-ejecución)
2. [Integración con WeatherAPI y optimizaciones](#integración-con-weatherapi-y-optimizaciones)
3. [Pruebas Unitarias](#pruebas-unitarias)
4. [Buenas prácticas y arquitectura del proyecto](#buenas-prácticas)

## Configuración y Ejecución

Para ejecutar este proyecto, sigue estos pasos:

### 1. Clonar el repositorio

Clona el repositorio desde GitHub a tu máquina local:

```bash
git clone https://github.com/refm130995/Senior-Angular-Frontend-TEST
cd Senior-Angular-Frontend-TEST
```

### 2. Instalar dependencias

Instala las dependencias del proyecto con el siguiente comando:
```bash
npm install
```

### 3. Ejecutar el proyecto en modo desarrollo

Para iniciar el servidor en modo desarrollo, usa el siguiente comando:
```bash
npm run start
```
o

```bash
ng serve
```

### Si desea ejecutar el el proyecto en modo desarrollo con SSR (Server-Side Rendering), usa el siguiente comando:

```bash

```

### Integración con WeatherAPI y Optimización
Integración con WeatherAPI
La aplicación hace uso de la API externa WeatherAPI para obtener los datos meteorológicos. El flujo de integración se maneja a través de un servicio Angular que realiza peticiones HTTP usando el cliente HttpClient de Angular. Se creó un servicio dedicado para centralizar todas las interacciones con WeatherAPI, gestionando tanto las peticiones como los posibles errores.


```bash
npm run serve:ssr:weather-app
```


### Optimización de Carga con Angular Universal (SSR)
Para mejorar el tiempo de carga inicial, hemos implementado Angular Universal con SSR (Server-Side Rendering). Esto permite que el servidor renderice la página antes de enviarla al cliente, lo cual:

### Mejora la performance al reducir el tiempo de carga inicial.
Optimiza el SEO al permitir que los motores de búsqueda indexen contenido generado del lado del servidor.
El SSR también mejora la experiencia de usuario al proporcionar contenido visual de manera más rápida, lo que es especialmente útil para aplicaciones con muchas consultas a APIs externas, como WeatherAPI.

Además, la comunicación con la API se realiza de manera eficiente y se optimiza el tráfico mediante el uso de rxjs y async/await en servicios para manejar correctamente las peticiones asincrónicas.

### Pruebas Unitarias
Este proyecto incluye pruebas unitarias para garantizar que cada parte de la aplicación funcione correctamente y esté bien aislada. Se utiliza Jasmine junto con Karma para ejecutar las pruebas.

### Ejemplo de Prueba para el Servicio de Clima
El siguiente es un ejemplo de cómo se prueba el servicio WeatherService:

```bash
npm run serve:ssr:weather-app
```
Para ejecutar las pruebas, usa el siguiente comando:
```bash
ng test
```

### Buenas Prácticas y Arquitectura del Proyecto
Beneficios de la Arquitectura Utilizada
#### A. Modularización por Características (Feature Modules)
La aplicación está dividida en módulos de características (features), cada uno representando una funcionalidad específica:
#### weather-search: Maneja la búsqueda de información meteorológica.
#### weather-result: Presenta los resultados de la búsqueda.
#### weather-view: Muestra la información detallada de un clima seleccionado.
Beneficio: Esto permite un mejor aislamiento de las funcionalidades, facilitando su mantenimiento y escalabilidad.
#### B. Core Module (Módulo de Núcleo)
Contiene servicios esenciales como:
#### api.service.ts: Para la comunicación con WeatherAPI.
#### loading.service.ts: Manejo de estados de carga globales.
#### local-storage.service.ts: Persistencia de datos en el navegador.
#### interceptors/error.interceptor.ts: Intercepta errores y mejora el manejo de respuestas.
#### Esto evita la duplicación de código y centraliza la lógica de negocio compartida.
#### C. Shared Module (Módulo Compartido)
Contiene componentes reutilizables (favorite-list, history-list, weather-card, etc.), pipes, directivas, y módulos de estado (NgRx).

Facilita la reutilización de código en toda la aplicación.
Mantiene la cohesión, evitando que cada módulo tenga que redefinir la misma funcionalidad.

### 1. Modularización del Proyecto
El proyecto está dividido en módulos según las funcionalidades. Cada módulo se encarga de una parte específica del sistema, como el módulo de búsqueda de clima, historial de búsquedas, favoritos, etc. Esto permite un desarrollo más organizado y facilita la expansión futura.

### 2. Servicios Reutilizables y Componentes Autónomos
Los servicios y componentes han sido diseñados para ser reutilizables, autónomos y desacoplados. Esto facilita tanto las pruebas unitarias como la reutilización en otras partes del sistema.

### 3. Uso de async/await y rxjs para Manejo de Asincronía
El manejo de peticiones HTTP se realiza de manera eficiente con rxjs y async/await. Esto mejora la legibilidad del código y optimiza las peticiones asincrónicas.

### 4. Control de Errores
La gestión de errores en las peticiones HTTP está centralizada y se maneja mediante interceptores para interceptar cualquier error de la API y mostrar mensajes amigables al usuario.

### 5. SEO y Accesibilidad Mejorados con Angular Universal (SSR)
El uso de SSR no solo mejora el SEO, sino también la accesibilidad del sitio para usuarios con dispositivos y conexiones limitadas, dado que el contenido se entrega rápidamente.

### 6. Uso de Componentes Standalone
Este proyecto adopta el enfoque de componentes standalone, una de las mejoras introducidas en Angular para simplificar la arquitectura del código. En lugar de depender de módulos tradicionales (NgModule), cada componente, directiva y pipe puede declararse y usarse de forma independiente, lo que mejora la mantenibilidad y reduce la complejidad del código.

### 7. Optimización del Consumo de la API
En este proyecto, se han implementado varias técnicas avanzadas para optimizar el rendimiento y minimizar las llamadas innecesarias a la API de WeatherAPI, mejorando la eficiencia y la experiencia del usuario.

### 7.1 Mecanismo de Caché para Evitar Múltiples Llamadas
Para evitar realizar múltiples solicitudes al mismo endpoint con los mismos parámetros, se implementó un mecanismo de caché utilizando Map y operadores de RxJS como shareReplay.

##### Reduce la latencia al reutilizar datos previamente obtenidos.
##### Minimiza el consumo de la API, evitando solicitudes innecesarias.
##### Mejora la experiencia del usuario al cargar los datos más rápido.

### 7.2 Paginación y Carga Diferida
Para evitar que el historial de búsquedas o la lista de favoritos crezca sin control y afecte el rendimiento, se aplicaron técnicas de paginación y carga diferida (lazy loading).


##### Evita renderizar listas muy grandes, mejorando el rendimiento.
##### Reduce el consumo de memoria al cargar solo los elementos visibles.
##### Optimiza la navegación y la experiencia del usuario.


### Beneficios de los Componentes Standalone en el Proyecto:
Menos dependencia de módulos: No es necesario declarar los componentes en un módulo (NgModule), lo que hace que la estructura del código sea más clara y modular.
### Carga más rápida:
La eliminación de módulos innecesarios reduce la sobrecarga de inicialización y optimiza el rendimiento.
### Mayor reutilización y flexibilidad:
Al ser independientes, los componentes pueden reutilizarse fácilmente en diferentes partes de la aplicación sin depender de un módulo específico.
### Mejor integración con SSR:
La reducción en la estructura de módulos hace que el SSR sea más eficiente y rápido.