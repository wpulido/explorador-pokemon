import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/loading/Loading";
import ProgressBar from "../components/progress-bar/ProgressBar";

/**
 * Componente que muestra la información detallada de un Pokémon.
 * Se utiliza react-query para la petición de datos y se incorpora un
 * setTimeout para que el loader se muestre al menos durante 4 segundos.
 */
export default function Pokemon() {
  // Obtenemos el nombre del Pokémon desde los parámetros de la URL.
  const { name: pokemonName } = useParams();

  // Estado para forzar que el spinner de carga se muestre el tiempo mínimo.
  const [showLoading, setShowLoading] = useState(true);
  // useRef para almacenar la referencia del timer y poder limpiarlo en el desmontaje.
  const loadingRef = useRef(null);

  /**
   * Hook useQuery para obtener los detalles del Pokémon.
   * La query se refactoriza para lanzar un error en caso de respuesta no OK.
   */
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["pokemon", pokemonName],
    queryFn: async () => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      if (!response.ok) {
        throw new Error("Failed to fetch Pokémon details");
      }
      return response.json();
    },
  });

  // Log para inspeccionar la data (útil durante el desarrollo).
  useEffect(() => {
    console.log(data);
  }, [data]);

  /**
   * useEffect para manejar el tiempo mínimo del loader.
   * Cuando la carga finaliza (isLoading es false), se inicia un timeout
   * de 4 segundos para ocultar el componente de Loading.
   */
  useEffect(() => {
    if (!isLoading) {
      loadingRef.current = setTimeout(() => {
        setShowLoading(false);
      }, 4000);
    }
    // Limpiamos el timeout en caso de desmontaje o actualización de dependencias.
    return () => clearTimeout(loadingRef.current);
  }, [isLoading, data]);

  // Si ocurre un error en la consulta, se muestra un mensaje de error.
  if (isError) {
    return <p className="text-red-500">Error: {error.message}</p>;
  }

  // Valor máximo de referencia para las estadísticas (normalización de las ProgressBars).
  const maxStat = 255;

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between p-4 gap-x-20">
      {/*
        Renderizamos el componente Loading mientras:
          - La consulta aún está cargando (isLoading === true)
          - O la animación de loader aún está en curso (showLoading === true)
      */}
      {isLoading || showLoading ? (
        <div className="flex w-full justify-center text-center items-center h-screen">
          <Loading />
        </div>
      ) : (
        <>
          {/* Contenedor de imágenes y audio */}
          <div className="image-wrapper relative">
            {/* Imagen del marco ocupando todo el ancho del contenedor */}
            <img src="/pokedex-frame.jpg" alt="Pokedex Frame" className="w-full" />
            {/* Imagen del Pokémon centrada horizontal y verticalmente */}
            <img src={data?.sprites.front_default} alt={data?.name} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] lg:w-[350px]" />
            {/* Nota: Se asume que data?.cries?.latest existe; en producción conviene validar la existencia */}
            <audio controls autoPlay className="mt-4 hidden" src={data?.cries?.latest}></audio>
          </div>

          {/* Contenedor de información del Pokémon */}
          <div className="grow w-full mt-4 lg:mt-0 pokemon-info">
            <h1 className="uppercase text-2xl lg:text-4xl font-bold mb-2">
              <span className="font-bold text-red-600">Nº {data?.id} </span>
              {data?.name}
            </h1>
            {/* Renderizado de los tipos del Pokémon */}
            {data?.types.map((type, index) => (
              <span key={index} className={`inline-block px-3 py-1 rounded-full border border-black border-opacity-[0.2] uppercase text-sm font-medium mr-2 mb-2 ${type.type.name}`}>
                {type.type.name}
              </span>
            ))}
            <div className="flex items-stretch gap-2 my-4">
              <div className="border w-full border-black border-opacity-[0.2] p-4 rounded-lg">
                <h2 className="text-2xl font-semibold">Base Stats</h2>
                <div className="w-full">
                  {/* Se itera sobre las estadísticas del Pokémon y se representan con ProgressBar */}
                  {data?.stats.map((stat) => (
                    <div key={stat.stat.name} className="mb-2">
                      <p className="font-medium capitalize">
                        {stat.stat.name}: {stat.base_stat}
                      </p>
                      <ProgressBar statValue={stat.base_stat} maxStat={maxStat} />
                    </div>
                  ))}
                </div>
                <h2 className="text-2xl font-semibold">Abilities</h2>
                <ul className="list-disc pl-5">
                  {data?.abilities.map((ability, index) => (
                    <li key={index} className="capitalize">
                      {ability?.ability.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
