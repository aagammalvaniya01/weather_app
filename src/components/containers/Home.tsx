'use client';

import React, { useState, useEffect } from 'react';
import { Icons } from '../icons';

interface API {
	key: string;
	base: string;
}

const api: API = {
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
					position.coords.longitude,
				);
			}, handleLocationError);
		}
	}, []);

	const fetchWeatherByCoords = async (
		lat: number,
		lon: number,
	): Promise<void> => {
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

	const handleLocationError = () => {
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

	const WeatherIcon = ({ type }: { type: string }): React.ReactNode | null => {
		switch (type) {
			case 'Clouds':
				return <Icons.CloudsIcon />;
			case 'Clear':
				return <Icons.ClearIcon />;
			case 'Smoke':
				return <Icons.SmockIcon />;
			default:
				return null;
		}
	};

	return (
		<section className='details-bg max-w-xl mx-auto py-5 px-5 md:px-20 text-center flex flex-col gap-5 h-full'>
			<div className='text-4xl text-[#726f76] font-bold'>Weather in</div>

			<div className='flex py-2'>
				<div className='relative w-full'>
					<input
						type='text'
						placeholder='Search...'
						className='p-4 text-base rounded-full text-black w-full focus:outline-none focus:ring focus:ring-opacity-50'
						onChange={(e) => setQuery(e.target.value)}
						value={query}
						onKeyDown={handleSearch}
					/>
					<button
						className='absolute top-4 right-3 cursor-pointer'
						onClick={() => handleSearch({ key: 'Enter' })}
					>
						<svg
							className='w-6 h-6'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
							/>
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
							{Math.round(weather?.main?.temp)}°C
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
							<p className='text-4xl md:text-5xl leading-none'>
								{Math.round(weather?.main?.temp)}°C
							</p>
							<p className='text-xs'>Feels Like</p>
						</div>
						<div>
							<p className='text-4xl md:text-5xl leading-none'>
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
