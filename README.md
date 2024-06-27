Leaflet.SimpleLocate
=

A [Leaflet](https://leafletjs.com/) plugin displaying device location and orientation on the map, with orientation adjusted according to screen rotation.

* Demo Page: [demo](https://mfhsieh.github.io/leaflet-simple-locate/) (activate: click the button, deactivate: double-click)
* Current Version: v1.0.4
* Tested on desktop and mobile versions of Chrome, Edge, Firefox, and Safari.


# Usage

Simply include the [JS](dist/leaflet-simple-locate.min.js) and [CSS](examples/demo.css) in the head.

```html
<head>
    ...
    <script src="dist/leaflet-simple-locate.min.js"></script>
    <link rel="stylesheet" href="demo.css" />
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
        // Do something after the marker (displaying the device's location and orientation) is added.
    },
    afterDeviceMove: (event) => {
        // Do something after the device moves.
    }
}).addTo(map);
```

The CSS variable `--leaflet-simple-locate-orientation` changes based on the device's orientation and can be used to customize other HTML elements.

For more details, refer to this [demo](https://mfhsieh.github.io/leaflet-simple-locate/) (code: [index.html](index.html), [demo.css](examples/demo.css)).


# Options

| Option            | Type      | Default                                                                                                        | Description                                                                                        |
| ----------------- | --------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| className         | String    | ""                                                                                                             | the custom CSS class name assigned to the control                                                  |
| afterClick        | Function  | null                                                                                                           | the callback function after the button is clicked                                                  |
| afterMarkerAdd    | Function  | null                                                                                                           | the callback function after the marker (displaying the device's location and orientation) is added |
| afterDeviceMove   | Function  | null                                                                                                           | the callback function after the device moved                                                       |
| setViewAfterClick | Boolean   | true                                                                                                           | After the button is clicked, move the map to the device's location.                                |
| zoomLevel         | Boolean   | undefined                                                                                                      | After the button is clicked, zoom the map to this level.                                           |
| drawCircle        | Boolean   | true                                                                                                           | Draw a circle to indicate location accuracy.                                                       |
| minAngleChange    | Number    | 3                                                                                                              | It will only take effect when the angle change (in degrees) exceeds this value.                    |
| clickTimeoutDelay | Number    | 500                                                                                                            | time interval (in milliseconds) for detecting a double-click on the button                         |
| title             | String    | "Locate Geolocation and Orientation"                                                                           | the "title" attribute of the button                                                                |
| ariaLabel         | String    | ""                                                                                                             | the "aria-label" attribute of the button. If it is an empty string, it will be equal to "title".   |
| htmlInit          | String    | refer to [html_init.svg](images/html_init.svg)               | the HTML content of the button before it is clicked.                                               |
| htmlSpinner       | String    | refer to [html_spinner.svg](images/html_spinner.svg)         | the HTML content of the button during the user authorization                                       |
| htmlGeolocation   | String    | refer to [html_geolocation.svg](images/html_geolocation.svg) | the HTML content of the button for geolocation authorization only                                  |
| htmlOrientation   | String    | refer to [html_orientation.svg](images/html_orientation.svg) | the HTML content of the button for geolocation and orientation authorization                       |
| iconGeolocation   | L.divIcon | refer to [icon_geolocation.svg](images/icon_geolocation.svg) | the icon representing device's location                                                            |
| iconOrientation   | L.divIcon | refer to [icon_orientation.svg](images/icon_orientation.svg) | the icon representing device's location and orientation                                            |

# Where

* Source Code: [Github](https://github.com/mfhsieh/leaflet-simple-locate)


# Author

* email: mfhsieh at gmail.com
* Github: [Github](https://github.com/mfhsieh/)
