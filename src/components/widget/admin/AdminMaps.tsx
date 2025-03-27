import { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";

const AdminMaps = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new Map({
      target: mapRef.current,
      layers: [
        // **Carto Voyager No Labels (Putih, tanpa area kuning)**
        new TileLayer({
          source: new XYZ({
            url: "https://{a-d}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
            attributions: '&copy; <a href="https://carto.com/">CARTO</a>',
          }),
        }),
        // // **OSM Labels (Agar tetap ada nama jalan)**
        // new TileLayer({
        //   source: new XYZ({
        //     url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        //     attributions: "&copy; OpenStreetMap contributors",
        //   }),
        // }),
      ],
      view: new View({
        center: fromLonLat([110.416664, -6.966667]), // Semarang (EPSG:3857)
        zoom: 15,
        maxZoom: 25,
      }),
    });

    return () => map.setTarget(undefined);
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
};

export default AdminMaps;
