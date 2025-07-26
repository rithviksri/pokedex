import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';

interface Pokemon {
  name: string;
  sprites: { front_default: string };
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  moves: { move: { name: string } }[];
}

interface PokemonSpecies {
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { name } = context.params!;

  try {
    const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const pokemon: Pokemon = await pokemonRes.json();

    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
    const species: PokemonSpecies = await speciesRes.json();

    const description = species.flavor_text_entries.find((entry: { language: { name: string } }) => entry.language.name === 'en')?.flavor_text || 'No description available.';

    return {
      props: {
        pokemon,
        description,
      },
    };
  } catch (error) {
    console.error(error); // Log the error
    return {
      notFound: true,
    };
  }
};

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatPokemonName(name: string) {
  return name
    .split('-')
    .map((word) => capitalizeFirstLetter(word))
    .join(' ');
}

export default function PokemonDetail({ pokemon, description }: { pokemon: Pokemon; description: string }) {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-4">{formatPokemonName(pokemon.name)}</h1>
        <Image src={pokemon.sprites.front_default} alt={pokemon.name} width={192} height={192} className="mx-auto w-48 h-48" />
        <p className="mt-4 text-gray-700 text-center">{description}</p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-bold mb-2">Types</h2>
            <ul className="space-y-1">
              {pokemon.types.map((type, index) => (
                <li key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {capitalizeFirstLetter(type.type.name)}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Stats</h2>
            <ul className="space-y-1">
              {pokemon.stats.map((stat, index) => (
                <li key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {capitalizeFirstLetter(stat.stat.name)}: {stat.base_stat}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <h2 className="text-xl font-bold mt-6">Moves</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
          {pokemon.moves.slice(0, 10).map((move, index) => (
            <li key={index}>
              <Link href={`/move/${move.move.name}`} className="block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-200">
                {formatPokemonName(move.move.name)}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 text-center">
          <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}