import { useEffect, useState } from "react";
import sunny from "../images/sunny.png";
import rainy from "../images/rainy.png";
import snowy from "../images/snowy.png";
import loadingIcon from "../images/loading.png";

// filepath: d:\weather app\weather-app\src\assets\components\WeatherApp.jsx

const WeatherApp = () => {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const api_key = "7499ddbaf792582e2cb2dec8e188c0f2";

  // Fetch default weather
  useEffect(() => {
    const fetchDefaultWeather = async () => {
      setIsLoading(true);
      const defaultLocation = "Tbilisi";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&units=Metric&appid=${api_key}`;
      const res = await fetch(url);
      const defaultData = await res.json();
      setData(defaultData);
      setIsLoading(false);
    };
    fetchDefaultWeather();
  }, []);

  const handleInputChange = (e) => {
    setLocation(e.target.value);
  };

  const search = async () => {
    if (location.trim() !== "") {
      setIsLoading(true);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=Metric&appid=${api_key}`;
      const res = await fetch(url);
      const searchData = await res.json();
      if (searchData.cod !== 200) {
        setData({ notFound: true });
      } else {
        setData(searchData);
        setLocation("");
      }
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  // Weather icons
  const weatherImages = {
    Clear: sunny,
    Clouds: sunny, // bạn nên thêm ảnh cloud riêng
    Rain: rainy,
    Snow: snowy,
    Haze: sunny,
    Mist: sunny,
  };

  const weatherImage = data?.weather
    ? weatherImages[data.weather[0].main]
    : loadingIcon;

  // Background gradient
  const backgroundImages = {
    Clear: "linear-gradient(to right,#f3b06c,#fcd283)",
    Clouds: "linear-gradient(to right,#57d6d4,#71eeec)",
    Rain: "linear-gradient(to right,#5bc8fb,#80eaff)",
    Snow: "linear-gradient(to right,#aff2ff,#fff)",
    Haze: "linear-gradient(to right,#57d6d4,#71eeec)",
    Mist: "linear-gradient(to right,#57d6d4,#71eeec)",
  };

  const backgroundImage =
    data?.weather && backgroundImages[data.weather[0].main]
      ? backgroundImages[data.weather[0].main]
      : "linear-gradient(to right,#f3b06c,#fcd283)";

  const currentDate = new Date();
  const daysofWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const dayOfWeek = daysofWeek[currentDate.getDay()];
  const month = months[currentDate.getMonth()];
  const dayOfMonth = currentDate.getDate();
  const formatedDate = `${dayOfWeek}, ${dayOfMonth} ${month}`;

  return (
    <div className="container" style={{ background: backgroundImage }}>
      <div
        className="weather-app"
        style={{
          background: backgroundImage.replace("to right", "to top"),
        }}
      >
        {/* Search */}
        <div className="search">
          <div className="search-top">
            <i className="fa-solid fa-location-dot"></i>
            <div className="location">{data?.name}</div>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Enter Location"
              value={location}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <i className="fa-solid fa-magnifying-glass" onClick={search}></i>
          </div>
        </div>

        {isLoading ? (
          <img className="loader" src={loadingIcon} alt="loading" />
        ) : data?.notFound ? (
          <div className="not-found">Not Found</div>
        ) : (
          <>
            <div className="weather">
              <img src={weatherImage} alt="weather" className="weather-icon" />
              <div className="weather-type">
                {data?.weather ? data.weather[0].main : null}
              </div>
              <div className="temp">
                {data?.main ? `${Math.floor(data.main.temp)}°C` : null}
              </div>
            </div>

            {/* Date */}
            <div className="weather-date">
              <p>{formatedDate}</p>
            </div>

            {/* Weather Details */}
            <div className="weather-data">
              <div className="humidity">
                <div className="data-name">Humidity</div>
                <i className="fa-solid fa-droplet"></i>
                <div className="data">
                  {data?.main ? data.main.humidity : null}%
                </div>
              </div>
              <div className="wind">
                <div className="data-name">Wind</div>
                <i className="fa-solid fa-wind"></i>
                <div className="data">
                  {data?.wind ? data.wind.speed : null} km/h
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
