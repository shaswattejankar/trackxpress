/*global google*/
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useMemo, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { MdAddCircle } from "react-icons/md";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { AiFillCloseCircle } from "react-icons/ai";

// Entry Function
const MapTrack = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GMA,
  });

  if (!isLoaded) return <div> Loading . . . </div>;
  return (
    <>
      <Map />
    </>
  );
};

const Map = () => {
  
  const options = useMemo(
    () => ({ disableDefaultUI: true, clickableIcons: false }),
    []
  );

  //State Varaibles
  const [center, setCenter] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [trace, setTrace] = useState(false);
  const [terminate, setTerminate] = useState(null);

  // Objecct etting the live coords;
  const geoLocationPositionCoords = getGeoLocationPositionCoords();

  // A user defined function to return the position coordinates using Promise
  // To get the position.coords value out of the .getCurrentPosition(success,failure)
  function getGeoLocationPositionCoords() {
    return new Promise((res, rej) => {
      navigator.geolocation.getCurrentPosition(success, failure);

      function success(pos) {
        res(pos.coords);
      }
      function failure() {
        rej("error");
      }
    });
  }

  //To get live location of the user, to locate them
  useMemo(() => {
    geoLocationPositionCoords.then((coords) => {
      //Center of GoogleMap component
      setCenter({ ...center, lat: coords.latitude, lng: coords.longitude });
      setCoordinates([
        ...coordinates,
        ["start", "phone", coords.latitude, coords.longitude],
      ]);
    });
  }, []);

  //To pust markers on the location of all the customers
  function AddMarkers() {
    const markers = coordinates.map(([Name, phone, lat, lng]) => {
      return (
        <MarkerF
          position={{ lat: Number(lat), lng: Number(lng) }}
          title={Name}
          key={crypto.randomUUID()}
          onClick={(e) => {
            const markerName = Name;
            setCoordinates(
              coordinates.filter(
                ([Name, phone, lat, lng]) => Name !== markerName
              )
            );
          }}
        />
      );
    });

    return markers;
  }

  //Function to add customer details and drop a marker on their Location
  const CustomerForm = () => {
    const [Name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");

    function addPlace(e) {
      setCoordinates([...coordinates, [Name, phone, lat, lng]]);
      setLat("");
      setLng("");
    }

    return (
      <>
        <div className="side-div">
          <div className="add-customer-form">
            <input
              type="text"
              value={Name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Enter Customer Name..."
            />
            <input
              type="text"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              placeholder="Enter Customer Phone Number..."
            />
            <input
              type="text"
              value={lat}
              onChange={(e) => {
                setLat(e.target.value);
              }}
              placeholder="Enter Latitude Here..."
            />
            <input
              type="text"
              value={lng}
              onChange={(e) => {
                setLng(e.target.value);
              }}
              placeholder="Enter Longitude Here..."
            />

            <div className="form-buttons">
              <button type="buton" onClick={addPlace}>
                Submit
              </button>
              <button
                className="close-btn"
                onClick={() => {
                  setShowForm(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  //To show the path taken by the driver every 10000ms
  const showRoute = async () => {
    if (coordinates.length < 1) return;

    let p = 0;
    let routeArray = [];
    const directionsService = new google.maps.DirectionsService();

    await geoLocationPositionCoords.then((coords) => {
      routeArray = [[coords.latitude, coords.longitude, p]];
    });
    const origin = new google.maps.LatLng(routeArray[0][0], routeArray[0][1]);

    setTerminate(
      setInterval(async () => {
        await geoLocationPositionCoords.then(async (coords) => {
          let wypts = [];
          p += 1;
          routeArray = [...routeArray, [coords.latitude, coords.longitude, p]];
          const destination = new google.maps.LatLng(
            routeArray[p][0],
            routeArray[p][1]
          );

          if (p > 1) {
            wypts = [...routeArray.slice(1, p)];
          }

          //get route object
          const results = await directionsService.route(
            {
              origin: origin,
              destination: destination,
              travelMode: google.maps.TravelMode.DRIVING,
              waypoints: wypts.map(([lt, lng, idx]) => {
                const wypt = new google.maps.LatLng(Number(lt), Number(lng));
                return { location: wypt, stopover: false };
              }),
            },
            (result, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                setTrace(true);
              } else {
                console.error(`error fetching directions ${result}`);
              }
            }
          );

          setDirectionsResponse(results);

          //Max Waypoints allowed
          if (p === 24) {
            clearInterval(terminate);
            console.log(
              "Max Live Location Capture Limit Reached. Clearing... Cleared Interval."
            );
          }
        });
      }, 10000)
    );
  };

  //To stop tracking drivers movement
  const closeRoute = () => {
    clearInterval(terminate);
    console.log('tracking stopped!');
  };

  return (
    <>
      <div className="map-canvas">
        <GoogleMap
          zoom={14}
          center={center}
          mapContainerClassName="map-container"
          options={options}
        >
          {/* Truck drivers location */}
          {center && <MarkerF position={center} title="Truck Driver"/>}

          <AddMarkers />

           {/* To map the drivers path */}
          {trace && (
            <DirectionsRenderer
              directions={directionsResponse}
              options={{ suppressMarkers: true }}
            />
          )}

          {/* Utility Buttons */}
          <div className="buttons">
            <button
              className="button"
              z-index="100"
              onClick={() => setShowForm(true)}
            >
              <MdAddCircle style={{ fill: "green", fontSize: "50px" }} />
            </button>
            <button
              className="button"
              z-index="100"
              onClick={() => showRoute()}
            >
              <BsFillPlayCircleFill
                style={{ fill: "green", fontSize: "44px" }}
              />
            </button>
            <button
              className="button"
              z-index="100"
              onClick={() => {
                closeRoute();
              }}
            >
              <AiFillCloseCircle style={{ fill: "red", fontSize: "44px" }} />
            </button>
          </div>

          {showForm ? <CustomerForm /> : ""}
        </GoogleMap>
      </div>
    </>
  );
};

export default MapTrack;
