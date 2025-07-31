
const fs = require('fs');
const path = require('path');
const papa = require('papaparse');

const csvDir = path.join(__dirname, '../csv');
const outputDir = path.join(__dirname, '../src/lib');
const outputPath = path.join(outputDir, 'songs.ts');

const allArtists = [];

fs.readdirSync(csvDir).forEach(file => {
  if (path.extname(file) === '.csv') {
    const csvFilePath = path.join(csvDir, file);
    const csvFileContent = fs.readFileSync(csvFilePath, 'utf8');

    const artistName = path.basename(file, '.csv');
    const isVocaloid = path.basename(file, '.csv').toLowerCase() === 'vocaloid';

    const { data } = papa.parse(csvFileContent, {
      skipEmptyLines: true,
      // header: false, // data is already array of arrays
      // dynamicTyping: true, // to prevent automatic type conversion
    });

    const songs = data.map(row => ({
      title: row[0],
      artist: row[1],
      tj: row[2] || '-',
      ky: row[3] || '-',
    }));

    // Use the artist name from the first song in the CSV, unless it's Vocaloid
    const actualArtistName = songs.length > 0 ? songs[0].artist : artistName; // Fallback to filename if no songs

    if (isVocaloid) {
        allArtists.push({
            name: 'VOCALOID',
            songs: songs,
        });
    } else {
        allArtists.push({
            name: actualArtistName, // <-- 이 부분 변경
            songs: songs,
        });
    }
  }
});

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const tsContent = `
export interface Song {
  title: string;
  artist: string;
  tj: string | number;
  ky: string | number;
}

export interface Artist {
  name: string;
  songs: Song[];
}

export const artists: Artist[] = ${JSON.stringify(allArtists, null, 2)};
`;

fs.writeFileSync(outputPath, tsContent.trim());

console.log('Successfully processed CSV files and created songs.ts');
