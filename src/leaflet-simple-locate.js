/*
 * Leaflet.SimpleLocate v1.0.6 - 2026-02-28
 *
 * Copyright 2026 mfhsieh
 * mfhsieh@gmail.com
 *
 * Licensed under the MIT license.
 *
 * Demos:
 * https://mfhsieh.github.io/leaflet-simple-locate/
 *
 * Source:
 * git@github.com:mfhsieh/leaflet-simple-locate.git
 *
 */
(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD module
        define(["leaflet"], factory);

    } else if (typeof exports === "object") {
        // CommonJS module
        module.exports = factory(require("leaflet"));

    } else if (typeof window !== "undefined") {
        // Browser globals
        if (typeof window.L === "undefined") throw "Leaflet must be loaded first.";
        window.L.Control.SimpleLocate = factory(window.L);
    }
})(function (L) {
    "use strict";

    /**
     * A Leaflet control to handle geolocation and orientation.
     * @class
     * @extends L.Control
     */
    const SimpleLocate = L.Control.extend({
        /**
         * @typedef {Object} SimpleLocateOptions
         * @property {string} className - Additional CSS class for the control button.
         * @property {string} title - Tooltip text for the button.
         * @property {string} ariaLabel - ARIA label for accessibility.
         * @property {number} minAngleChange - Minimum angle change to trigger an update.
         * @property {number} clickTimeoutDelay - Delay before processing a click event.
         * @property {boolean} setViewAfterClick - Whether to re-center the map after clicking.
         * @property {number} [zoomLevel] - Zoom level when centering the map.
         * @property {boolean} drawCircle - Whether to draw an accuracy circle.
         * @property {Function} [afterClick] - Callback after button click. Receives `{geolocation: boolean, orientation: boolean}`.
         * @property {Function} [afterMarkerAdd] - Callback after adding a marker.
         * @property {Function} [afterDeviceMove] - Callback after device movement. Receives `{lat: number, lng: number, accuracy: number, angle: number}`.
         * @property {string} htmlInit - HTML content for the initial button state.
         * @property {string} htmlSpinner - HTML content for the loading spinner state.
         * @property {string} htmlGeolocation - HTML content for the geolocation active state.
         * @property {string} htmlOrientation - HTML content for the orientation active state.
         * @property {L.DivIcon} iconGeolocation - Icon used for geolocation marker.
         * @property {L.DivIcon} iconOrientation - Icon used for orientation marker.
         */
        options: {
            className: "",
            title: "Locate Geolocation and Orientation",
            ariaLabel: "",

            minAngleChange: 3,
            clickTimeoutDelay: 500,

            setViewAfterClick: true,
            zoomLevel: undefined,
            drawCircle: true,

            afterClick: null,
            afterMarkerAdd: null,
            afterDeviceMove: null,

            htmlInit: `
<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
	<path d="M 8,1.5 A 6.5,6.5 0 0 0 1.5,8 6.5,6.5 0 0 0 8,14.5 6.5,6.5 0 0 0 14.5,8 6.5,6.5 0 0 0 8,1.5 Z m 0,2 A 4.5,4.5 0 0 1 12.5,8 4.5,4.5 0 0 1 8,12.5 4.5,4.5 0 0 1 3.5,8 4.5,4.5 0 0 1 8,3.5 Z" />
	<rect width="1.5" height="4" x="7.25" y="0.5" rx="0.5" ry="0.5" />
	<rect width="1.5" height="4" x="7.25" y="11.5" rx="0.5" ry="0.5" />
	<rect width="4" height="1.5" x="0.5" y="7.25" rx="0.5" ry="0.5" />
	<rect width="4" height="1.5" x="11.5" y="7.25" rx="0.5" ry="0.5" />
	<circle cx="8" cy="8" r="1" />
</svg>`,
            htmlSpinner: `
<svg width="16" height="16" viewBox="-8 -8 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
	<g>
		<circle opacity=".7" cx="0" cy="-6" r=".9" transform="rotate(90)" />
		<circle opacity=".9" cx="0" cy="-6" r="1.3" transform="rotate(45)" />
		<circle opacity="1" cx="0" cy="-6" r="1.5" />
		<circle opacity=".95" cx="0" cy="-6" r="1.42" transform="rotate(-45)" />
		<circle opacity=".85" cx="0" cy="-6" r="1.26" transform="rotate(-90)" />
		<circle opacity=".7" cx="0" cy="-6" r="1.02" transform="rotate(-135)" />
		<circle opacity=".5" cx="0" cy="-6" r=".7" transform="rotate(-180)" />
		<circle opacity=".25" cx="0" cy="-6" r=".3" transform="rotate(-225)" />
		<animateTransform attributeName="transform" type="rotate" values="0;0;45;45;90;90;135;135;180;180;225;225;270;270;315;315;360" keyTimes="0;.125;.125;.25;.25;.375;.375;.5;.5;.675;.675;.75;.75;.875;.875;1;1" dur="1.3s" repeatCount="indefinite" />
	</g>
</svg>`,
            htmlGeolocation: `
<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
	<path d="M 13.329384,2.6706085 C 13.133096,2.4743297 12.77601,2.4382611 12.303066,2.6103882 L 6.6307133,4.6742285 1.1816923,6.6577732 C 1.0668479,6.6995703 0.95157337,6.752486 0.83540381,6.8133451 0.27343954,7.1201064 0.41842508,7.4470449 1.2644998,7.5962244 l 6.0688263,1.0701854 1.0714872,6.0698222 c 0.1491847,0.84604 0.4751513,0.990031 0.7816575,0.427825 0.060857,-0.116165 0.1137803,-0.231436 0.1555779,-0.346273 L 11.324426,9.3702482 13.389608,3.6968841 C 13.56174,3.2239596 13.52567,2.8668883 13.329392,2.6706094 Z" />
</svg>`,
            htmlOrientation: `
<svg class="leaflet-simple-locate-orientation" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
	<path fill="#c00000" d="M 8,0 C 7.7058986,0 7.4109021,0.30139625 7.1855469,0.90234375 L 5.3378906,5.8300781 C 5.2559225,6.0486598 5.1908259,6.292468 5.1386719,6.5507812 6.0506884,6.193573 7.0205489,6.0068832 8,6 8.9768002,6.0005071 9.945249,6.1798985 10.857422,6.5292969 10.805917,6.2790667 10.741782,6.0425374 10.662109,5.8300781 L 8.8144531,0.90234375 C 8.5890978,0.30139615 8.2941007,0 8,0 Z" />
	<path d="M 8,5.9999998 C 7.0205501,6.006884 6.0506874,6.1935733 5.138672,6.5507817 4.9040515,7.7126196 4.9691485,9.1866095 5.3378906,10.169922 l 1.8476563,4.927734 c 0.4507105,1.201895 1.1781958,1.201894 1.628906,0 L 10.662109,10.169922 C 11.033147,9.1804875 11.097283,7.6944254 10.857422,6.5292967 9.9452497,6.1798989 8.9767993,6.0005076 8,5.9999998 Z m -1e-7,0.7499999 A 1.25,1.258 90 0 1 9.2578124,7.9999996 1.25,1.258 90 0 1 8,9.2500001 a 1.25,1.258 90 0 1 -1.2578124,-1.25 1.25,1.258 90 0 1 1.2578123,-1.2500004 z" />
</svg>`,
            iconGeolocation: L.divIcon({
                html: `
<svg width="24" height="24" viewBox="-12 -12 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
	<defs>
		<filter id="gaussian">
			<feGaussianBlur stdDeviation="0.5" />
		</filter>
	</defs>
	<g id="leaflet-simple-locate-icon-spot">
		<circle fill="#000000" style="opacity:0.3;filter:url(#gaussian)" cx="1" cy="1" r="10" />
		<circle fill="#ffffff" r="10" />
		<circle r="6">
			<animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
		</circle>
	</g>
</svg>`,
                className: "leaflet-simple-locate-icon",
                iconSize: [24, 24],
                iconAnchor: [12, 12],
            }),
            iconOrientation: L.divIcon({
                html: `
<svg width="96" height="96" viewBox="-48 -48 96 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
	<defs>
		<linearGradient id="gradient" x2="0" y2="-48" gradientUnits="userSpaceOnUse">
			<stop style="stop-opacity:1" offset="0" />
			<stop style="stop-opacity:0" offset="1" />
		</linearGradient>
		<filter id="gaussian">
			<feGaussianBlur stdDeviation="0.5" />
		</filter>
	</defs>
	<path class="orientation" opacity="1" style="fill:url(#gradient)" d="M -24,-48 H 24 L 10,0 H -10 z">
		<animate attributeName="opacity" values=".75;.33;.75" dur="2s" repeatCount="indefinite" />
	</path>
	<g id="leaflet-simple-locate-icon-spot">
		<circle fill="#000000" style="opacity:0.3;filter:url(#gaussian)" cx="1" cy="1" r="10" />
		<circle fill="#ffffff" r="10" />
		<circle r="6">
			<animate attributeName="r" values="6;9;6" dur="2s" repeatCount="indefinite" />
		</circle>
	</g>
</svg>`,
                className: "leaflet-simple-locate-icon",
                iconSize: [96, 96],
                iconAnchor: [48, 48],
            }),
        },

        /**
         * Initializes the SimpleLocate control.
         *
         * @function initialize
         * @memberof SimpleLocate
         * @param {SimpleLocateOptions} options The options for the SimpleLocate control.
         * @returns {void}
         */
        initialize: function (options) {
            L.Util.setOptions(this, options);

            // map related
            this._map = undefined;
            this._button = undefined;
            this._marker = undefined;
            this._circle = undefined;

            // button state
            this._clicked = undefined;
            this._geolocation = undefined;
            this._orientation = undefined;
            this._clickTimeout = undefined;

            // geolocation and orientation
            this._latitude = undefined;
            this._longitude = undefined;
            this._accuracy = undefined;
            this._angle = undefined;

            // performance
            this._updateRequestId = undefined;
        },

        /**
         * Adds the SimpleLocate control to the Leaflet map.
         *
         * @function onAdd
         * @memberof SimpleLocate
         * @param {L.Map} map The Leaflet map to add the control to.
         * @returns {HTMLElement} The control's button element.
         */
        onAdd: function (map) {
            this._map = map;

            this._button = L.DomUtil.create("button", "leaflet-simple-locate");
            if (this.options.className) L.DomUtil.addClass(this._button, this.options.className);
            L.DomEvent.disableClickPropagation(this._button);

            this._button.innerHTML = this.options.htmlInit;
            this._button.title = this.options.title;
            this._button.setAttribute("aria-label", this.options.ariaLabel ? this.options.ariaLabel : this.options.title);

            L.DomEvent
                .on(this._button, "click", L.DomEvent.stopPropagation)
                .on(this._button, "click", L.DomEvent.preventDefault)
                .on(this._button, "click", this._onClick, this);

            return this._button;
        },

        /**
         * Removes the SimpleLocate control from the Leaflet map and cleans up events.
         *
         * @function onRemove
         * @memberof SimpleLocate
         * @param {L.Map} map The Leaflet map the control is being removed from.
         * @returns {void}
         */
        onRemove: function (map) {
            if (this._clickTimeout) {
                clearTimeout(this._clickTimeout);
                this._clickTimeout = undefined;
            }

            if (this._updateRequestId) {
                cancelAnimationFrame(this._updateRequestId);
                this._updateRequestId = undefined;
            }

            if (this._clicked) {
                if (this._geolocation) this._unwatchGeolocation();
                if (this._orientation) this._unwatchOrientation();
                this._clicked = undefined;
                this._geolocation = undefined;
                this._orientation = undefined;
            }

            this._map.off("layeradd", this._onLayerAdd, this);

            L.DomEvent.off(this._button, "click", this._onClick, this);
        },

        /**
         * Returns the current latitude and longitude.
         *
         * @function getLatLng
         * @memberof SimpleLocate
         * @returns {LatLngLiteral|null} The current latitude and longitude, or `null` if not available.
         */
        getLatLng: function () {
            if (!this._latitude || !this._longitude) return null;
            return {
                lat: this._latitude,
                lng: this._longitude,
            };
        },

        /**
         * Returns the current accuracy of the location.
         *
         * @function getAccuracy
         * @memberof SimpleLocate
         * @returns {number|null} The current accuracy in meters, or `null` if not available.
         */
        getAccuracy: function () {
            if (!this._accuracy) return null;
            return this._accuracy;
        },

        /**
         * Returns the current device orientation angle.
         *
         * @function getAngle
         * @memberof SimpleLocate
         * @returns {number|null} The current device orientation angle in degrees, or `null` if not available.
         */
        getAngle: function () {
            if (!this._angle) return null;
            return this._angle;
        },

        /**
         * Sets the zoom level for the map view.
         *
         * @function setZoomLevel
         * @memberof SimpleLocate
         * @param {number} level The zoom level to set.
         * @returns {void}
         */
        setZoomLevel: function (level) {
            this.options.zoomLevel = level;
        },

        /**
         * Handles the click event on the control's button.
         *
         * @private
         * @async
         * @function _onClick
         * @memberof SimpleLocate
         * @returns {Promise<void>}
         */
        _onClick: async function () {
            if (this._clickTimeout) {
                // console.log("_onClick: double click", new Date().toISOString());
                clearTimeout(this._clickTimeout);
                this._clickTimeout = undefined;

                if (this._clicked) {
                    if (this._geolocation) this._unwatchGeolocation();
                    if (this._orientation) this._unwatchOrientation();
                    this._clicked = undefined;
                    this._geolocation = undefined;
                    this._orientation = undefined;
                    this._updateButton();
                    this._map.off("layeradd", this._onLayerAdd, this);
                }
            } else {
                this._clickTimeout = setTimeout(() => {
                    // console.log("_onClick: single click", new Date().toISOString());
                    clearTimeout(this._clickTimeout);
                    this._clickTimeout = undefined;

                    if (!this._map) return;

                    if (this._clicked && this.options.setViewAfterClick) {
                        this._setView();
                        return;
                    }

                    this._clicked = true;
                    this._updateButton();
                    this._map.on("layeradd", this._onLayerAdd, this);

                    this._checkGeolocation().then((event) => {
                        // console.log("_checkGeolocation", new Date().toISOString(), "success!");
                        this._geolocation = true;
                        this._onLocationFound(event.coords);
                        if (this.options.setViewAfterClick) this._setView();
                        this._watchGeolocation();
                        this._checkClickResult();
                    }).catch(() => {
                        // console.log("_checkGeolocation", new Date().toISOString(), "failed!");
                        this._geolocation = false;
                        this._checkClickResult();
                    });

                    this._checkOrientation().then(() => {
                        // console.log("_checkOrientation", new Date().toISOString(), "success!");
                        this._orientation = true;
                        this._watchOrientation();
                        this._checkClickResult();
                    }).catch(() => {
                        // console.log("_checkOrientation", new Date().toISOString(), "failed!");
                        this._orientation = false;
                        this._checkClickResult();
                    });
                }, this.options.clickTimeoutDelay);
            }
        },

        /**
         * Updates the button state and triggers the `afterClick` callback if defined.
         *
         * @private
         * @function _checkClickResult
         * @memberof SimpleLocate
         * @returns {void}
         */
        _checkClickResult: function () {
            this._updateButton();

            if (this.options.afterClick && typeof this._geolocation !== "undefined" && typeof this._orientation !== "undefined")
                this.options.afterClick({
                    geolocation: this._geolocation,
                    orientation: this._orientation,
                });

            if (this._geolocation === false && this._orientation === false) {
                this._clicked = undefined;
                this._geolocation = undefined;
                this._orientation = undefined;
            }
        },

        /**
         * Checks if the browser supports geolocation and retrieves the current position.
         *
         * @private
         * @function _checkGeolocation
         * @memberof SimpleLocate
         * @returns {Promise<GeolocationCoordinates>} A promise that resolves with the
         * geolocation coordinates if successful, or rejects if geolocation is not
         * supported or an error occurs.
         */
        _checkGeolocation: function () {
            if (typeof navigator !== "object" || !("geolocation" in navigator) ||
                typeof navigator.geolocation.getCurrentPosition !== "function" || typeof navigator.geolocation.watchPosition !== "function")
                return Promise.reject();

            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { maximumAge: 0, enableHighAccuracy: true });
            });
        },

        /**
         * Checks if the browser supports device orientation and requests permission if needed.
         *
         * @private
         * @function _checkOrientation
         * @memberof SimpleLocate
         * @returns {Promise<boolean>} A promise that resolves with `true` if device
         * orientation is supported and permission is granted (if needed), or rejects if
         * device orientation is not supported or permission is denied.
         */
        _checkOrientation: function () {
            if (!("ondeviceorientationabsolute" in window || "ondeviceorientation" in window) || !DeviceOrientationEvent)
                return Promise.reject();

            if (typeof DeviceOrientationEvent.requestPermission !== "function")
                return Promise.resolve();

            return DeviceOrientationEvent.requestPermission().then((permission) => {
                if (permission === "granted") return true;
                else return Promise.reject();
            });
        },

        /**
         * Starts watching the device's geolocation for changes.
         *
         * @private
         * @function _watchGeolocation
         * @memberof SimpleLocate
         * @returns {void}
         */
        _watchGeolocation: function () {
            // console.log("_watchGeolocation");
            this._map.locate({ watch: true, enableHighAccuracy: true });
            this._map.on("locationfound", this._onLocationFound, this);
            // this._map.on("locationerror", this._onLocationError, this);
            this._map.on("zoomstart", this._onZoomStart, this);
            this._map.on("zoomend", this._onZoomEnd, this);
        },

        /**
         * Stops watching the device's geolocation for changes and removes related layers.
         *
         * @private
         * @function _unwatchGeolocation
         * @memberof SimpleLocate
         * @returns {void}
         */
        _unwatchGeolocation: function () {
            // console.log("_unwatchGeolocation");
            this._map.stopLocate();
            this._map.off("locationfound", this._onLocationFound, this);
            // this._map.off("locationerror", this._onLocationError, this);
            this._map.off("zoomstart", this._onZoomStart, this);
            this._map.off("zoomend", this._onZoomEnd, this);

            if (this._circle) {
                this._map.removeLayer(this._circle);
                this._circle = undefined;
            }
            if (this._marker) {
                this._map.removeLayer(this._marker);
                this._marker = undefined;
            }
            this._latitude = undefined;
            this._longitude = undefined;
            this._accuracy = undefined;
        },

        /**
         * Starts listening for device orientation changes.
         *
         * @private
         * @function _watchOrientation
         * @memberof SimpleLocate
         * @returns {void}
         */
        _watchOrientation: function () {
            // console.log("_watchOrientation");
            L.DomEvent.on(window, "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation", this._onOrientation, this);
        },

        /**
         * Stops listening for device orientation changes and resets the orientation style.
         *
         * @private
         * @function _unwatchOrientation
         * @memberof SimpleLocate
         * @returns {void}
         */
        _unwatchOrientation: function () {
            // console.log("_unwatchOrientation");
            L.DomEvent.off(window, "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation", this._onOrientation, this);
            this._map.getContainer().style.setProperty("--leaflet-simple-locate-orientation", "0deg");
            this._angle = undefined;
        },

        /**
         * Handles the `locationfound` event from the Leaflet map.
         *
         * @private
         * @function _onLocationFound
         * @memberof SimpleLocate
         * @param {GeolocationCoordinates|L.LocationEvent} event The event object containing the new
         * location data.
         * @returns {void}
         */
        _onLocationFound: function (event) {
            // console.log("_onLocationFound", new Date().toISOString(), event.latitude, event.longitude, event.accuracy);
            if (this._latitude && event.latitude && Math.round(this._latitude * 1000000) === Math.round(event.latitude * 1000000) &&
                this._longitude && event.longitude && Math.round(this._longitude * 1000000) === Math.round(event.longitude * 1000000) &&
                this._accuracy && event.accuracy && Math.round(this._accuracy * 100) === Math.round(event.accuracy * 100)) return;
            this._latitude = event.latitude;
            this._longitude = event.longitude;
            this._accuracy = event.accuracy;
            this._requestUpdate();
        },

        // _onLocationError: function (event) {
        //     console.log("_onLocationError", new Date().toISOString(), event.code, event.message);
        // },

        /**
         * Handles the `deviceorientation` or `deviceorientationabsolute` event from the window.
         *
         * @private
         * @function _onOrientation
         * @memberof SimpleLocate
         * @param {DeviceOrientationEvent} event The event object containing the orientation data.
         * @returns {void}
         */
        _onOrientation: function (event) {
            // console.log("_onOrientation", new Date().toISOString(), event.absolute, event.alpha, event.beta, event.gamma);
            let angle;
            if (event.webkitCompassHeading) angle = event.webkitCompassHeading;
            else angle = 360 - event.alpha;  // TODO: test needed on non-iOS devices.

            if (this._angle && Math.abs(angle - this._angle) < this.options.minAngleChange) return;
            this._angle = angle;

            if ("orientation" in screen) this._angle += screen.orientation.angle;
            // else if (typeof window.orientation !== 'undefined') this._angle += window.orientation;  // it seems unnecessary.
            this._angle = (this._angle + 360) % 360;

            this._map.getContainer().style.setProperty("--leaflet-simple-locate-orientation", -this._angle + "deg");
            this._requestUpdate();
        },

        /**
         * Handles the `zoomstart` event from the Leaflet map.
         *
         * @private
         * @function _onZoomStart
         * @memberof SimpleLocate
         * @returns {void}
         */
        _onZoomStart: function () {
            if (this._circle) document.documentElement.style.setProperty("--leaflet-simple-locate-circle-display", "none");
        },

        /**
         * Handles the `zoomend` event from the Leaflet map.
         *
         * @private
         * @function _onZoomEnd
         * @memberof SimpleLocate
         * @returns {void}
         */
        _onZoomEnd: function () {
            if (this._circle) document.documentElement.style.setProperty("--leaflet-simple-locate-circle-display", "inline");
        },

        /**
         * Handles the `layeradd` event from the Leaflet map.
         *
         * @private
         * @function _onLayerAdd
         * @memberof SimpleLocate
         * @param {LayerEvent} event The event object containing information about the
         * added layer.
         * @returns {void}
         */
        _onLayerAdd: function (event) {
            if (this.options.afterMarkerAdd && event.layer == this._marker) {
                // console.log("_onLayerAdd", new Date().toISOString(), event.layer.icon_name ? event.layer.icon_name : "undefined", event.layer);
                this.options.afterMarkerAdd();
            }
        },

        /**
         * Sets the map's view to the current location.
         *
         * @private
         * @function _setView
         * @memberof SimpleLocate
         * @returns {void}
         */
        _setView: function () {
            if (!this._map || !this._latitude || !this._longitude) return;

            if (this.options.zoomLevel)
                this._map.setView([this._latitude, this._longitude], this.options.zoomLevel);
            else
                this._map.setView([this._latitude, this._longitude]);
        },

        /**
         * Updates the button's appearance based on the current state.
         *
         * @private
         * @function _updateButton
         * @memberof SimpleLocate
         * @returns {void}
         */
        _updateButton: function () {
            if (!this._clicked) {
                if (this._button.html_name !== "init") {
                    this._button.innerHTML = this.options.htmlInit;
                    this._button.html_name = "init";
                }
                return;
            }

            if (typeof this._geolocation === "undefined" || typeof this._orientation === "undefined") {
                if (this._button.html_name !== "spinner") {
                    this._button.innerHTML = this.options.htmlSpinner;
                    this._button.html_name = "spinner";
                }
                return;
            }

            if (this._orientation && this._button.html_name !== "orientation") {
                this._button.innerHTML = this.options.htmlOrientation;
                this._button.html_name = "orientation";
                return;
            }

            if (this._geolocation && this._button.html_name !== "geolocation") {
                this._button.innerHTML = this.options.htmlGeolocation;
                this._button.html_name = "geolocation";
            }
        },

        /**
         * Requests an update of the marker and circle using requestAnimationFrame.
         *
         * @private
         * @function _requestUpdate
         * @memberof SimpleLocate
         * @returns {void}
         */
        _requestUpdate: function () {
            if (this._updateRequestId) return;
            this._updateRequestId = requestAnimationFrame(() => {
                this._updateRequestId = undefined;
                this._updateMarker();
            });
        },

        /**
         * Updates the marker and circle on the map with the current location and orientation data.
         *
         * @private
         * @function _updateMarker
         * @memberof SimpleLocate
         * @returns {void}
         */
        _updateMarker: function () {
            if (this.options.afterDeviceMove) this.options.afterDeviceMove({
                lat: this._latitude,
                lng: this._longitude,
                accuracy: this._accuracy,
                angle: this._angle,
            });

            if (!this._latitude || !this._longitude || (this.options.drawCircle && !this._accuracy)) return;

            let icon_name;
            if (this._geolocation && this._orientation && typeof this._angle !== "undefined") icon_name = "iconOrientation";
            else if (this._geolocation) icon_name = "iconGeolocation";
            else return;

            if (this._circle) {
                this._circle.setLatLng([this._latitude, this._longitude]);
                this._circle.setRadius(this._accuracy);
            } else if (this.options.drawCircle)
                this._circle = L.circle([this._latitude, this._longitude], {
                    className: "leaflet-simple-locate-circle",
                    radius: this._accuracy,
                }).addTo(this._map);

            if (this._marker && this._marker.icon_name === icon_name)
                this._marker.setLatLng([this._latitude, this._longitude]);
            else {
                // console.log("_updateMarker", new Date().toISOString(), this._marker ? this._marker.icon_name : "undefined", icon_name);
                if (this._marker) this._map.removeLayer(this._marker);
                this._marker = L.marker([this._latitude, this._longitude], {
                    icon: this.options[icon_name],
                });
                this._marker.icon_name = icon_name;
                this._marker.addTo(this._map);
            }
        },
    });

    /**
     * Creates a new instance of the SimpleLocate control.
     *
     * @function L.control.simpleLocate
     * @memberof L.control
     * @param {SimpleLocateOptions} options The options for the SimpleLocate control.
     * @returns {SimpleLocate} A new instance of the SimpleLocate control.
     */
    L.control.simpleLocate = function (options) {
        return new SimpleLocate(options);
    };

    return SimpleLocate;
});
