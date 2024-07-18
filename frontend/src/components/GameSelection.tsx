'use client';
import { useState } from 'react';

const games = [
  { name: 'Apex Legends', image: '/01_Apex_Legends_140x175@2x.avif', fps: '60-100' },
  { name: 'Cyberpunk 2077', image: '/cover_cyberpunk_140x175@2x.avif', fps: '30-50' },
  { name: 'Valorant', image: '/v_140x175@2x.jpg', fps: '120-200' },
  { name: 'The Finals', image: '/tf_140x175@2x.jpg', fps: '60-90' },
  { name: 'Red Dead Redemption 2', image: '/RDR2_140x175@2x.avif', fps: '40-60' },
  { name: 'GTA V', image: '/11_GTA_V_140x175@2x.avif', fps: '50-70' },
  { name: 'Fortnite', image: '/09_Fortnite_140x175@2x.avif', fps: '70-100' },
  { name: 'Counter Strike 2', image: '/BR_CS2_Icon_2_140x175@2x.avif', fps: '100-200' },
  { name: 'COD Warzone', image: '/cover_cod_warzone_140x175@2x.avif', fps: '60-90' },
  { name: 'League of Legends', image: '/14_League_Of_Legends_140x175@2x.avif', fps: '100-150' },
  { name: 'Forza Horizon 5', image: '/fh5_140x175@2x.jpg', fps: '50-70' },
  { name: 'Программирование / 3D дизайн', image: '/programming_3d_design.jpg', fps: 'N/A' },
];

export default function GameSelection({ onGamesSelected }: { onGamesSelected: (selectedGames: string[]) => void }) {
  const [selectedGames, setSelectedGames] = useState<string[]>([]);

  const handleGameClick = (game: string) => {
    if (game === 'Программирование / 3D дизайн') {
      setSelectedGames(prevSelected => 
        prevSelected.includes(game) ? [] : [game]
      );
    } else {
      setSelectedGames(prevSelected => {
        if (prevSelected.includes('Программирование / 3D дизайн')) return prevSelected;
        return prevSelected.includes(game)
          ? prevSelected.filter(g => g !== game)
          : prevSelected.length < 3
          ? [...prevSelected, game]
          : prevSelected;
      });
    }
  };

  const handleSubmit = () => {
    onGamesSelected(selectedGames);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-green-400">Выберите свои топ-3 игры или Программирование / 3D дизайн</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {games.map(game => (
          <div
            key={game.name}
            className={`relative cursor-pointer border-4 ${selectedGames.includes(game.name) ? 'border-green-500' : 'border-transparent'}`}
            onClick={() => handleGameClick(game.name)}
          >
            <img src={game.image} alt={game.name} className="w-full h-auto rounded-lg" />
            {selectedGames.includes(game.name) && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                <span className="text-white text-2xl font-bold text-center p-4">{game.fps} FPS</span>
              </div>
            )}
            {game.name === 'Программирование / 3D дизайн' && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                <span className="text-white text-xl font-bold text-center p-4">{game.name}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center mt-6">
        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
          disabled={selectedGames.length === 0 || (selectedGames.length > 1 && selectedGames.includes('Программирование / 3D дизайн'))}
        >
          Далее
        </button>
      </div>
    </div>
  );
}
