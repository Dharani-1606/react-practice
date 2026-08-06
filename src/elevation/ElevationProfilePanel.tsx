import { useEffect, useRef } from "react";
import "@arcgis/map-components/components/arcgis-elevation-profile";
import ElevationLayer from "@arcgis/core/layers/ElevationLayer";
import ElevationProfileLineQuery from "@arcgis/core/analysis/ElevationProfile/ElevationProfileLineQuery";
import type Multipoint from "@arcgis/core/geometry/Multipoint";
import type Point from "@arcgis/core/geometry/Point";

export default function ElevationProfilePanel({
  view,
  geometry
}) {

  const profileRef = useRef(null);

  useEffect(() => {
    let elevationLayer = new ElevationLayer({
      url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
    });

    if (!view || !profileRef.current) return;

    // console.log("log profileRef :>>", profileRef.current);
    // profileRef.current.view = view;
    // profileRef.current.input = geometry;

    const profile = profileRef.current;

    // Connect the SceneView/MapView
    profile.view = view;
    profile.unit = "meters";
    profile.profiles = [
      {
        type: "query",
        source: elevationLayer,
        color: "#ff9900",
        title: "Aerial Survey"
      },
      new ElevationProfileLineQuery({
          title: "Antenna Line",
          color: "#ff4fff",
          source: {
            queryElevation: async (
              geometry: Multipoint | Point,
              options?: { signal?: AbortSignal }
            ): Promise<any> => {
              const result = await elevationLayer.queryElevation(
                geometry,
                options
              );

              return {
                geometry: result.geometry,
                noDataValue: result.noDataValue
              };
            }
          }
        })
    ];
    profile.visibleElements = {
      selectButton: false
    };
  }, [view, geometry]);

  return (
    <>
      <arcgis-elevation-profile
        ref={profileRef}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: "420px",
          padding: "1rem",
          background: "white"
        }}
      />
    </>
  );

}