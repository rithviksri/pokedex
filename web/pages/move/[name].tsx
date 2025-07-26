import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { Move } from '@/types/move';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { name } = context.params!;

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/move/${name}`);
    const move: Move = await res.json();

    const effect = move.effect_entries.find((entry: { language: { name: string } }) => entry.language.name === 'en')?.effect || 'No effect description available.';

    return {
      props: {
        move,
        effect,
      },
    };
  } catch (error) {
    console.error(error); 
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

export default function MoveDetail({ move, effect }: { move: Move; effect: string }) {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-4">{formatPokemonName(move.name)}</h1>
        <div className="space-y-4">
          <p>
            <span className="font-bold">Type:</span>{" "}
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              {capitalizeFirstLetter(move.type.name)}
            </span>
          </p>
          <p>
            <span className="font-bold">Power:</span>{" "}
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
              {move.power || 'N/A'}
            </span>
          </p>
          <p>
            <span className="font-bold">Accuracy:</span>{" "}
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
              {move.accuracy || 'N/A'}
            </span>
          </p>
          <p>
            <span className="font-bold">Effect:</span>{" "}
            <span className="text-gray-700">{effect}</span>
          </p>
        </div>
        <div className="mt-6 text-center">
          <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}