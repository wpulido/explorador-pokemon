# Explorador Pokémon

**Explorador Pokémon** es una aplicación web creada con React y Vite que permite explorar y buscar Pokémon mediante la [PokeAPI](https://pokeapi.co/). La aplicación utiliza Tanstack Query para el manejo de datos (incluyendo paginación e infinite queries), Tailwind CSS para estilizar la interfaz y muestra además loaders y animaciones para ofrecer una experiencia de usuario fluida.

## Características

- **Listado de Pokémon paginado:**  
  Muestra un grid de tarjetas de Pokémon obtenido mediante infinite query. Cada tarjeta es clickeable y al hacer hover se aplica un sutil efecto de escala (hover:scale-[1.01]), dando dinamismo a la interfaz.

- **Búsqueda global con historial:**  
  Permite buscar Pokémon globalmente a partir de la data completa de la API. Los términos de búsqueda se persisten en localStorage y se muestran como historial cuando el input está vacío.

- **Loaders personalizados:**  
  Se muestra un loader inicial de 4 segundos al cargar la aplicación, y cada búsqueda activa un loader extra de 2 segundos antes de mostrar los resultados filtrados.

- **Responsive y estilizado:**  
  La UI se adapta a diferentes tamaños de pantalla usando Tailwind CSS, con un diseño limpio y funcional.

## Tecnologías utilizadas

- **Node.js:** v22.15.0
- **React**
- **Vite**
- **Tanstack Query (React Query)**
- **Tailwind CSS**
- **PokeAPI:** [https://pokeapi.co/](https://pokeapi.co/)

## Instalación y ejecución

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/wpulido/explorador-pokemon.git
   cd explorador-pokemon
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

3. **Inicia la aplicación:**

   ```bash
   npm run dev
   ```

   La aplicación se iniciará en [http://localhost:5173](http://localhost:5173).

## Estructura del proyecto

```
explorador-pokemon/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── loading/
│   │   │   └── Loading.jsx
│   │   └── progress-bar/
│   │       └── ProgressBar.jsx
│   ├── pages/
│   │   ├── Home.jsx        // Vista principal con grid, búsqueda y historial
│   │   └── Pokemon.jsx     // Vista detallada de cada Pokémon
│   ├── App.jsx             // Configuración de rutas y layout general
│   └── main.jsx            // Punto de entrada de la aplicación
├── package.json
└── README.md
```

## Consideraciones

- **Persistencia del historial:**  
  Se utiliza localStorage para guardar los términos de búsqueda, de forma que el historial persista entre recargas y sesiones.

- **Optimización de datos:**  
  La aplicación utiliza dos consultas principales:

  - Una query paginada (infinite query) para el listado de Pokémon.
  - Una query global para obtener todos los Pokémon y poder filtrar la búsqueda de forma global.

- **Experiencia de usuario:**  
  Se han implementado loaders fijos y transiciones animadas para mejorar la percepción de rendimiento y la interactividad de la interfaz.

## Contribuciones

Si deseas contribuir a Explorador Pokémon, siéntete libre de abrir issues o enviar pull requests. ¡Toda contribución es bienvenida!

## Licencia

Este proyecto se distribuye bajo la licencia [MIT](LICENSE).

---

Publicado por [wpulido](https://github.com/wpulido)
