
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
    const isVocaloid = artistName.toLowerCase() === 'vocaloid';

    const { data } = papa.parse(csvFileContent, {
      skipEmptyLines: true,
    });

    const songs = data.map(row => ({
      title: row[0],
      artist: isVocaloid ? row[1] : artistName,
      tj: row[2] || '-',
      ky: row[3] || '-',
    }));

    if (isVocaloid) {
        allArtists.push({
            name: 'VOCALOID',
            songs: songs,
        });
    } else {
        allArtists.push({
            name: artistName,
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
