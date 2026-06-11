import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import { PopupContent } from "../component/PopupContent";

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
  const states = [
    // 🔹 SOUTH INDIA
    { name: "Tamil Nadu", iso: "TN", capital: "Chennai", coords: [80.27, 13.08], pop: 7100000, region: "South" },
    { name: "Kerala", iso: "KL", capital: "Thiruvananthapuram", coords: [76.94, 8.52], pop: 960000, region: "South" },
    { name: "Karnataka", iso: "KA", capital: "Bengaluru", coords: [77.59, 12.97], pop: 8400000, region: "South" },
    { name: "Andhra Pradesh", iso: "AP", capital: "Amaravati", coords: [80.50, 16.51], pop: 100000, region: "South" },
    { name: "Telangana", iso: "TS", capital: "Hyderabad", coords: [78.48, 17.38], pop: 6800000, region: "South" },

    // 🔹 WEST INDIA
    { name: "Maharashtra", iso: "MH", capital: "Mumbai", coords: [72.88, 19.07], pop: 12400000, region: "West" },
    { name: "Gujarat", iso: "GJ", capital: "Gandhinagar", coords: [72.64, 23.22], pop: 210000, region: "West" },
    { name: "Rajasthan", iso: "RJ", capital: "Jaipur", coords: [75.79, 26.91], pop: 3000000, region: "West" },
    { name: "Goa", iso: "GA", capital: "Panaji", coords: [73.83, 15.49], pop: 115000, region: "West" },

    // 🔹 NORTH INDIA
    { name: "Delhi", iso: "DL", capital: "New Delhi", coords: [77.21, 28.61], pop: 257000, region: "North" },
    { name: "Uttar Pradesh", iso: "UP", capital: "Lucknow", coords: [80.95, 26.85], pop: 2800000, region: "North" },
    { name: "Haryana", iso: "HR", capital: "Chandigarh", coords: [76.78, 30.73], pop: 1100000, region: "North" },
    { name: "Punjab", iso: "PB", capital: "Chandigarh", coords: [76.78, 30.73], pop: 1100000, region: "North" },
    { name: "Himachal Pradesh", iso: "HP", capital: "Shimla", coords: [77.17, 31.10], pop: 170000, region: "North" },
    { name: "Uttarakhand", iso: "UK", capital: "Dehradun", coords: [78.03, 30.32], pop: 700000, region: "North" },
    { name: "Jammu and Kashmir", iso: "JK", capital: "Srinagar", coords: [74.80, 34.08], pop: 1200000, region: "North" },
    { name: "Ladakh", iso: "LA", capital: "Leh", coords: [77.58, 34.15], pop: 30000, region: "North" },

    // 🔹 CENTRAL INDIA
    { name: "Madhya Pradesh", iso: "MP", capital: "Bhopal", coords: [77.41, 23.25], pop: 1800000, region: "Central" },
    { name: "Chhattisgarh", iso: "CG", capital: "Raipur", coords: [81.63, 21.25], pop: 1000000, region: "Central" },

    // 🔹 EAST INDIA
    { name: "West Bengal", iso: "WB", capital: "Kolkata", coords: [88.36, 22.57], pop: 4500000, region: "East" },
    { name: "Odisha", iso: "OD", capital: "Bhubaneswar", coords: [85.82, 20.30], pop: 840000, region: "East" },
    { name: "Bihar", iso: "BR", capital: "Patna", coords: [85.14, 25.61], pop: 2000000, region: "East" },
    { name: "Jharkhand", iso: "JH", capital: "Ranchi", coords: [85.32, 23.34], pop: 1100000, region: "East" },

    // 🔹 NORTH-EAST INDIA
    { name: "Assam", iso: "AS", capital: "Dispur", coords: [91.79, 26.14], pop: 150000, region: "North-East" },
    { name: "Arunachal Pradesh", iso: "AR", capital: "Itanagar", coords: [93.62, 27.10], pop: 60000, region: "North-East" },
    { name: "Manipur", iso: "MN", capital: "Imphal", coords: [93.94, 24.82], pop: 270000, region: "North-East" },
    { name: "Meghalaya", iso: "ML", capital: "Shillong", coords: [91.88, 25.57], pop: 300000, region: "North-East" },
    { name: "Mizoram", iso: "MZ", capital: "Aizawl", coords: [92.72, 23.73], pop: 290000, region: "North-East" },
    { name: "Nagaland", iso: "NL", capital: "Kohima", coords: [94.10, 25.67], pop: 100000, region: "North-East" },
    { name: "Tripura", iso: "TR", capital: "Agartala", coords: [91.29, 23.83], pop: 400000, region: "North-East" },
    { name: "Sikkim", iso: "SK", capital: "Gangtok", coords: [88.61, 27.33], pop: 100000, region: "North-East" },

    // 🔹 UNION TERRITORIES
    { name: "Puducherry", iso: "PY", capital: "Puducherry", coords: [79.83, 11.93], pop: 650000, region: "South" },
    { name: "Chandigarh", iso: "CH", capital: "Chandigarh", coords: [76.78, 30.73], pop: 1100000, region: "North" },
    { name: "Dadra and Nagar Haveli and Daman and Diu", iso: "DN", capital: "Daman", coords: [72.85, 20.42], pop: 200000, region: "West" },
    { name: "Andaman and Nicobar Islands", iso: "AN", capital: "Port Blair", coords: [92.74, 11.67], pop: 140000, region: "East" },
    { name: "Lakshadweep", iso: "LD", capital: "Kavaratti", coords: [72.64, 10.57], pop: 11000, region: "West" }
  ];

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
      title: "INdia States",
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