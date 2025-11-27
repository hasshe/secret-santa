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
  const [startingOptionIndex, setStartingOptionIndex] = useState(0);
  const hasSpun = hasSpunOnce && mustSpin === false;

  useEffect(() => {
    const authStatus = Cookies.get('authenticated');
    const token = Cookies.get('token');
    if (authStatus !== 'true' || token === undefined) {
      router.push('/login');
      return;
    }
  }, [router]);

  useEffect(() => {
    const token = Cookies.get('token');
    fetch('http://localhost:3000/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(usersResponse => {
        if (!usersResponse.users || !Array.isArray(usersResponse.users)) {
          console.error('Invalid users response:', usersResponse);
          router.push('/login');
          return;
        }
        const wheelData = usersResponse.users.map((user: { id: number; name: string }, index: number) => ({
          option: user.name,
          style: {
            backgroundColor: index % 2 === 0 ? 'red' : 'white',
            textColor: index % 2 === 0 ? 'white' : 'red'
          }
        }));
        setData(wheelData);
        setStartingOptionIndex(Math.floor(Math.random() * wheelData.length));
      })
      .catch(err => console.error('Error fetching users:', err));
  }, [router]);

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
    setHasSpunOnce(true);
    const selectedUserName = data[newPrizeNumber].option;
    updateHasSpunStatus(true, selectedUserName);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-8'>
      <Wheel mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data ? data : [{ option: "No Data", style: { backgroundColor: 'red', textColor: 'white' } }]}
        backgroundColors={['#3c3535ff', '#e9e9e9ff']}
        textColors={['#ffffff']}
        onStopSpinning={() => setMustSpin(false)}
        spinDuration={0.4}
        disableInitialAnimation={true}
        startingOptionIndex={startingOptionIndex} />
      <Button variant="contained" onClick={handleSpinClick} disabled={mustSpin}
        sx={{ fontWeight: 'bold', backgroundColor: 'white', color: 'red', '&:hover': { backgroundColor: '#d12020ff' } }}>
        SPIN THE WHEEL
      </Button>
      <Dialog open={hasSpun}>
        <div className="p-6" style={{ backgroundColor: '#ffffffff' }}>
          <Typography variant="h4" fontWeight="bold">
            {data[prizeNumber]?.option || 'Loading...'}
          </Typography>
        </div>
      </Dialog>
    </div>
  );
}

function updateHasSpunStatus(hasSpun: boolean, secretSantaName: string) {
  const token = Cookies.get('token');
  return fetch('http://localhost:3000/has-spun', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ hasSpun, secretSantaName }),
    credentials: 'include',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update hasSpun status');
      }
      return response.text();
    })
    .catch(error => {
      console.error('Error updating hasSpun status:', error);
    });
}
