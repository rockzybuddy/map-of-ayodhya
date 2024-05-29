import logo from './logo.svg';
import './App.css';
import NATIONAL_PARK_DATA from './data.json';
import { Map } from 'react-map-gl';
import DeckGL, { GeoJsonLayer } from 'deck.gl';
import React, { useState, useEffect, useRef } from 'react';
import ReactMapGl, { FullscreenControl, GeolocateControl, Marker, Source, Layer, NavigationControl } from 'react-map-gl';
import Instructions from './components/Instructions';

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiYXJzLTQ1IiwiYSI6ImNsd2pzbndxNDA2aDYycXA4dnVnMmppb2cifQ.4g6t9R6t-MkAqbiAkYtYbQ";
const MAP_STYLE = "mapbox://styles/ars-45/clwapbsyi008301pge9vfg6n1/draft";

const INITIAL_VIEW_STATE = {
  latitude: 26.7922,
  longitude: 82.1998,
  zoom: 16,
  bearing: 0,
  pitch: 70
}

function App() {

  //const handleClick = (e) => {
  //const newEnd = e.lngLat
  //const endPoint = Object.keys(newEnd).map((item, i) => newEnd[item])
  //setEnd(endPoint)
  //}

  const onClick = info => {
    if (info.object) {
      alert(info.object.properties.Name);
      alert(info.object.properties.Description);
    }
  }
  //const onClick = { handleClick }

  const [end, setEnd] = useState([82.19567380332623, 26.795128674369636]);
  const [start, setStart] = useState([82.20084166864672, 26.788580319982984]);
  const [coords, setCoords] = useState([]);
  const [steps, setSteps] = useState([]);

  const GeolocateControlRef = useRef();

  useEffect(() => {
    getRoute()
    GeolocateControl.current?.trigger()
  }, [end, GeolocateControlRef])

  const getRoute = async () => {
    const respose = await fetch(`{https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`);
    const data = await respose.json();
    const coords = data.routes[0].geometry.coordinates
    setCoords(coords)
    const steps = data.routes[0].legs[0].steps
    setSteps(steps);
    console.log(steps)

  }

  const geojson = {
    "type": "FeatureCollection",
    "features": [{
      "type": "feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          ...coords
        ]
      }
    }
    ]
  }

  const lineStyle = {
    id: 'roadLayer',
    type: 'line',
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": "yellow",
      "line-width": 7,
      "line-opacity": 0.75
    }
  };

  const endPoint = {
    "type": "FeatureCollection",
    "features": [{
      "type": "feature",
      "geometry": {
        "type": "Point",
        "coordinates": [...end]
      }
    }
    ]
  }

  const startPoint = {
    "type": "FeatureCollection",
    "features": [{
      "type": "feature",
      "geometry": {
        "type": "Point",
        "coordinates": [...start]
      }
    }
    ]
  }

  const layerEndpoint = {
    id: 'end',
    type: 'circle',
    source: {
      type: 'geojson',
      data: end
    },
    paint: {
      'circle-radius': 7,
      'circle-color': '#E7B9E3'
    }
  }

  const layerStartpoint = {
    id: 'start',
    type: 'circle',
    source: {
      type: 'geojson',
      data: start
    },
    paint: {
      'circle-radius': 7,
      'circle-color': '#E7B9E3'
    }
  }

  const dataLayers = [
    new GeoJsonLayer({
      id: 'nationalParks',
      data: NATIONAL_PARK_DATA,

      filled: true,
      pointRadiusMinPixels: 5,
      pointRadiusScale: 2,
      getPointRadius: f => 5,
      getFillColor: [86, 144, 58, 250],
      pickable: true,
      autoHighlight: true,
      onClick
    })
  ];

  return (
    <section className='relative'>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={dataLayers}
      >
        <Map mapStyle={MAP_STYLE} mapboxAccessToken={MAPBOX_ACCESS_TOKEN}>
          <Source id='routeSource' type='geojson' data={geojson}>
            <Layer {...lineStyle} />
          </Source>
          <Source id='endSource' type='geojson' data={endPoint}>
            <Layer {...layerEndpoint} />
          </Source>
          <Source id='startSource' type='geojson' data={startPoint}>
            <Layer {...layerStartpoint} />
          </Source>

          <GeolocateControl showAccuracyCircle={false} onGeolocate={(e) => setStart([e.coords.longitude, e.coords.latitude])} ref={GeolocateControlRef} />
          <NavigationControl />

        </Map>

      </DeckGL>

      <article className="bg-slate-800 rounded-md px-5 py-3 max-h-[50vh] absolute top-5 left-5">
        {steps.map((item, i) => {
          <div className="flex flex-col gap-2">
            <Instructions no_={i + 1} step={item.maneuver.instruction} />
          </div>
        })}
      </article>
    </section>
  );
}

export default App;