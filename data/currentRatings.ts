interface Rating {
  id: number;
  artistName: string[];
  albumName: string;
  releaseYear: string;
  songs: string[];
  image: string;
  status: boolean;
  genre: string;
  finalized: boolean;
  finalGrade?: number;
}

const currentRatings: Rating[] = [
  {
    id: 1,
    artistName: ['Jane Remover'],
    albumName: 'Revengeseekerz',
    releaseYear: '2025',
    genre: 'Hyperpop',
    songs: ['Angels In Camo', 'TWICE REMOVED', 'JRJRJR'],
    image: 'revengeseekerz.jpg',
    status: true,
    finalized: false,
  },
  {
    id: 2,
    artistName: ['Jane Remover'],
    albumName: '♡',
    releaseYear: '2025',
    genre: 'Shoegaze',
    songs: ['Angels In Camo', 'TWICE REMOVED', 'JRJRJR'],
    image: 'heart.jpg',
    status: false,
    finalized: true,
    finalGrade: 22,
  },
  {
    id: 3,
    artistName: ['Jane Remover'],
    albumName: 'Indie Rock',
    releaseYear: '2025',
    genre: 'Rap',
    songs: ['Angels In Camo', 'TWICE REMOVED', 'JRJRJR'],
    image: 'indierock.jpg',
    status: false,
    finalized: true,
    finalGrade: 65,
  },
  {
    id: 4,
    artistName: ['venturing'],
    albumName: 'Ghostholding',
    releaseYear: '2025',
    genre: 'Shoegaze',
    songs: ['Angels In Camo', 'TWICE REMOVED', 'JRJRJR'],
    image: 'ghostholding.jpg',
    status: false,
    finalized: true,
    finalGrade: 83,
  },
  {
    id: 5,
    artistName: ['leroy'],
    albumName: 'Status Update Music',
    releaseYear: '2026',
    genre: 'Remix',
    songs: ['Angels In Camo', 'TWICE REMOVED', 'JRJRJR'],
    image: 'status.jpg',
    status: false,
    finalized: true,
    finalGrade: 83,
  },
];

export default currentRatings;
