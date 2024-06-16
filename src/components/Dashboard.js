import React, { Component } from "react";
import axios from "axios";
import "./Dashboard.css";
import { DNA } from "react-loader-spinner";

import {
    FaWind,
    FaSun,
    FaTint,
    FaEye,
    FaThermometerHalf,
    FaCompress,
} from "react-icons/fa";

//This is the main page of app so ia ma using here Class component

class Dashboard extends Component {
    state = {
        input: "",
        loading: false,
        error: null,
        weatherData: this.props.weatherData,
        newWeatherData: null,
    };

    // when page is load it will hit a api call
    componentDidMount() {
        this.fetchWeatherData();
    }


    //Fetch Weather Data
    fetchWeatherData = async () => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast`,
                {
                    params: {
                        q: this.state.input.length === 0 ? "anjur" : this.state.input,
                        appid: "c375569e5e62ff7d08cefb7a11a959e1",
                    },
                }
            );
            this.setState({ newWeatherData: response.data });
        } catch (err) {
            this.setState({ error: err.message });
        }
    };

    handleChange = (e) => {
        this.setState({ input: e.target.value });
    };

    capitalizeWords = (str) => {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }
    //Search button trigered
    handleSearch = async (e) => {
        e.preventDefault();
        this.setState({ loading: true, error: null });
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${this.state.input}&appid=c375569e5e62ff7d08cefb7a11a959e1`
            );
            this.fetchWeatherData()
            this.setState({ weatherData: response.data });

        } catch (err) {
            this.setState({ error: err.message });
        } finally {
            this.setState({ loading: false });
        }
    };

    kelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed(1);

    formatTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    convertUnixTimestampToDateTime = (timestamp, type) => {
        const date = new Date(timestamp * 1000);
        const hours = date.getHours();
        const ampm = hours >= 12 ? "PM" : "AM";
        const hours12 = hours % 12 || 12;
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return type === "date"
            ? `${day}/${month}/${year}`
            : `${hours12}:${minutes}:${seconds} ${ampm}`;
    };

    getWindDirection = (data, name) => {
        const windDeg = data.wind.deg;
        const directions = [
            { name: "North", arrow: "↑" },
            { name: "North-East", arrow: "↗" },
            { name: "East", arrow: "→" },
            { name: "South-East", arrow: "↘" },
            { name: "South", arrow: "↓" },
            { name: "South-West", arrow: "↙" },
            { name: "West", arrow: "←" },
            { name: "North-West", arrow: "↖" },
        ];
        const directionIndex = Math.round(windDeg / 45) % 8;
        const windDirection = directions[directionIndex];
        return name === "name" ? `${windDirection.name}` : `${windDirection.arrow}`;
    };

    //Side bar Screen Component
    SideBar = () => (
        <div className="sidebar">
            <form onSubmit={this.handleSearch}>
                <input
                    type="text"
                    value={this.state.input}
                    onChange={this.handleChange}
                    placeholder="Enter city or pincode"
                />
                <button type="submit">Search</button>
            </form>
            {this.state.loading && (
                <div className="dna-loading">
                    <DNA height="70" width="70" />
                </div>
            )}
            {this.state.error && <p>Something went wrong. Please try again.</p>}
            {!this.state.loading && !this.state.error && this.state.weatherData && (
                <div className="weather-today">
                    <h1>{this.kelvinToCelsius(this.state.weatherData.main.temp)}°C</h1>
                    <div className="cloud-container">
                        <img
                            src={`http://openweathermap.org/img/wn/${this.state.weatherData.weather[0].icon}@2x.png`}
                            alt={this.state.weatherData.weather[0].description}
                        />
                    </div>
                    <h3>{this.capitalizeWords(this.state.weatherData.weather[0].description)}</h3>
                    <h4>
                        {this.state.weatherData.name}, {this.state.weatherData.sys.country}
                    </h4>
                    <h4>
                        {this.convertUnixTimestampToDateTime(
                            this.state.weatherData.dt,
                            "date"
                        )}
                    </h4>
                    <h4>
                        {this.convertUnixTimestampToDateTime(
                            this.state.weatherData.dt,
                            "time"
                        )}
                    </h4>
                    <h4>
                        Min Temperature:{" "}
                        {this.kelvinToCelsius(this.state.weatherData.main.temp_min)}°C
                    </h4>
                    <h4>
                        Max Temperature:{" "}
                        {this.kelvinToCelsius(this.state.weatherData.main.temp_max)}°C
                    </h4>
                    <h4>Cloudiness: {this.state.weatherData.clouds.all}%</h4>
                </div>
            )}
        </div>
    );

    //Main Screen Component
    Main = () => (
        <div className="main-content">
            {this.state.loading && (
                <div className="dna-loading">
                    <DNA height="70" width="70" />
                </div>
            )}
            {this.state.error && (
                <p className="dna-loading">Something went wrong. Please try again.</p>
            )}
            {!this.state.loading && !this.state.error && this.state.weatherData && (
                <div className="highlights">
                    <div className="highlight">
                        <div className="icon-container">
                            <FaWind className="card-icon" />
                        </div>
                        <div className="item-details">
                            <h3>Wind Status</h3>
                            <p>{(this.state.weatherData.wind.speed * 3.6).toFixed(1)} km/h</p>
                            <p>
                                {this.getWindDirection(this.state.weatherData, "name")}{" "}
                                <span className="direction">
                                    {this.getWindDirection(this.state.weatherData, "arrow")}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="highlight">
                        <div className="icon-container">
                            <FaSun className="card-icon" />
                        </div>
                        <div className="item-details">
                            <h3>Sunrise & Sunset</h3>
                            <p>
                                {this.formatTime(this.state.weatherData.sys.sunrise)} -{" "}
                                {this.formatTime(this.state.weatherData.sys.sunset)}
                            </p>
                        </div>
                    </div>
                    <div className="highlight">
                        <div className="icon-container">
                            <FaTint className="card-icon" />
                        </div>
                        <div className="item-details">
                            <h3>Humidity</h3>
                            <p>{this.state.weatherData.main.humidity}%</p>
                        </div>
                    </div>
                    <div className="highlight">
                        <div className="icon-container">
                            <FaEye className="card-icon" />
                        </div>
                        <div className="item-details">
                            <h3>Visibility</h3>
                            <p>{this.state.weatherData.visibility / 1000} km</p>
                        </div>
                    </div>
                    <div className="highlight">
                        <div className="icon-container">
                            <FaCompress className="card-icon" />
                        </div>
                        <div className="item-details">
                            <h3>Sea Level Pressure</h3>
                            <p>{this.state.weatherData.main.sea_level} hPa</p>
                        </div>
                    </div>
                    <div className="highlight">
                        <div className="icon-container">
                            <FaThermometerHalf className="card-icon" />
                        </div>
                        <div className="item-details">
                            <h3>Feels Like</h3>
                            <p>
                                {this.kelvinToCelsius(this.state.weatherData.main.feels_like)}°C
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <this.NewWeatherForecast />
        </div>
    );

    //Forecast component
    NewWeatherForecast = () => (
        this.state.loading ? null : (
            this.state.error ? "" :
                (<div className="main-weather-forecast">
                    <h1>Weather Forecast</h1>
                    <div className="weather-forecast-container">
                        {this.state.newWeatherData &&
                            this.state.newWeatherData.list
                                .filter((_, index) => index % 8 === 0)
                                .slice(1, 5)
                                .map((forecast, index) => (
                                    <div key={index} className="forecast-card">
                                        <h4>
                                            {this.convertUnixTimestampToDateTime(forecast.dt, "date")}
                                        </h4>
                                        <div className="forecast-details">
                                            <img
                                                src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                                                alt={forecast.weather[0].description}
                                            />
                                            <p>
                                                {this.kelvinToCelsius(forecast.main.temp)} °C
                                            </p>
                                            <p>{this.capitalizeWords(forecast.weather[0].description)}</p>
                                            <p>Wind : {(forecast.wind.speed * 3.6).toFixed(1)} km/h</p>
                                            <p>Humidity :  {forecast.main.humidity}%</p>
                                        </div>
                                    </div>
                                ))}
                    </div>
                </div>))
    );


    //Here only render UI
    render() {
        return (
            <div className="dashboard">
                <this.SideBar />
                <this.Main />
            </div>
        );
    }
}

export default Dashboard;
