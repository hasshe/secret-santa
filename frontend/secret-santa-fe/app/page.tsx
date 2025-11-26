'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const Wheel = dynamic(() => import('react-custom-roulette').then((mod) => mod.Wheel), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();

  const [data, setData] = useState([
    { option: 'Loading...', style: { backgroundColor: 'red', textColor: 'white' } }
  ]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [hasSpunOnce, setHasSpunOnce] = useState(false);
  const hasSpun = hasSpunOnce && mustSpin === false;

  useEffect(() => {
    const authStatus = Cookies.get('authenticated');
    if (authStatus !== 'true') {
      router.push('/login');
      return;
    }
  }, [router]);

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then(res => res.json())
      .then(usersResponse => {
        const wheelData = usersResponse.users.map((user: { id: number; name: string }, index: number) => ({
          option: user.name,
          style: {
            backgroundColor: index % 2 === 0 ? 'red' : 'white',
            textColor: index % 2 === 0 ? 'white' : 'red'
          }
        }));
        setData(wheelData);
      })
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
    setHasSpunOnce(true);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-8'>
      <Wheel mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        backgroundColors={['#3c3535ff', '#e9e9e9ff']}
        textColors={['#ffffff']}
        onStopSpinning={() => setMustSpin(false)}
        spinDuration={0.5}
        disableInitialAnimation={true} />
      <Button variant="contained" onClick={handleSpinClick} disabled={mustSpin}
        sx={{ fontWeight: 'bold', backgroundColor: 'white', color: 'red', '&:hover': { backgroundColor: '#d12020ff' } }}>
        SPIN THE WHEEL
      </Button>
      <Dialog open={hasSpun}>
        <div className="p-6" style={{ backgroundColor: '#ffffffff' }}>
          <Typography variant="h4" fontWeight="bold">{data[prizeNumber].option}</Typography>
        </div>
      </Dialog>
    </div>
  );
}
