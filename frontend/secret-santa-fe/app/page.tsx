'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import Snowfall from 'react-snowfall';

const Wheel = dynamic(() => import('react-custom-roulette').then((mod) => mod.Wheel), {
  ssr: false,
});

const data = [
  { option: 'Ebba', style: { backgroundColor: 'red', textColor: 'white' } },
  { option: 'Hassan', style: { backgroundColor: 'white', textColor: 'red' } },
  { option: 'Kevin', style: { backgroundColor: 'red', textColor: 'white' } },
  { option: 'Shayan', style: { backgroundColor: 'white', textColor: 'red' } },
  { option: 'Adam', style: { backgroundColor: 'red', textColor: 'white' } },
  { option: 'Rania', style: { backgroundColor: 'white', textColor: 'red' } },
  { option: 'Farnush', style: { backgroundColor: 'red', textColor: 'white' } },
  { option: 'Victor', style: { backgroundColor: 'white', textColor: 'red' } },
]

export default function Home() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const hasSpun = prizeNumber !== 0 && mustSpin === false;

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-8'
      style={{ backgroundImage: 'url(backdrop.png)', backgroundSize: 'cover' }}>
      <Wheel mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        backgroundColors={['#3c3535ff', '#df3428']}
        textColors={['#ffffff']}
        onStopSpinning={() => setMustSpin(false)} />
      <Button variant="contained" onClick={handleSpinClick} disabled={mustSpin}>SPIN THE WHEEL</Button>
      <Dialog open={hasSpun}>
        <div className="p-6" style={{ backgroundColor: '#ffffffff' }}>
          <Typography variant="h4" fontWeight="bold">{data[prizeNumber].option}</Typography>
        </div>
      </Dialog>
      <Snowfall />
    </div>
  );
}
