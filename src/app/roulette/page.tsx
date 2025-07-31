'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { artists, Song } from '@/lib/songs';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function RouletteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const artistNames = useMemo(() => searchParams.get('artists')?.split(',') || [], [searchParams]);

  const songPool = useMemo(() => {
    return artists
      .filter(artist => artistNames.includes(artist.name))
      .flatMap(artist => artist.songs);
  }, [artistNames]);

  const [isSpinning, setIsSpinning] = useState(true);
  const [songToShow, setSongToShow] = useState<Song | null>(null);

  // Effect for the spinning reel
  useEffect(() => {
    if (isSpinning && songPool.length > 0) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * songPool.length);
        setSongToShow(songPool[randomIndex]);
      }, 80); // Update every 80ms for a smooth reel effect
      return () => clearInterval(interval);
    }
  }, [isSpinning, songPool]);

  // Effect to select an initial song when the component loads
  useEffect(() => {
    if (songPool.length > 0 && !songToShow) {
      const randomIndex = Math.floor(Math.random() * songPool.length);
      setSongToShow(songPool[randomIndex]);
    }
  }, [songPool, songToShow]);

  const handleToggleSpin = () => {
    setIsSpinning(prev => !prev);
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-lg p-6">
        <CardContent className="flex flex-col items-center gap-6">
            <div className="border-2 border-gray-300 rounded-lg w-full flex justify-center items-center h-48">
                {songToShow ? (
                    <div className="text-center p-4">
                        <h2 className="text-2xl font-bold mb-2">{songToShow.title}</h2>
                        <p className="text-xl mb-2">{songToShow.artist}</p>
                        {!isSpinning && (
                          <div className="flex justify-center gap-8 text-lg mt-4">
                              <p>TJ: <span className="font-bold">{songToShow.tj}</span></p>
                              <p>KY: <span className="font-bold">{songToShow.ky}</span></p>
                          </div>
                        )}
                    </div>
                ) : (
                    <div className="text-lg">No songs selected or available.</div>
                )}
            </div>
            
            <div className="flex flex-row gap-4 mt-4 w-full justify-center">
                <Button onClick={() => router.back()} variant="outline" className="w-full sm:w-auto">Back</Button>
                <Button 
                  onClick={handleToggleSpin} 
                  className="w-full sm:w-auto border-2 border-blue-700"
                  disabled={songPool.length === 0}
                >
                  {isSpinning ? 'Stop' : 'Spin Again'}
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Roulette() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RouletteContent />
        </Suspense>
    );
}
