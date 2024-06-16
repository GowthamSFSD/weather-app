import React, { useContext, useEffect, useState } from 'react';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import './App.css';
import Dashboard from './components/Dashboard';
import axios from 'axios';
import { TiWeatherStormy } from 'react-icons/ti';
import { DNA } from 'react-loader-spinner';

const App = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

//here only pre load the default  data
  useEffect(() => {
    const fetchInitialWeatherData = async () => {
      try {
        const response = await axios.get(
          'https://api.openweathermap.org/data/2.5/weather?q=Anjur&appid=c375569e5e62ff7d08cefb7a11a959e1'
        );
        setWeatherData(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error('Error fetching weather data:', err);
      }
    };

    fetchInitialWeatherData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="title-container">
          <TiWeatherStormy className="weather-icon" />
          <h1>
            Weather <span>App</span>
          </h1>
        </div>
        <div className="toggle-container">
          <button className="theme-toggle-button" onClick={toggleTheme}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
        </div>
      </header>
      {loading ? (
        <div className="dna-loading">
          <DNA height="70" width="70" />
        </div>
      ) : (
        <Dashboard weatherData={weatherData} />
      )}
    </div>
  );
};


//wrap with Theme Provider
const AppWrapper = () => (
  <ThemeProvider>
    <App />
  </ThemeProvider>
);

export default AppWrapper;
