'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';

const Wheel = dynamic(() => import('react-custom-roulette').then((mod) => mod.Wheel), {
  ssr: false,
});

const data = [
  { option: 'Ebba', style: { backgroundColor: 'green', textColor: 'black' } },
  { option: 'Hassan', style: { backgroundColor: 'white', textColor: 'black' } },
  { option: 'Kevin', style: { backgroundColor: 'blue', textColor: 'white' } },
  { option: 'Shayan', style: { backgroundColor: 'purple', textColor: 'white' } },
  { option: 'Adam', style: { backgroundColor: 'red', textColor: 'white' } },
  { option: 'Rania', style: { backgroundColor: 'yellow', textColor: 'black' } },
  { option: 'Farnush', style: { backgroundColor: 'pink', textColor: 'white' } },
  { option: 'Victor', style: { backgroundColor: 'orange', textColor: 'white' } },
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
    <div className='flex flex-col items-center justify-center min-h-screen gap-8'>
      <Typography variant="h3" gutterBottom>
        Secret Santa Wheel
      </Typography>
      <Wheel mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        backgroundColors={['#3e3e3e', '#df3428']}
        textColors={['#ffffff']}
        onStopSpinning={() => setMustSpin(false)} />
      <Button variant="contained" onClick={handleSpinClick} disabled={mustSpin}>SPIN THE WHEEL</Button>
      <Dialog open={hasSpun}>
        <div className="p-6">
          <Typography variant="h6">{data[prizeNumber].option}</Typography>
        </div>
      </Dialog>
    </div>);
}
