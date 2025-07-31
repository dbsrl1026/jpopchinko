'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { artists } from '@/lib/songs';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";

export default function Home() {
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const jpopArtists = artists.filter(artist => artist.name !== 'VOCALOID');
  const vocaloidArtist = artists.find(artist => artist.name === 'VOCALOID');

  useEffect(() => {
    setIsMounted(true);
    const savedArtists = localStorage.getItem('selectedArtists');
    if (savedArtists) {
      setSelectedArtists(JSON.parse(savedArtists));
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('selectedArtists', JSON.stringify(selectedArtists));
    }
  }, [selectedArtists, isMounted]);

  const toggleArtist = (artistName: string) => {
    setSelectedArtists(prev =>
      prev.includes(artistName)
        ? prev.filter(name => name !== artistName)
        : [...prev, artistName]
    );
  };

  const selectAll = () => setSelectedArtists(artists.map(a => a.name));
  const deselectAll = () => setSelectedArtists([]);

  const startRoulette = () => {
    if (selectedArtists.length > 0) {
      router.push(`/roulette?artists=${selectedArtists.join(',')}`);
    }
  };

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-4xl sm:text-5xl font-extrabold text-center text-blue-600 dark:text-blue-300 drop-shadow-lg">J-팝칭코</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <Button onClick={selectAll} className="w-full sm:w-auto">모두 선택</Button>
            <Button onClick={deselectAll} variant="secondary" className="w-full sm:w-auto">모두 해제</Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
            {jpopArtists.map(artist => (
              <Toggle
                key={artist.name}
                pressed={selectedArtists.includes(artist.name)}
                onPressedChange={() => toggleArtist(artist.name)}
                variant="outline"
                className="w-full h-12 text-sm sm:text-base data-[state=on]:bg-blue-500 data-[state=on]:text-white data-[state=on]:border-blue-700"
              >
                {artist.name}
              </Toggle>
            ))}
          </div>

          {vocaloidArtist && (
            <>
              <div className="relative flex justify-center items-center my-6">
                <div className="absolute inset-x-0 h-px bg-gray-300"></div>
                <span className="relative bg-white px-4 text-gray-500 dark:bg-gray-900">너 이런거 좋아하니</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
                <Toggle
                  key={vocaloidArtist.name}
                  pressed={selectedArtists.includes(vocaloidArtist.name)}
                  onPressedChange={() => toggleArtist(vocaloidArtist.name)}
                  variant="outline"
                  className="w-full h-12 text-sm sm:text-base data-[state=on]:bg-purple-500 data-[state=on]:text-white data-[state=on]:border-purple-700"
                >
                  {vocaloidArtist.name}
                </Toggle>
              </div>
            </>
          )}

          <div className="mt-6">
            <Button
              onClick={startRoulette}
              disabled={selectedArtists.length === 0}
              className="w-full h-14 text-lg font-bold border-2 border-red-700"
            >
              룰렛 START
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}