import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Loading from "../components/loading/Loading";
import ProgressBar from "../components/progress-bar/ProgressBar";

/**
 * Componente auxiliar para renderizar la tarjeta de un Pokémon resultado de la búsqueda global.
 * Utiliza useQuery para obtener los detalles del Pokémon.
 */
function SearchPokemonCard({ pokemon }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["pokemon", pokemon.name],
    queryFn: async () => {
      const res = await fetch(pokemon.url);
      if (!res.ok) throw new Error("Failed to fetch Pokémon details");
      const data = await res.json();
      return {
        name: data.name,
        sprite: data.sprites?.front_default || null,
        types: data.types.map((t) => t.type.name),
      };
    },
  });

  if (isLoading)
    return (
      <div className="p-4 text-center">
        <p>Cargando...</p>
      </div>
    );
  if (isError)
    return (
      <div className="p-4 text-center">
        <p>Error: {error.message}</p>
      </div>
    );

  return (
    <Link to={`/pokemon/${data.name}`} className="block">
      <div
        className="capitalize flex items-center gap-4 p-2 border rounded shadow
                   transition transform duration-200 hover:scale-[1.01]"
      >
        {data.sprite ? <img src={data.sprite} alt={data.name} className="w-30 h-30" /> : <p>Imagen no disponible</p>}
        <div>
          <h2 className="font-semibold text-2xl lg:text-4xl mb-1 lg:mb-3">{data.name}</h2>
          <p className="text-lg lg:text-2xl text-gray-600">{data.types.join(", ")}</p>
        </div>
      </div>
    </Link>
  );
}

/**
 * Home: Componente principal que muestra la grilla de Pokémon e incluye:
 * - Una barra de búsqueda para filtrar globalmente mediante un query (limit=10000)
 * - Un grid paginado usando useInfiniteQuery (cuando no se está buscando)
 * - Loader inicial (4 segundos) y loader para búsqueda (2 segundos)
 * - Historial de búsqueda persistido en localStorage (se muestran cuando el input está vacío)
 */
