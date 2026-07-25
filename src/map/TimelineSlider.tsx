import { useEffect, useRef, useMemo } from "react";

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import TimeSlider from "@arcgis/core/widgets/TimeSlider";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";

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

  // Current time
  const now = useMemo(() => new Date(), []);

  // Start = Now -10 mins
  const startTime = useMemo(
    () => new Date(now.getTime() - 10 * 60 * 1000),
    [now]
  );

  // End = Now +10 mins
  const endTime = useMemo(
    () => new Date(now.getTime() + 10 * 60 * 1000),
    [now]
  );

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
          start: startTime,
          end: endTime
        },
        timeExtent: {
          start: null,
          end: now
        },
        stops: {
          interval: {
            value: 5,
            unit: "seconds"
          }
        }
      });
      
      setTimeout(() => {
        const minDate = document.querySelector(".esri-time-slider__min-date");
        const maxDate = document.querySelector(".esri-time-slider__max-date");

        if (minDate) {
          minDate.textContent = formatDateTime(startTime);
        }

        if (maxDate) {
          maxDate.textContent = formatDateTime(endTime);
        }
      }, 200);

      view.ui.add(slider, "bottom-left");

      // Synchronize map with slider
      slider.watch("timeExtent", (extent) => {
        view.timeExtent = extent;
      });
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
