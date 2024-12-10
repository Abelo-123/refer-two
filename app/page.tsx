'use client';



import { useEffect, useState } from 'react';

export default function TelegramMiniApp() {
  const [startParam, setStartParam] = useState<string | null>(null);
  const [error] = useState(null);


  useEffect(() => {
    // Load the Telegram Web App JavaScript SDK
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js?2";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const Telegram = window.Telegram.WebApp;

      if (window.Telegram && window.Telegram.WebApp) {
        const initDataUnsafe = Telegram.initDataUnsafe;

        // Extract start_param
        const param = initDataUnsafe?.start_param;

        // Update the state
        setStartParam(param || 'No start_param provided');
      }

    };



    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Telegram Mini App</h1>
      <p>Start Param: {startParam || 'Loading...'}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button
        onClick={() => window?.Telegram?.WebApp?.close()}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#0088cc',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Close App
      </button>
    </div>
  );
}
