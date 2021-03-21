import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .leaflet-draw-draw-polyline, .leaflet-draw-draw-rectangle, .leaflet-draw-draw-circle, .leaflet-draw-draw-circlemarker {
    display: none!important;
  }

  .leaflet-draw-section:nth-child(2) {
    display: none;
  }

  .sr-only {
    display: none;
  }
`
