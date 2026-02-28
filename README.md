# Leaflet.SimpleLocate

A [Leaflet](https://leafletjs.com/) plugin displaying device location and orientation on the map, with orientation adjusted according to screen rotation.

* Demo Page: [Leaflet 1 demo](https://mfhsieh.github.io/leaflet-simple-locate/index.html) or [Leaflet 2 demo](https://mfhsieh.github.io/leaflet-simple-locate/index_v2.html)
* Current Version: v1.0.6 / v2.0.0-alpha.1 (2026-02-28)
* Tested on desktop and mobile versions of Chrome, Edge, Firefox, and Safari.

## Usage

### Leaflet 1.x (Classic)

Simply include the [JS](dist/leaflet-simple-locate.min.js) and [CSS](examples/demo.css) in the head.

```html
<head>
    ...
    <script src="dist/leaflet-simple-locate.min.js"></script>
    <link rel="stylesheet" href="examples/demo.css" />
    ...
</head>
```

And add the control to the map.

```js
new L.Control.SimpleLocate({
    position: "topleft",
    className: "button-locate",
    afterClick: (result) => {
        // Do something after the button is clicked.
    },
    afterMarkerAdd: () => {
        // Do something after marker is added.
    },
    afterDeviceMove: (event) => {
        // Do something after device moves.
    }
}).addTo(map);
```

### Leaflet 2.x (ESM)

For Leaflet 2.x, use the ESM-ready version [leaflet-simple-locate_v2.js](src/leaflet-simple-locate_v2.js).

```js
import L from 'leaflet';
import SimpleLocate from './src/leaflet-simple-locate_v2.js';

const control = new SimpleLocate({
    position: "topleft",
    className: "button-locate",
});
control.addTo(map);
```

The CSS variable `--leaflet-simple-locate-orientation` changes based on the device's orientation and can be used to customize other HTML elements.

For more details, refer to the [Leaflet 1 demo](index.html) or [Leaflet 2 demo](index_v2.html).

## Options

| Option | Type | Default | Description |
| ---- | ---- | ---- | ---- |
| className | String | "" | Extra CSS class for the control button. |
| title | String | "Locate Geolocation and Orientation" | Tooltip text for the button. |
| ariaLabel | String | "" | ARIA label for accessibility. If empty, uses `title`. |
| setViewAfterClick | Boolean | true | Re-center the map after clicking. |
| zoomLevel | Number | undefined | Zoom level when centering. |
| drawCircle | Boolean | true | Draw an accuracy circle. |
| minAngleChange | Number | 3 | Minimum angle change (degrees) to trigger update. |
| clickTimeoutDelay | Number | 500 | Delay (ms) to detect double-click. |
| afterClick | Function | null | Callback after click. Receives `{geolocation, orientation}`. |
| afterMarkerAdd | Function | null | Callback after adding marker. |
| afterDeviceMove | Function | null | Callback after movement. Receives `{lat, lng, accuracy, angle}`. |
| iconGeolocation | L.DivIcon | refer to [icon_geolocation.svg](images/icon_geolocation.svg) | Icon for geolocation. |
| iconOrientation | L.DivIcon | refer to [icon_orientation.svg](images/icon_orientation.svg) | Icon for orientation. |
| htmlInit | String | refer to [html_init.svg](images/html_init.svg) | HTML for initial state. |
| htmlSpinner | String | refer to [html_spinner.svg](images/html_spinner.svg) | HTML for loading state. |
| htmlGeolocation | String | refer to [html_geolocation.svg](images/html_geolocation.svg) | HTML for geolocation active. |
| htmlOrientation | String | refer to [html_orientation.svg](images/html_orientation.svg) | HTML for orientation active. |

## Methods

| Method | Returns | Description |
| ---- | ---- | ---- |
| getLatLng() | LatLngLiteral | Returns current latitude and longitude. |
| getAccuracy() | Number | Returns current accuracy (meters). |
| getAngle() | Number | Returns current orientation angle (degrees). |
| setZoomLevel(level) | void | Sets the zoom level for the map view. |

## Where

* Source Code: [Github](https://github.com/mfhsieh/leaflet-simple-locate)

## Author

* email: mfhsieh at gmail.com
* Github: [Github](https://github.com/mfhsieh/)
