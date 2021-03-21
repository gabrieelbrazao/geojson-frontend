import {
  TileLayer,
  Marker,
  Popup,
  Polygon,
  FeatureGroup,
  Map
} from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import * as L from 'leaflet'

interface Iprops {
  center: number[]
  features: any[]
  handleCreate: ({ layer, layerType }: { layer: any; layerType: any }) => void
}

const MapComponent: React.FC<Iprops> = ({ center, handleCreate, features }) => {
  return (
    <>
      <Map
        center={center}
        zoom={12}
        minZoom={4}
        scrollWheelZoom={true}
        style={{ height: '100vh' }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FeatureGroup>
          <EditControl position="topleft" onCreated={e => handleCreate(e)} />

          {features?.map((feature, index) => {
            if (feature.geometry.type === 'Polygon') {
              return (
                <Polygon
                  key={index}
                  positions={feature.geometry.coordinates}
                  color={feature.properties.color}
                >
                  {feature.properties.name && (
                    <Popup>{feature.properties.name}</Popup>
                  )}
                </Polygon>
              )
            }

            if (feature.geometry.type === 'Point') {
              const icon = L.icon({
                iconUrl: `https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${feature.properties.color.substring(
                  1
                )}`,
                shadowUrl:
                  'http://chart.apis.google.com/chart?chst=d_map_pin_shadow',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })

              return (
                <Marker
                  key={index}
                  position={feature.geometry.coordinates}
                  icon={icon}
                >
                  {feature.properties.name && (
                    <Popup>{feature.properties.name}</Popup>
                  )}
                </Marker>
              )
            }
          })}
        </FeatureGroup>
      </Map>
    </>
  )
}

export default MapComponent
