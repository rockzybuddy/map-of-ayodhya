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

const startPoint = {
  "type": "FeatureCollection",
  "features": [{
    "type": "feature",
    "geometry": {
      "type": "Points",
      "coordinates": [start]
    }
  }
  ]
}

const endPoint = {
  "type": "FeatureCollection",
  "features": [{
    "type": "feature",
    "geometry": {
      "type": "Point",
      "coordinates": [end]
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
    "line-color": "blue",
    "line-width": 4,
    "line-opacity": 0.75
  }
};

const layerEndpoint = {
  id: 'end',
  type: 'circle',
  source: {
    type: 'geojson',
    data: end
  },
  paint: {
    'circle-radius': 10,
    'circle-color': '#f30'
  }
}

import Bike from '@mui/icons-material/DirectionsBike';
import Drive from '@mui/icons-material/DriveEta';
import Walk from '@mui/icons-material/DirectionsRun';


const json_data = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`);
