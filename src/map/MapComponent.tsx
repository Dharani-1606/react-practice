import React, { useRef, useEffect } from 'react'
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";

function MapComponent() {
    const mapDiv = useRef(null);

    useEffect(() => {
        if (mapDiv.current) {
            /**
             * Initialize application
             */
            const webmap = new Map({
                basemap: "streets-navigation-vector", // "topo"
            });

            const view = new MapView({
                container: mapDiv.current, // The id or node representing the DOM element containing the view.
                map: webmap, // An instance of a Map object to display in the view.
                center: [78.9629, 20.5937],   // Longitude, Latitude of India center
                zoom: 5,
                scale: 10000000 // Represents the map scale at the center of the view.
            });

            return () => view && view.destroy()

        }
    }, []);

    return <div className="mapDiv" ref={mapDiv} style={{ height: '100vh', width: "100%" }}></div>;

}

export default MapComponent