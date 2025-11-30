'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { ActiveProfile } from './active-profile';
import io from 'socket.io-client';
import Divider from '@mui/material/Divider';
import CountdownTimer from './countdown-timer';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
  const [startingOptionIndex, setStartingOptionIndex] = useState(0);
  const [userAlreadySpun, setUserAlreadySpun] = useState(false);
  const [secretSantaName, setSecretSantaName] = useState<string | null>(null);
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState<string | null>(null);
  const [pendingSecretSantaName, setPendingSecretSantaName] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      fetch(`${API_BASE}/current-user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setCurrentLoggedInUser(data.name);
        })
        .catch(err => console.error('Error fetching current user:', err));
    }
  }, []);

  useEffect(() => {
    const authStatus = Cookies.get('authenticated');
    const token = Cookies.get('token');
    if (authStatus !== 'true' || token === undefined) {
      router.push('/login');
      return;
    }
  }, [router]);

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    const selectedUserName = data[newPrizeNumber].option;
    setPendingSecretSantaName(selectedUserName);
    setMustSpin(true);
  };

  const fetchCurrentUser = useCallback(() => {
    const token = Cookies.get('token');
    fetch(`${API_BASE}/users`, {
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
        setUserAlreadySpun(usersResponse.users.some((user: { hasSpun?: boolean }) => user.hasSpun));
        setSecretSantaName(usersResponse.users.length === 1 ? usersResponse.users[0].name : null);
        const wheelData = usersResponse.users.map((user: { id: number; name: string }, index: number) => ({
          option: user.name,
          style: {
            backgroundColor: index % 2 === 0 ? 'red' : 'white',
            textColor: index % 2 === 0 ? 'white' : 'red'
          }
        }));
        setData(wheelData);
        if (wheelData.length > 0) {
          setStartingOptionIndex(Math.floor(Math.random() * wheelData.length));
        }
      })
      .catch(err => console.error('Error fetching users:', err));
  }, [router]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    const socket = io(API_BASE);
    const handler = (message: string) => {
      console.log('Received hasSpunUpdated message:', message);
      fetchCurrentUser();
    };
    socket.on('hasSpunUpdated', handler);
    return () => {
      socket.off('hasSpunUpdated', handler);
      socket.disconnect();
    };
  }, [fetchCurrentUser]);

  return (
    <div>
      <ActiveProfile name={currentLoggedInUser || 'Guest'} />
      <div className='flex flex-col items-center justify-center min-h-screen gap-8'>
        {
          data && data.length > 0 && !userAlreadySpun && secretSantaName === null ? (
            <Wheel mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={data ? data : [{ option: "No Data", style: { backgroundColor: 'red', textColor: 'white' } }]}
              backgroundColors={['#3c3535ff', '#e9e9e9ff']}
              textColors={['#ffffff']}
              // when spin stops, send the update to the server so UI doesn't jump away mid-animation
              onStopSpinning={async () => {
                setIsUpdating(true);
                if (pendingSecretSantaName) {
                  try {
                    await updateHasSpunStatus(true, pendingSecretSantaName);
                    setPendingSecretSantaName(null);
                  } catch (e) {
                    console.error('Failed to update hasSpun after spin:', e);
                  }
                }
                setMustSpin(false);
                setIsUpdating(false);
              }}
              spinDuration={0.4}
              disableInitialAnimation={true}
              startingOptionIndex={startingOptionIndex} />
          ) :
            <Dialog open={true}>
              <div className="flex flex-col items-center justify-center p-6" style={{ backgroundColor: '#000000ff', minWidth: 400 }}>
                <Typography variant="h6" fontWeight="bold" color="white" align="center">
                  You are Secret Santa for:
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="white" align="center" sx={{ mt: 1 }}>
                  {secretSantaName ? secretSantaName : 'Something went wrong, contact the admin.'}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" color='white'>
                  Budget: ~200kr
                </Typography>
              </div>
              <CountdownTimer />
            </Dialog>
        }
        <Button variant="contained" onClick={handleSpinClick} disabled={mustSpin || isUpdating}
          sx={{ fontWeight: 'bold', backgroundColor: 'white', color: 'red', '&:hover': { backgroundColor: '#d12020ff' } }}>
          SPIN THE WHEEL
        </Button>
      </div>
    </div>
  );
}
async function updateHasSpunStatus(hasSpun: boolean, secretSantaName: string) {
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
