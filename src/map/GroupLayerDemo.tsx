import React, { useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import LayerList from "@arcgis/core/widgets/LayerList";
import Slider from "@arcgis/core/widgets/Slider";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";

import "@arcgis/core/assets/esri/themes/light/main.css";

const GroupLayerDemo: React.FC = () => {
  const mapDiv = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapDiv.current) return;

    // Create MapImageLayers
    const USALayer = new MapImageLayer({
      url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
      title: "US Sample Data",
    });

    const censusLayer = new MapImageLayer({
      url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer",
      title: "US Sample Census",
      visible: false,
    });

    // Group Layer
    const demographicGroupLayer = new GroupLayer({
      title: "US Demographics",
      visible: true,
      visibilityMode: "exclusive",
      layers: [USALayer, censusLayer],
      opacity: 0.75,
    });

    // Create Map
    const map = new Map({
      basemap: "gray-vector",
      layers: [demographicGroupLayer],
    });

    // Create MapView
    const view = new MapView({
      container: mapDiv.current,
      map,
      center: [-98.5795, 39.8282],
      zoom: 4,
    });

    // Define LayerList actions
    const defineActions = async (event: any) => {
      const { item } = event;

      await item.layer.when();

      if (item.title === "US Demographics") {
        item.actionsSections = [
          [
            {
              title: "Go to full extent",
              icon: "zoom-out-fixed",
              id: "full-extent",
            },
            {
              title: "Layer information",
              icon: "information",
              id: "information",
            },
          ],
          [
            {
              title: "Increase opacity",
              icon: "chevron-up",
              id: "increase-opacity",
            },
            {
              title: "Decrease opacity",
              icon: "chevron-down",
              id: "decrease-opacity",
            },
          ],
        ];
      }

      // Add opacity slider for child layers
      if (item.children.length > 1 && item.parent) {
        const slider = new Slider({
          min: 0,
          max: 1,
          precision: 2,
          values: [1],
          visibleElements: {
            labels: true,
            rangeLabels: true,
          },
        });

        item.panel = {
          content: slider,
          icon: "sliders-horizontal",
          title: "Change layer opacity",
        };

        reactiveUtils.watch(
          () => slider.values.map((value) => value),
          (values) => {
            item.layer.opacity = values[0];
          }
        );
      }
    };

    view.when(() => {
      const layerList = new LayerList({
        view,
        listItemCreatedFunction: defineActions,
      });

      layerList.on("trigger-action", (event: any) => {
        const visibleLayer = USALayer.visible ? USALayer : censusLayer;
        const id = event.action.id;

        if (id === "full-extent") {
          view.goTo(visibleLayer.fullExtent).catch((error) => {
            if (error.name !== "AbortError") {
              console.error(error);
            }
          });
        } else if (id === "information") {
          window.open(visibleLayer.url);
        } else if (id === "increase-opacity") {
          if (demographicGroupLayer.opacity < 1) {
            demographicGroupLayer.opacity += 0.25;
          }
        } else if (id === "decrease-opacity") {
          if (demographicGroupLayer.opacity > 0) {
            demographicGroupLayer.opacity -= 0.25;
          }
        }
      });

      view.ui.add(layerList, "top-right");
    });

    // Cleanup on unmount
    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={mapDiv}
      style={{ height: "100vh", width: "100%" }}
    />
  );
};

export default GroupLayerDemo;
