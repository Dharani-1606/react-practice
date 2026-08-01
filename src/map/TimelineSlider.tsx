import { useEffect, useRef, useMemo } from "react";

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import TimeSlider from "@arcgis/core/widgets/TimeSlider";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";

// const now = useMemo(() => new Date(), []); // Current time
// const startTime = useMemo(
//   () => new Date(now.getTime() - 10 * 60 * 1000),
//   [now]
// ); // Start = Now -10 mins
// const endTime = useMemo(
//   () => new Date(now.getTime() + 10 * 60 * 1000),
//   [now]
// ); // End = Now +10 mins
// const interval = (endTime.getTime() - startTime.getTime()) / 3;
// const timeStops: Date[] = [
//   new Date(startTime),
//   new Date(startTime.getTime() + interval),
//   new Date(startTime.getTime() + interval * 2),
//   new Date(endTime)
// ];

const currentTimestamp = Date.now(); // milliseconds
const startTimestamp = currentTimestamp - 10 * 60 * 1000; // -10 minutes
const endTimestamp = startTimestamp + 60 * 60 * 1000; // +1 hour from start

export default function TimelineSlider() {
  const mapDiv = useRef(null);

  function formatDateTime(date: Date) {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }

  const timeStops: number[] = [
    startTimestamp,
    startTimestamp + 20 * 60 * 1000,
    startTimestamp + 40 * 60 * 1000,
    endTimestamp
  ];

  useEffect(() => {
    if (!mapDiv.current) return;

    // -----------------------------------
    // Sample Graphics
    // -----------------------------------
    const graphics = [];
    for (let i = 0; i < 20; i++) {
      graphics.push(
        new Graphic({
          geometry: new Point({
            longitude: 77 + Math.random() * 5,
            latitude: 11 + Math.random() * 5
          }),
          attributes: {
            ObjectID: i + 1,
            name: `Vehicle ${i + 1}`,
            eventTime: new Date(
              startTime.getTime() + i * 60000
            ) // every minute
          }
        })
      );
    }

    // -----------------------------------
    // Feature Layer
    // -----------------------------------

    const layer = new FeatureLayer({
      source: graphics,
      objectIdField: "ObjectID",
      geometryType: "point",
      fields: [
        {
          name: "ObjectID",
          type: "oid"
        },
        {
          name: "name",
          type: "string"
        },
        {
          name: "eventTime",
          type: "date"
        }
      ],
      timeInfo: {
        startField: "eventTime"
      },
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-marker",
          color: "red",
          size: 12
        }
      }
    });

    // -----------------------------------
    // Map
    // -----------------------------------

    const map = new Map({
      basemap: "streets-navigation-vector",
      layers: [layer]
    });

    // -----------------------------------
    // View
    // -----------------------------------

    const view = new MapView({
      container: mapDiv.current,
      map,
      center: [78.96, 20.59],
      zoom: 5
    });

    // -----------------------------------
    // Time Slider
    // -----------------------------------

    view.when(() => {
      const slider = new TimeSlider({
        view,
        mode: "cumulative-from-start",
        fullTimeExtent: {
          start: new Date(startTimestamp),
          end: new Date(endTimestamp)
        },
        timeExtent: {
          start: null,
          end: new Date(currentTimestamp)
        },
        stops: {
          interval: {
            value: 1,
            unit: "seconds"
          }
        },
        tickConfigs: [
          {
            mode: "position",
            values: timeStops.map((ts) => new Date(ts)),
            labelsVisible: true,
            labelFormatFunction: (value) => {
              const date = new Date(value);
              return formatDateTime(date as Date);
            }
          }
        ],
        labelFormatFunction: (value, type, element) => {
          switch (type) {
            case "min":
            case "max":
              if (element) {
                element.setAttribute("style", "color: orange");
                element.innerText = formatDateTime(value as Date);
              }
              break;
            case "extent":
              if (element) {
                const d = value as Date[];
                element.setAttribute("style", "color: orange");
                element.innerText = `${Date.now()}` + " | " + formatDateTime(d[d.length - 1]);
              }
              break;
            default:
              break;
          }
        }
      });
      if (!slider) return;
      slider.play();
      view.ui.add(slider, "bottom-left");

      reactiveUtils.watch(
        () => view.timeExtent,
        (timeExtent) => {
          console.log("New view time is: ", timeExtent?.start);
        }
      );
    });

    return () => {
      view.destroy();
    };

  }, []);

  return (

    <div
      ref={mapDiv}
      style={{
        width: "100%",
        height: "100vh"
      }}
    />

  );

}
