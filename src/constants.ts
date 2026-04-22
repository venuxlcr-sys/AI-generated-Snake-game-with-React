
import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber Drift',
    artist: 'Neon AI',
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_2267f33d02.mp3', // Placeholder synthwave
    duration: '3:20',
    cover: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=200&h=200&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Synth Pulse',
    artist: 'Synth-Mina',
    url: 'https://cdn.pixabay.com/audio/2022/01/21/audio_317424614d.mp3',
    duration: '2:45',
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200&h=200&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Digital Horizon',
    artist: 'Future Echo',
    url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_82c286e74b.mp3',
    duration: '4:10',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&h=200&auto=format&fit=crop'
  }
];

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const MIN_SPEED = 60;
export const SPEED_INCREMENT = 2;
