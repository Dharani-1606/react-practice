import React, { useEffect, useRef } from "react";

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import Graphic from "@arcgis/core/Graphic";

const GroupLayerExample = () => {
  const mapDiv = useRef(null);
  const viewRef = useRef(null);
  const groupLayerRef = useRef(null);
  const layerCountRef = useRef(0);

  // -----------------------------
  // Initialize Map (Only Once)
  // -----------------------------
  useEffect(() => {
    if (!mapDiv.current) return;

    const map = new Map({
      basemap: "streets-vector"
    });

    const view = new MapView({
      container: mapDiv.current,
      map: map,
      center: [78.1460, 11.6643], // Salem
      zoom: 8
    });

    // Create GroupLayer (folder concept)
    const groupLayer = new GroupLayer({
      title: "Generated Layers",
      visibilityMode: "independent"
    });

    map.add(groupLayer);

    viewRef.current = view;
    groupLayerRef.current = groupLayer;

    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);

  // -----------------------------
  // Mock API (Replace with real API)
  // -----------------------------
  const fetchData = async () => {
    // Simulated API response
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = Array.from({ length: 20 }).map((_, i) => ({
          id: i + 1,
          latitude: 11.5 + Math.random(),
          longitude: 78 + Math.random(),
          value: Math.floor(Math.random() * 100)
        }));
        resolve(mockData);
      }, 800);
    });
  };

  // -----------------------------
  // Generate Layer
  // -----------------------------
  const handleGenerate = async () => {
    if (!viewRef.current || !groupLayerRef.current) return;

    try {
      const data = await fetchData();

      // Convert to Graphics
      const graphics = data.map((item) => {
        return new Graphic({
          geometry: {
            type: "point",
            longitude: item.longitude,
            latitude: item.latitude
          },
          attributes: {
            ObjectID: item.id,
            value: item.value
          }
        });
      });

      layerCountRef.current += 1;

      // Create FeatureLayer (Client-side)
      const featureLayer = new FeatureLayer({
        title: `Layer ${layerCountRef.current}`,
        source: graphics,
        objectIdField: "ObjectID",
        fields: [
          { name: "ObjectID", type: "oid" },
          { name: "value", type: "double" }
        ],
        geometryType: "point",
        spatialReference: { wkid: 4326 },

        renderer: {
          type: "simple",
          symbol: {
            type: "simple-marker",
            size: 8,
            outline: {
              width: 1,
              color: "white"
            }
          },
          visualVariables: [
            {
              type: "size",
              field: "value",
              minDataValue: 0,
              maxDataValue: 100,
              minSize: 6,
              maxSize: 30
            },
            {
              type: "color",
              field: "value",
              stops: [
                { value: 0, color: "green" },
                { value: 50, color: "yellow" },
                { value: 100, color: "red" }
              ]
            }
          ]
        }
      });

      // Add to GroupLayer
      groupLayerRef.current.add(featureLayer);

      // Zoom to layer
      await viewRef.current.goTo(featureLayer.fullExtent);

    } catch (error) {
      console.error("Layer generation failed:", error);
    }
  };

  // -----------------------------
  // Clear All Layers
  // -----------------------------
  const handleClear = () => {
    if (groupLayerRef.current) {
      groupLayerRef.current.removeAll();
      layerCountRef.current = 0;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={handleGenerate}>Generate</button>
        <button onClick={handleClear} style={{ marginLeft: "10px" }}>
          Clear Layers
        </button>
      </div>

      <div
        ref={mapDiv}
        style={{ height: "600px", width: "100%" }}
      />
    </div>
  );
};

export default GroupLayerExample;
