const criesUrl = 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest';
let currentAudio: HTMLAudioElement | null = null;

export function playPokemonCry(id: number) {
  currentAudio?.pause();
  currentAudio = new Audio(`${criesUrl}/${id}.ogg`);
  currentAudio.volume = 0.72;
  void currentAudio.play().catch(() => {
    currentAudio = null;
  });
}
