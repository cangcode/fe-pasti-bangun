"use client"
import { useState, useEffect, FormEvent } from 'react';

export default function AlarmPage() {
  const [kode, setKode] = useState('');
  const [inputKode, setInputKode] = useState('');
  const [status, setStatus] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Ganti dengan URL backend kamu
    fetch(process.env.NEXT_PUBLIC_API_URL+'/api/kode')
      .then(res => res.json())
      .then(data => {
        if (data.isActive) {
          setKode(data.kode)
          setIsActive(true)
        } else {
          setIsActive(false)
        }
      })
      .catch(() => setStatus('Gagal ambil kode mas'));
      
  }, []);

  async function handleSubmit(e:FormEvent) {
    e.preventDefault();
    setStatus('Memeriksa kode...');

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL+'/api/cek-kode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kode: inputKode }),
      });
      const data = await res.json();      

      if (data.valid) {
        setStatus('Kode benar, alarm dimatikan!');
      } else {
        setStatus('Kode salah, coba lagi.');
      }
    } catch {
      setStatus('Gagal menghubungi server');
    }
  }

  return (
    <main className="h-screen w-full flex justify-center items-center">
      <div className='p-6 max-w-md font-sans -mt-20'>
        <h1 className="text-3xl font-bold mb-6 text-center">Kontrol Alarm</h1>
        
        {isActive ? (
          <>
            <p className="mb-4 text-lg">
          <span className="font-semibold">Kode unik hari ini:</span>{' '}
          <span className={`${!isActive ? 'text-green-500' : 'text-blue-600'} font-mono`}>{kode || 'Loading...'}</span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Masukkan kode"
            value={inputKode}
            onChange={e => setInputKode(e.target.value.toUpperCase())}
            maxLength={6}
            required
            className="border border-gray-300 rounded-md px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
          <button
            type="submit"
            className={`${!isActive ? 'text-green-500' : 'bg-blue-600'} text-white rounded-md py-2 text-lg hover:bg-blue-700 transition`}
          >
            Kirim Kode
          </button>
        </form>

        {status && (
          <p className={`mt-4 text-center text-sm text-gray-700 ${!isActive ? 'text-green-500' : null}`}>
            {status}
          </p>
        )}
          </>
        ):(
          <div className='text-red-600 font-semibold text-center'>Alarm Tidak aktif!</div>
        )}

      </div>
    </main>
  );
}
