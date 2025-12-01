import {MapContainer, TileLayer, Marker, Popup, useMapEvents} from 'react-leaflet';
import {useState} from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issues in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12,41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function MapClickHandler({onMapClick}) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        }
    });
    return null;
}

function PinMap() {
    const [pins, setPins] = useState([]);
    const [center] = useState([51.505, -0.09]);

    const handleMapClick = (latlng) => {

        const newPin = {
            id: Date.now(),
            lat: latlng.lat,
            lng: latlng.lng,
            title: "new place"
        };
        
        setPins([...pins, newPin]);
    }
    return (
        <div style={{height: "100vh", width: "100%"}}>
            <MapContainer
                center={center}
                zoom={13}
                style={{height: "100%", width: "100%"}}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onMapClick={handleMapClick} />
                {pins.map((pin) => (
                    <Marker key={pin.id} position={[pin.lat, pin.lng]}>
                        <Popup>
                            {pin.title}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}

export default PinMap;