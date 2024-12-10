'use client';

import { useEffect, useState } from 'react';

export default function TelegramMiniApp() {
  const [startParam, setStartParam] = useState<string | null>(null);
  const [initData, setInitData] = useState<string | null>(null);
  const [initDataUnsafe, setInitDataUnsafe] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js?2';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      try {
        const Telegram = window.Telegram?.WebApp;

        if (!Telegram) {
          setError('Telegram Web App SDK failed to load.');
          return;
        }

        // Set initData
        setInitData(Telegram.initData);

        // Set initDataUnsafe
        setInitDataUnsafe(Telegram.initDataUnsafe);

        // Extract start_param
        const param = Telegram.initDataUnsafe?.start_param;
        setStartParam(param || 'No start_param provided');
      } catch (err) {
        console.error('Error loading Telegram SDK:', err);
        setError('Error loading Telegram SDK. Check console for details.');
      }
    };

    script.onerror = () => {
      setError('Failed to load Telegram Web App SDK.');
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Telegram Mini App</h1>
      <p>
        <strong>Start Param:</strong> {startParam || 'Loading...'}
      </p>
      <p>
        <strong>Init Data:</strong> {initData || 'Loading...'}
      </p>
      <p>
        <strong>Init Data Unsafe:</strong>{' '}
        {initDataUnsafe ? JSON.stringify(initDataUnsafe, null, 2) : 'Loading...'}
      </p>
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
