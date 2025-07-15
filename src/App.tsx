import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [temp, setTemp] = useState(0);
  const [feelsLike, setFeelsLike] = useState(0);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lon: longitude });
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${import.meta.env.VITE_WEATHER_API}&units=imperial`,
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Weather fetch failed.");
            }
            return response.json();
          })
          .then((data) => {
            console.log(data);
            setTemp(data.main.temp);
            setFeelsLike(data.main.feels_like);
          });
      },
      (error) => {
        console.error("Error getting location:", error.message);
        // fallback to manual city input here
      },
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 to-blue-300 text-zinc-800 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold">MyWeather</h1>
          <p className="text-sm text-zinc-700">Current weather in your area</p>
        </header>

        <main className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6 space-y-4">
          {coords ? (
            <>
              <p className="text-center text-zinc-500">Current Temp: {temp}</p>
              <p className="text-center text-zinc-500">
                Feels Like: {feelsLike}
              </p>
            </>
          ) : (
            <p className="text-center text-zinc-500">Loading...</p>
          )}
        </main>

        <footer className="mt-6 text-xs text-center text-zinc-500">
          Powered by OpenWeatherMap
        </footer>
      </div>
    </div>
  );
}

export default App;
