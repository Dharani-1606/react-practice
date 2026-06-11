import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";

// Toggle between UniqueValueRenderer and HeatmapRenderer
export default function HeatMapExample() {
    const mapDiv = useRef(null);
    const layerRef = useRef(null);
    const [mode, setMode] = useState("unique"); // unique | heatmap

    useEffect(() => {
        if (!mapDiv.current) return;

        // Client-side graphics
        const graphics = [
            new Graphic({ geometry: { type: "point", longitude: 77.5946, latitude: 12.9716 }, attributes: { ObjectID: 1, value: 10 } }), // Bangalore
            new Graphic({ geometry: { type: "point", longitude: 80.2707, latitude: 13.0827 }, attributes: { ObjectID: 2, value: 20 } }), // Chennai
            new Graphic({ geometry: { type: "point", longitude: 72.8777, latitude: 19.0760 }, attributes: { ObjectID: 3, value: 30 } }), // Mumbai
            new Graphic({ geometry: { type: "point", longitude: 78.4867, latitude: 17.3850 }, attributes: { ObjectID: 4, value: 20 } }), // Hyderabad
            new Graphic({ geometry: { type: "point", longitude: 77.1025, latitude: 28.7041 }, attributes: { ObjectID: 5, value: 30 } }), // Delhi
            new Graphic({ geometry: { type: "point", longitude: 76.9366, latitude: 8.5241 }, attributes: { ObjectID: 6, value: 10 } }), // Trivandrum
            new Graphic({ geometry: { type: "point", longitude: 75.8577, latitude: 22.7196 }, attributes: { ObjectID: 7, value: 20 } }), // Indore
            new Graphic({ geometry: { type: "point", longitude: 73.8567, latitude: 18.5204 }, attributes: { ObjectID: 8, value: 30 } }), // Pune
            new Graphic({ geometry: { type: "point", longitude: 88.3639, latitude: 22.5726 }, attributes: { ObjectID: 9, value: 20 } }), // Kolkata
            new Graphic({ geometry: { type: "point", longitude: 74.8723, latitude: 31.6340 }, attributes: { ObjectID: 10, value: 10 } }) // Amritsar
        ];

        // UniqueValueRenderer
        const uniqueValueRenderer = {
            type: "unique-value",
            field: "value",
            uniqueValueInfos: [
                {
                    value: 10,
                    symbol: { type: "simple-marker", size: 10, color: "#2b83ba" },
                    label: "Low"
                },
                {
                    value: 20,
                    symbol: { type: "simple-marker", size: 12, color: "#abdda4" },
                    label: "Medium"
                },
                {
                    value: 30,
                    symbol: { type: "simple-marker", size: 14, color: "#d7191c" },
                    label: "High"
                }
            ]
        };

        // HeatmapRenderer
        const heatmapRenderer = {
            type: "heatmap",
            colorStops: [
                { ratio: 0, color: "rgba(255,255,255,0)" },
                { ratio: 0.3, color: "#8b049cff" },
                { ratio: 0.6, color: "#271301ff" },
                { ratio: 1, color: "#225ea8" }
            ],
            minPixelIntensity: 1,
            maxPixelIntensity: 50
        };

        const featureLayer = new FeatureLayer({
            source: graphics,
            objectIdField: "ObjectID",
            fields: [
                { name: "ObjectID", type: "oid" },
                { name: "value", type: "integer" }
            ],
            geometryType: "point",
            spatialReference: { wkid: 4326 },
            renderer: uniqueValueRenderer
        });

        layerRef.current = featureLayer;

        const map = new Map({
            basemap: "streets-navigation-vector",
            layers: [featureLayer]
        });

        const view = new MapView({
            container: mapDiv.current,
            map,
            center: [78.9629, 20.5937],
            zoom: 4
        });

        // Store renderers for toggle
        featureLayer._uniqueRenderer = uniqueValueRenderer;
        featureLayer._heatmapRenderer = heatmapRenderer;

        return () => view.destroy();
    }, []);

    // Toggle renderer
    const toggleRenderer = () => {
        if (!layerRef.current) return;

        if (mode === "unique") {
            layerRef.current.renderer = layerRef.current._heatmapRenderer;
            setMode("heatmap");
        } else {
            layerRef.current.renderer = layerRef.current._uniqueRenderer;
            setMode("unique");
        }
    };

    return (
        <>
            <button
                onClick={toggleRenderer}
                style={{ position: "absolute", zIndex: 99, top: 10, left: 10 }}
            >
                Switch to {mode === "unique" ? "Heatmap" : "Unique Value"}
            </button>
            <div ref={mapDiv} style={{ width: "100%", height: "100vh" }} />
        </>
    );
}
