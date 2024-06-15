Leaflet.Control.SimpleLocate
=

A Leaflet plugin displaying device location and orientation on the map, with orientation adjusted according to screen rotation. Tested on desktop and mobile versions of Chrome, Edge, Firefox, and Safari.

* Demo Page: [demo](https://mfhsieh.github.io/leaflet-simple-locate/) (Click the button on the demo page to activate, double-click to deactivate.)
* Current Version: v1.0.0


# Usage

Simply include the [JS](https://github.com/mfhsieh/leaflet-simple-locate/blob/main/src/leaflet-simple-locate.js) and [CSS](https://github.com/mfhsieh/leaflet-simple-locate/blob/main/examples/demo.css) in the head.

```
<head>
    ...
    <script src="leaflet-simple-locate.js"></script>
    <link rel="stylesheet" href="demo.css" />
    ...
</head>
```

And add the control to the map.

```
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

The CSS variable `--leaflet-simple-locate-orientation` changes based on the device's orientation, allowing customization of HTML elements.

For more examples, refer to this [demo](https://mfhsieh.github.io/leaflet-simple-locate/) (code: [index.html](https://github.com/mfhsieh/leaflet-simple-locate/blob/main/index.html), [demo.css](https://github.com/mfhsieh/leaflet-simple-locate/blob/main/examples/demo.css)).


# Options

| Option            | Type      | Default                                                                                                        | Description                                                                                           |
| ----------------- | --------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| className         | String    | ""                                                                                                             | A custom CSS class name to assign to the control.                                                     |
| afterClick        | Function  | null                                                                                                           | The callback function after the button is clicked.                                                    |
| afterMarkerAdd    | Function  | null                                                                                                           | The callback function after the marker (displaying the device's location and orientation) is added.   |
| afterDeviceMove   | Function  | null                                                                                                           | The callback function after the device moves.                                                         |
| setViewAfterClick | Boolean   | true                                                                                                           | After clicking the button, move the map to the device's location.                                     |
| zoomLevel         | Boolean   | undefined                                                                                                      | After clicking the button, zoom the map to this level.                                                |
| drawCircle        | Boolean   | true                                                                                                           | Draw a circle to indicate location accuracy.                                                          |
| minAngleChange    | Number    | 3                                                                                                              | The effect only occurs when the angle change (in degrees) exceeds this value.                         |
| clickTimeoutDelay | Number    | 500                                                                                                            | Time interval (in ms) for detecting a double-click on the button.                                        |
| title             | String    | "Locate Geolocation and Orientation"                                                                           | The title attribute of the button.                                                                    |
| ariaLabel         | String    | ""                                                                                                             | The aria-label attribute of the button. If its value is an empty string, it will be equal to "title". |
| htmlInit          | String    | [html_init.svg](https://github.com/mfhsieh/leaflet-simple-locate/blob/main/images/html_init.svg)               | The initial HTML content of the button.                                                               |
| htmlSpinner       | String    | [html_spinner.svg](https://github.com/mfhsieh/leaflet-simple-locate/blob/main/images/html_spinner.svg)         | The HTML content of the button during the user authorization period.                                  |
| htmlGeolocation   | String    | [html_geolocation.svg](https://github.com/mfhsieh/leaflet-simple-locate/blob/main/images/html_geolocation.svg) | The HTML content of the button for geolocation authorization only.                                    |
| htmlOrientation   | String    | [html_orientation.svg](https://github.com/mfhsieh/leaflet-simple-locate/blob/main/images/html_orientation.svg) | The HTML content of the button for geolocation and orientation authorization.                         |
| iconGeolocation   | L.divIcon | [icon_geolocation.svg](https://github.com/mfhsieh/leaflet-simple-locate/blob/main/images/icon_geolocation.svg) | The icon representing geolocation.                                                                    |
| iconOrientation   | L.divIcon | [icon_orientation.svg](https://github.com/mfhsieh/leaflet-simple-locate/blob/main/images/icon_orientation.svg) | The icon representing geolocation and orientation.                                                    |

# Where

* Source Code: [Github](https://github.com/mfhsieh/leaflet-simple-locate)