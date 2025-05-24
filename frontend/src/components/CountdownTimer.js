import React, { useEffect, useState } from 'react';

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    });

  useEffect(() => {
    const countdown = () => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        setTimeLeft({ finished: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    countdown(); // jalankan saat mount
    const interval = setInterval(countdown, 1000);
    return () => clearInterval(interval); // clear saat unmount
  }, [targetDate]);

  if (timeLeft.finished) {
    return <h3 style={{ color: 'white' }}>Perhitungan suara dimulai</h3>;
  }

  return (
    <div style={{ color: 'white', textAlign: 'center', marginBottom: '2rem', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', letterSpacing: '0.5rem' }}>
            {timeLeft.days.toString().padStart(2, '0')} &nbsp;: &nbsp;
            {timeLeft.hours.toString().padStart(2, '0')} &nbsp;: &nbsp;
            {timeLeft.minutes.toString().padStart(2, '0')} &nbsp;: &nbsp;
            {timeLeft.seconds.toString().padStart(2, '0')}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem', gap: '7rem', fontSize: '0.75rem', fontWeight: '700' }}>
            <span>Hari</span>
            <span>Jam</span>
            <span>Menit</span>
            <span>Detik</span>
        </div>
        <br></br>
        <h3>Menuju Perhitungan Suara</h3>
    </div>
  );
};

export default CountdownTimer;