export default function Home() {
  // Loader inicial de 4 segundos.
  const [showLoading, setShowLoading] = useState(true);
  const loadingRef = useRef(null);
  // Input de búsqueda (controlado).
  const [searchQuery, setSearchQuery] = useState("");
  // Loader extra para búsqueda (2 segundos).
  const [searchLoading, setSearchLoading] = useState(false);
  // Estado para almacenar el historial de búsqueda (se carga desde localStorage).
  // Inicializa el historial de búsqueda desde localStorage (lazy initialization)
  const [searchHistory, setSearchHistory] = useState(() => {
    const stored = localStorage.getItem("searchHistory");
    return stored ? JSON.parse(stored) : [];
  });

  /**
   * Carga el historial de búsqueda desde localStorage al montar el componente.
   */
  useEffect(() => {
    const storedHistory = localStorage.getItem("searchHistory");
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  /**
   * Actualiza localStorage cada vez que cambia el historial de búsqueda.
   */
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  /**
   * Cada vez que searchQuery cambie (y no esté vacío), se activa un loader de 2 segundos.
   * Al finalizar, se agrega el query al historial (si no está ya registrado).
   */
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      setSearchLoading(true);
      const timer = setTimeout(() => {
        setSearchLoading(false);
        setSearchHistory((prev) => {
          if (prev.includes(searchQuery)) return prev;
          // Se agregan al inicio, y se limita a 10 elementos.
          return [searchQuery, ...prev].slice(0, 10);
        });
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setSearchLoading(false);
    }
  }, [searchQuery]);

  /**
   * Función para obtener los detalles de un Pokémon (para paginación).
   * Extrae únicamente nombre, sprite y tipos.
   */
  const fetchPokemonDetail = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch Pokémon details");
    const data = await response.json();
    return {
      name: data.name,
      sprite: data.sprites?.front_default || null,
      types: data.types.map((t) => t.type.name),
    };
  };

  /**
   * Función para obtener la lista paginada de Pokémon.
   * Se usa Promise.allSettled para evitar que un fallo individual rompa la consulta.
   */
  const fetchPokemons = async ({ pageParam = "https://pokeapi.co/api/v2/pokemon?limit=20" }) => {
    const res = await fetch(pageParam);
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    const detailedResults = await Promise.allSettled(data.results.map((pokemon) => fetchPokemonDetail(pokemon.url)));
    return {
      ...data,
      results: detailedResults.filter((result) => result.status === "fulfilled").map((result) => result.value),
    };
  };

  // useInfiniteQuery para el grid paginado.
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteQuery({
    queryKey: ["pokemons"],
    queryFn: fetchPokemons,
    getNextPageParam: (lastPage) => lastPage.next || undefined,
  });

  // useQuery para obtener globalmente todos los Pokémon (para búsqueda global).
  const {
    data: allData,
    // eslint-disable-next-line no-unused-vars
    isLoading: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
  } = useQuery({
    queryKey: ["allPokemons"],
    queryFn: async () => {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000");
      if (!res.ok) throw new Error("Failed to fetch all Pokémon");
      return res.json();
    },
  });

  // Depuración: ver data de paginación.
  useEffect(() => {
    console.log("Paginated Data:", data);
  }, [data]);

  // useEffect para el loader inicial (4 segundos).
  useEffect(() => {
    if (!isLoading) {
      loadingRef.current = setTimeout(() => {
        setShowLoading(false);
      }, 4000);
    }
    return () => clearTimeout(loadingRef.current);
  }, [isLoading]);

  // Manejo de errores.
  if (isError) return <p className="text-red-500">Error: {error.message}</p>;
  if (isErrorAll) return <p className="text-red-500">Error: {errorAll.message}</p>;

  // Listado global de Pokémon obtenido de la consulta global.
  const allPokemonList = allData?.results || [];

  // Filtra el listado global según searchQuery (búsqueda sin distinción de mayúsculas).
  const filteredGlobal = searchQuery ? allPokemonList.filter((pokemon) => pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())) : [];

  return (
    <div className="p-4 w-full">
      <h1 className="text-4xl lg:text-6xl font-bold text-center mb-4">Pokémon Explorer</h1>

      {/* Barra de búsqueda, siempre visible, con fondo #f8f8f8 */}
      <div className="mb-4">
        <input type="text" placeholder="Buscar Pokémon..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full border border-gray-300 bg-[#f8f8f8] px-4 py-2 rounded focus:outline-none focus:ring focus:border-blue-300" />
      </div>

      {/* Se muestra el historial de búsqueda cuando el input está vacío */}
      {searchQuery.trim() === "" && searchHistory.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((item) => (
              <button key={item} onClick={() => setSearchQuery(item)} className="px-3 py-1 border border-black border-opacity-[0.2] rounded-full text-sm hover:bg-gray-100">
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loader inicial: se muestra mientras se esté cargando o no se cumpla el timeout mínimo */}
      {(isLoading || showLoading) && (
        <div className="flex justify-center items-center h-screen">
          <Loading />
        </div>
      )}

      {/* Renderizado del grid cuando ya no se esté cargando el loader inicial */}
      {!isLoading && !showLoading && (
        <>
          {searchQuery ? (
            // Si hay búsqueda, se muestra un loader de búsqueda de 2 segundos antes de ver resultados
            searchLoading ? (
              <div className="flex justify-center items-center h-screen">
                <Loading />
              </div>
            ) : (
              <div className="lg:px-4 grid gap-6 grid-cols-1 md:grid-cols-2">
                {filteredGlobal.length > 0 ? (
                  // Se limita a los 50 primeros resultados para no cargar demasiadas tarjetas
                  filteredGlobal.slice(0, 50).map((pokemon) => <SearchPokemonCard key={pokemon.name} pokemon={pokemon} />)
                ) : (
                  <p className="text-center col-span-full">No se encontraron Pokémon</p>
                )}
              </div>
            )
          ) : (
            // Si no hay búsqueda, se muestra el grid de la paginación.
            <>
              <div className="lg:px-4 grid gap-6 grid-cols-1 md:grid-cols-2">
                {data?.pages?.flatMap((page) =>
                  page.results.map((pokemon) => (
                    <Link to={`/pokemon/${pokemon.name}`} key={pokemon.name} className="block">
                      <div className="capitalize flex items-center gap-4 p-2 border rounded shadow transition transform duration-200 hover:scale-[1.01]">
                        {pokemon.sprite ? <img src={pokemon.sprite} alt={pokemon.name} className="w-30 h-30" /> : <p>Imagen no disponible</p>}
                        <div>
                          <h2 className="font-semibold text-2xl lg:text-4xl mb-1 lg:mb-3">{pokemon.name}</h2>
                          <p className="text-lg lg:text-2xl text-gray-600">{pokemon.types.join(", ")}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
              <div className="mt-4 text-center">
                <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage} className="bg-blue-600 text-white px-4 py-2 font-bold rounded disabled:opacity-50 w-full lg:w-1/4">
                  {isFetchingNextPage ? "Loading" : hasNextPage ? "LOAD MORE" : "You catched them all!"}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
