import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import { PopupContent } from "../component/PopupContent";
import { states } from "./IndiaStates";

const DARK_COLORS = {
  blue: [0, 82, 204, 0.95],
  darkBlue: [0, 60, 140, 0.95],
  navy: [10, 25, 80, 0.95],
  teal: [0, 96, 100, 0.95],
  green: [0, 120, 60, 0.95],
  darkGreen: [0, 80, 40, 0.95],
  purple: [88, 24, 124, 0.95],
  violet: [70, 0, 130, 0.95],
  maroon: [120, 0, 30, 0.95],
  darkOrange: [180, 70, 0, 0.95]
};
function IndiaMap() {
  const mapDiv = useRef(null);
  useEffect(() => {
    let view;
    if (!mapDiv.current) return;
    //   Minimal dataset: add more states as needed (centroids or capitals)
    // Coordinates are [longitude, latitude] in EPSG:4326
    const graphics = states.map((s, i) => {
      const geometry = new Point({
        spatialReference: { wkid: 4326 },
        longitude: s.coords[0],
        latitude: s.coords[1]
      });

      return new Graphic({
        geometry,
        attributes: {
          ObjectID: i + 1,
          state_name: s.name,
          iso_code: s.iso,
          capital: s.capital,
          population: s.pop,
          region: s.region
        }
      });
    });

    // Unique render
    const makeRenderUniqueRenderer = {
      type: "unique-value",
      field: "region",
      defaultSymbol: {
        type: "simple-marker",
        style: "circle",
        color: [255, 99, 71, 0.95], // tomato red
        size: 15,
        outline: { color: "white", width: 1.5 }
      },
      defaultLabel: "Others/Unknown",
      uniqueValueInfos: [
        {
          label: "South",
          value: "South",
          symbol: { type: "simple-marker", color: DARK_COLORS.purple, size: 15, outline: { color: "white", width: 1 } },
        },
        {
          label: "West",
          value: "West",
          symbol: { type: "simple-marker", color: DARK_COLORS.darkBlue, size: 15, outline: { color: "white", width: 1 } },
        },
        {
          label: "North",
          value: "North",
          symbol: { type: "simple-marker", color: DARK_COLORS.darkGreen, size: 15, outline: { color: "white", width: 1 } },
        },
        {
          label: "East",
          value: "East",
          symbol: { type: "simple-marker", color: DARK_COLORS.darkOrange, size: 15, outline: { color: "white", width: 1 } },
        },
        {
          label: "North-East",
          value: "North-East",
          symbol: { type: "simple-marker", color: DARK_COLORS.maroon, size: 15, outline: { color: "white", width: 1 } },
        }
      ],
      visualVariables: [
        {
          type: "size",
          field: "population",
          stops: [
            { value: 10000000, size: 6 },
            { value: 50000000, size: 10 },
            { value: 150000000, size: 14 },
          ]
        }
      ],
    }

    const featureLayer: any = new FeatureLayer({
      title: "India States",
      source: graphics,
      objectIdField: "ObjectID",
      geometryType: "point",
      spatialReference: { wkid: 4326 },
      fields: [
        { name: "ObjectID", type: "oid" },
        { name: "state_name", type: "string" },
        { name: "iso_code", type: "string" },
        { name: "capital", type: "string" },
        { name: "population", type: "string" },
        { name: "region", type: "string" }
      ],
      renderer: makeRenderUniqueRenderer,
      popupTemplate: {
        title: "{state_name}",
        content: (event: any) => {
          const container = document.createElement("div");
          const root = ReactDOM.createRoot(container);
          root.render(
            <PopupContent feature={event} />
          );
          return container;
        }
      },
      featureReduction: {
        type: "cluster",
        clusterRadius: "60px",
        popupTemplate: {
          title: "Cluster of {cluster_count} features",
          content: "Zoom in to see individual states."
        }
      },
    });

    const map = new Map({
      basemap: "streets-navigation-vector",
      // layers: [featureLayer]
    });

    view = new MapView({
      container: mapDiv.current,
      map,
      center: [78.9629, 20.5937], // India center
      zoom: 4
    });
    map.add(featureLayer)
    return () => view.destroy();
  }, [])

  return (
     <div ref={mapDiv} style={{ width: "100%", height: "100vh" }} />
  )
}

export default IndiaMap