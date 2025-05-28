import { useInfiniteQuery } from "@tanstack/react-query";

export default function Home() {
  const fetchPokemonDetail = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch Pokémon details");
    const data = await response.json();
    console.log("Fetched Pokémon detail:", data);
    return data;
  };

  const fetchPokemons = async ({ pageParam = "https://pokeapi.co/api/v2/pokemon?limit=20" }) => {
    try {
      const res = await fetch(pageParam);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();

      const detailedResults = await Promise.all(data.results.map((pokemon) => fetchPokemonDetail(pokemon.url)));

      return { ...data, results: detailedResults };
    } catch (err) {
      throw new Error("Failed to fetch Pokémons: " + err.message);
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteQuery({
    queryKey: ["pokemons"],
    queryFn: fetchPokemons,
    getNextPageParam: (lastPage) => lastPage.next || undefined,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="p-4 w-full">
      <h1 className="text-6xl font-bold text-center mb-4">Pokémon Explorer</h1>
      <div className="px-4 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {data.pages.flatMap((page) =>
          page.results.map((pokemon) => (
            <div key={pokemon.name} className="capitalize flex items-start gap-4 p-2 border rounded shadow">
              <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-30 h-30" />
              <div>
                <p className="font-semibold">{pokemon.name}</p>
                <p className="text-sm text-gray-600">{pokemon.types.map((t) => t.type.name).join(", ")}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-4">
        <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
          {isFetchingNextPage ? "Loading more..." : hasNextPage ? "Load more" : "No more Pokémon"}
        </button>
      </div>
    </div>
  );
}
