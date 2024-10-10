import { useState, useEffect } from 'react'
import './App.css'
import LocationPicker from './components/LocationPicker/LocationPicker'
import Form from "./components/Form/Form"
import List from "./components/List/List"
import WeatherDisplay from "./components/WeatherDisplay/WeatherDisplay"
import useLocalStorageState from 'use-local-storage-state'

function App() {

  const [activities, setActivities] = useLocalStorageState("activities", {defaultValue: []})

  function handleAddActivity (newActivity){
    setActivities([...activities, newActivity])
  };

  function handleDeleteActivity(removeActivityId) {
    // if (!activities) return;
    const updatedActivities = activities.filter((activity) => activity.id !== removeActivityId);
    console.log("removeActivityId", removeActivityId)
    console.log("updatedActivities", updatedActivities)
    setActivities(updatedActivities);
  }
  // FETCH - WEATHER

  const [weather, setWeather] = useState([]);
  
  const [location, setLocation] = useState("")

  function handleLocation(newLocation){
    setLocation(newLocation)
    console.log("New location:", newLocation)
  }

    useEffect(() => {
      const weatherUpdate =
        setInterval(() => {
          async function startFetching(){
            try{
            const response = await fetch(
              `https://example-apis.vercel.app/api/weather/${location}`
            );
            if (response.ok){
            const weather = await response.json();
            setWeather(weather);
          }
        }
        
        catch(error){
          console.error("Bad response. Unable to fetch data.", error)
        }
      }
         startFetching();
        }, 8000);

        return () => clearInterval(weatherUpdate);
      }, [location]
  );  

  console.log("Activities:", activities)
  console.log("Current weather:", weather)

  const isGoodWeather = weather.isGoodWeather;
  const filteredActivities = activities.filter((activity) => activity.isForGoodWeather === isGoodWeather);

  return (
    <>
      <h1>Weather & Activities App</h1>
      <LocationPicker onChangeLocation={handleLocation}/>
      <WeatherDisplay condition={weather.condition} temperature={weather.temperature} location={weather.location}/>
      <List onDeleteActivity={handleDeleteActivity}
      activities={filteredActivities} isGoodWeather={isGoodWeather}/>
      <Form onAddActivity={handleAddActivity}/>
    </>
  )
}

export default App
