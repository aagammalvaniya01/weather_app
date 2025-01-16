'use client'
import React, { useState, useEffect } from 'react';
import { SmockIcon, CloudsIcon, ClearIcon } from '@/app/Icon';

const api = {
  key: '4f8e795dcd6dbf7b9f5276bff095ffc1',
  base: 'https://api.openweathermap.org/data/2.5/',
};

export default function Home() {

  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        fetchWeatherByCoords(
          position.coords.latitude,
          position.coords.longitude
        );
      }, handleLocationError);
    }
  }, []);

  const fetchWeatherByCoords = async (lat: any, lon:any) => {
    try {
      const url = `${api.base}weather?lat=${lat}&lon=${lon}&appid=${api.key}&units=metric`;
      const response = await fetch(url);
      const result = await response.json();
      setWeather(result);
      setError('');
    } catch (error) {
      setError('Weather data not found. Please try another search.');
      setWeather(null);
    }
  };

  const handleLocationError = (error: any) => {
    setError('Error obtaining location. Please try again.');
    setWeather(null);
  };

  const handleSearch = async (evt: any) => {
    if (evt.key === 'Enter' && query) {
      try {
        const url = `${api.base}weather?q=${query}&appid=${api.key}&units=metric`;
        const response = await fetch(url);
        const result = await response.json();
        if (result.cod !== 200) {
          throw new Error(result.message);
        }
        setWeather(result);
        setQuery('');
        setError('');
      } catch (error) {
        setError('Weather data not found. Please try another search.');
        setWeather(null);
      }
    }
  };

  const WeatherIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'Clouds':
        return <CloudsIcon />;
      case 'Clear':
        return <ClearIcon />;
      case 'Smoke':
        return <SmockIcon />;
      default:
        return null;
    }
  };

  return (
    <section className='details-bg py-5 px-20 m-auto w-[500px] h-full text-center flex flex-col gap-5'>
      <div className='text-5xl text-[#726f76] font-bold'>Weather in</div>
      <div className='flex py-2'>
        <div className='relative w-full'>
          <input
            type='text'
            placeholder='Search... '
            className='p-4 text-base rounded-full text-black w-full'
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <button
            className='absolute top-4 right-3 cursor-pointer'
            onClick={() => handleSearch({ key: 'Enter' })}
          >
            <svg
              className='icon-ui-search'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M5.068 10.427c0-2.953 2.394-5.356 5.338-5.356 2.943 0 5.338 2.403 5.338 5.356 0 2.952-2.395 5.355-5.338 5.355-2.944 0-5.338-2.403-5.338-5.355m14.697 8.201l-4.277-4.29a6.41 6.41 0 001.324-3.911c0-3.55-2.868-6.427-6.406-6.427S4 6.877 4 10.427c0 3.549 2.868 6.426 6.406 6.426a6.363 6.363 0 003.956-1.374l4.271 4.286a.799.799 0 001.132 0 .806.806 0 000-1.137'></path>
            </svg>
          </button>
        </div>
      </div>
      {error && <div className='text-red-500'>{error}</div>}
      {weather && (
        <div className='bg-white py-5 px-10 rounded-3xl flex flex-col text-[#726f76]'>
          <div className='mb-2.5'>
            {weather?.name}, {weather?.sys?.country}
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-5xl'>
              {Math.round(weather?.main?.temp)}°c
            </span>
            <div className='flex flex-col items-start'>
              <span className='text-lg font-bold text-[#797a75]'>
                {weather?.weather[0]?.main}
              </span>
              <span className='text-sm'>
                Max: {Math.round(weather?.main?.temp_max)}°C
              </span>
              <span className='text-sm'>
                Min: {Math.round(weather?.main?.temp_min)}°C
              </span>
            </div>
          </div>
          <div className='flex justify-center'>
            <WeatherIcon type={weather?.weather[0]?.main} />
          </div>
          <div className='flex justify-between'>
            <div>
              <p className='text-5xl leading-none'>
                {Math.round(weather?.main?.temp)}°c
              </p>
              <p className='text-xs'>Feels Like</p>
            </div>
            <div>
              <p className='text-5xl leading-none'>
                {weather?.main?.humidity}%
              </p>
              <p className='text-xs'>Humidity</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
