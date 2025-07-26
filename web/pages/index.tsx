import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';

async function fetchPokemonList(offset: number) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=50&offset=${offset}`);
  const data = await res.json();
  const resultsWithSprites = await Promise.all(
    data.results.map(async (pokemon: { url: string }) => {
      const details = await fetch(pokemon.url).then((res) => res.json());
      return { ...pokemon, sprite: details.sprites.front_default };
    })
  );
  return { results: resultsWithSprites, count: data.count };
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatPokemonName(name: string) {
  return name
    .split('-')
    .map((word) => capitalizeFirstLetter(word))
    .join(' ');
}

export default function Home() {
  const [page, setPage] = useState(0);
  const offset = page * 50;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['pokemonList', offset],
    queryFn: () => fetchPokemonList(offset),
  });

  if (isLoading) return <p className="text-center mt-8">Loading Pokémon...</p>;
  if (isError || !data) return <p className="text-center mt-8 text-red-500">Failed to load Pokémon.</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Pokédex</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data.results.map((pokemon: { name: string; url: string; sprite: string }, index: number) => (
          <li key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <Link href={`/pokemon/${pokemon.name}`} className="flex items-center space-x-4">
              <Image src={pokemon.sprite} alt={pokemon.name} width={64} height={64} className="w-16 h-16" />
              <span className="text-xl font-semibold text-blue-600 hover:text-blue-800">
                {formatPokemonName(pokemon.name)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={!data || offset + 50 >= data.count}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}