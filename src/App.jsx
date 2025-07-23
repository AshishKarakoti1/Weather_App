import React, { useState } from "react";
import { Transition } from "@headlessui/react";

const API_KEY = "34afcb0b703c4b17f99dd6f62e48d26e";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (data.cod !== 200) {
        setError(data.message);
      } else {
        setWeather(data);
      }
    } catch (err) {
      setError("Failed to fetch weather.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8 tracking-wide">Weather App</h1>

      {/* Input & Search */}
      <div className="flex gap-3 mb-8 w-full max-w-md">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={fetchWeather}
          className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-semibold transition"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-lg animate-pulse">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {/* Weather Card with Transition */}
      <Transition
        show={!!weather}
        enter="transition duration-500 ease-out"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 translate-y-0"
        leave="transition duration-300 ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-4"
      >
        {weather && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-2xl w-80 text-center space-y-4">
            <h2 className="text-2xl font-bold">{weather.name}, {weather.sys.country}</h2>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather icon"
              className="mx-auto"
            />
            <p className="text-4xl font-extrabold">{weather.main.temp}°C</p>
            <p className="capitalize text-lg">{weather.weather[0].description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 mt-4">
              <p>Feels Like: {weather.main.feels_like}°C</p>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind: {weather.wind.speed} m/s</p>
              <p>Pressure: {weather.main.pressure} hPa</p>
            </div>
          </div>
        )}
      </Transition>
    </div>
  );
}
