'use client';

import L, { latLng } from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";//for the css
/* This leaflet package is not really supported in react
   so we need to do more work to make it functional.
*/
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
// w



//Now let write a delete function here
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
   /* we import all this png's right here from the leaflet package
      and then assign it to the icon. 
   */
   iconUrl: markerIcon.src,
   iconRetinaUrl: markerIcon2x.src,
   shadowUrl: markerShadow.src
});

//Now let create an interface for this Map
interface MapProps {
   center?: number[]//option of number which can be longitude or latitude
}

const Map: React.FC<MapProps> = ({
   center
}) => {
    return (
        <MapContainer
          /* if we have not selected any country we are just
             going to point to the center of the map using this 
             coordinate(51, -0.09).
         */
          center={center as L.LatLngExpression || [51, -0.09]}
          /* the zoom is also going to depend on the center
            if we have some longitude and latitude we are going
            to zoom in a bit more otherwise we are going to zoom
            out.
         */
          zoom={center ? 4 : 2}
          scrollWheelZoom={false}
          className="h-[35vh] rounded-lg"
        >
          <TileLayer
            //our map is gray cause it is missing the TileLayer
            // We actually don't need the attribution
             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {center && (
            <Marker 
               position={center as L.LatLngExpression}
            />
          )}
        </MapContainer>
     );
}
 
export default Map;