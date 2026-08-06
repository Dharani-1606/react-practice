import React, { useEffect, useRef, useState } from "react";

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import TileLayer from "@arcgis/core/layers/TileLayer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Legend from "@arcgis/core/widgets/Legend";
import Graphic from "@arcgis/core/Graphic";
import ElevationProfile from "@arcgis/core/widgets/ElevationProfile";
import ElevationLayer from "@arcgis/core/layers/ElevationLayer";
import ElevationProfileAnalysis from "@arcgis/core/analysis/ElevationProfileAnalysis";
import Polyline from "@arcgis/core/geometry/Polyline";
import Ground from "@arcgis/core/Ground";
import ElevationProfilePanel from "./ElevationProfilePanel";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

const ClassBreakDemo = () => {
  const mapDiv = useRef(null);
  const [view, setView] = useState(null);
  const [lineGeometry, setLineGeometry] = useState(null);
  // const graphicsLayer = new GraphicsLayer();

  useEffect(() => {
    const baseLayer = new TileLayer({
      url: "https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer"
    });

    let elevationLayer = new ElevationLayer({
      url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
    });

    const sampleData = [
      { id: 1, value: 0.12, x: -100, y: 40 },
      { id: 2, value: 0.18, x: -99.5, y: 40 },
      { id: 3, value: 0.22, x: -99, y: 40 },
      { id: 4, value: 0.27, x: -98.5, y: 40 },
      { id: 5, value: 0.31, x: -98, y: 40 },
      { id: 6, value: 0.34, x: -97.5, y: 40 },
      { id: 7, value: 0.39, x: -97, y: 40 },
      { id: 8, value: 0.42, x: -96.5, y: 40 },
      { id: 9, value: 0.46, x: -96, y: 40 },
      { id: 10, value: 0.49, x: -95.5, y: 40 },

      { id: 11, value: 0.52, x: -100, y: 39.5 },
      { id: 12, value: 0.55, x: -99.5, y: 39.5 },
      { id: 13, value: 0.58, x: -99, y: 39.5 },
      { id: 14, value: 0.61, x: -98.5, y: 39.5 },
      { id: 15, value: 0.64, x: -98, y: 39.5 },
      { id: 16, value: 0.67, x: -97.5, y: 39.5 },
      { id: 17, value: 0.69, x: -97, y: 39.5 },
      { id: 18, value: 0.72, x: -96.5, y: 39.5 },
      { id: 19, value: 0.75, x: -96, y: 39.5 },
      { id: 20, value: 0.79, x: -95.5, y: 39.5 },

      { id: 21, value: 0.82, x: -100, y: 39 },
      { id: 22, value: 0.85, x: -99.5, y: 39 },
      { id: 23, value: 0.88, x: -99, y: 39 },
      { id: 24, value: 0.91, x: -98.5, y: 39 },
      { id: 25, value: 0.94, x: -98, y: 39 },
      { id: 26, value: 0.97, x: -97.5, y: 39 },
      { id: 27, value: 0.33, x: -97, y: 39 },
      { id: 28, value: 0.48, x: -96.5, y: 39 },
      { id: 29, value: 0.63, x: -96, y: 39 },
      { id: 30, value: 0.77, x: -95.5, y: 39 },

      { id: 31, value: 0.21, x: -100, y: 38.5 },
      { id: 32, value: 0.36, x: -99.5, y: 38.5 },
      { id: 33, value: 0.44, x: -99, y: 38.5 },
      { id: 34, value: 0.57, x: -98.5, y: 38.5 },
      { id: 35, value: 0.66, x: -98, y: 38.5 },
      { id: 36, value: 0.72, x: -97.5, y: 38.5 },
      { id: 37, value: 0.81, x: -97, y: 38.5 },
      { id: 38, value: 0.92, x: -96.5, y: 38.5 },
      { id: 39, value: 0.14, x: -96, y: 38.5 },
      { id: 40, value: 0.29, x: -95.5, y: 38.5 }
    ];

    const graphics = sampleData.map((item) => {
      return new Graphic({
        geometry: {
          type: "point",
          longitude: item.x,
          latitude: item.y
        },
        attributes: {
          ObjectID: item.id,
          percent: item.value
        }
      });
    });

    // ----- Class Break Renderer -----
    const renderer = {
      type: "class-breaks",
      field: "percent",
      legendOptions: {
        title: "Sample Values"
      },
      classBreakInfos: [
        {
          minValue: 0,
          maxValue: 0.25,
          symbol: {
            type: "simple-marker",
            color: "#fffcd4",
            size: 10
          },
          label: "< 25%"
        },
        {
          minValue: 0.25,
          maxValue: 0.40,
          symbol: {
            type: "simple-marker",
            color: "#b1cdc2",
            size: 12
          },
          label: "25 - 40%"
        },
        {
          minValue: 0.40,
          maxValue: 0.50,
          symbol: {
            type: "simple-marker",
            color: "#38627a",
            size: 14
          },
          label: "40 - 50%"
        },
        {
          minValue: 0.50,
          maxValue: 1,
          symbol: {
            type: "simple-marker",
            color: "#0d2644",
            size: 16
          },
          label: "> 50%"
        }
      ]
    };

    const featureLayer = new FeatureLayer({
      source: graphics,
      objectIdField: "ObjectID",
      fields: [
        { name: "ObjectID", type: "oid" },
        { name: "percent", type: "double" }
      ],
      renderer: renderer,
      popupTemplate: {
        title: "Point {ObjectID}",
        content: "Value: {percent}"
      }
    });

    const map = new Map({
      layers: [baseLayer, featureLayer],
      ground: new Ground({
        layers: [elevationLayer]
      })
    });

    const mapView = new MapView({
      container: mapDiv.current,
      map: map,
      center: [-118.805, 34.027],
      zoom: 4
    });

    mapView.when(() => {
      const linePoint = [
          [-118.82, 34.02],
          [-118.80, 34.04],
          [-118.78, 34.03]
        ]
      const line = new Polyline({
        paths: linePoint
      });
      // const graphic = new Graphic({
      //   geometry: line,
      //   symbol: new SimpleLineSymbol({
      //     color: "red",
      //     width: 3
      //   })
      // });
      setLineGeometry(null);
    })
    setView(mapView);
    return () => mapView.destroy();
  }, []);

  return (
    <>
    <div
      ref={mapDiv}
      style={{
        height: "100vh",
        width: "100%"
      }}
    />
    {view && (
        <ElevationProfilePanel
          view={view}
        />
      )}
    </>
  );
};

export default ClassBreakDemo;