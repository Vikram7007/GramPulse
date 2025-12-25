import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

function MapPicker({ location, setLocation }) {
  const handleClick = (e) => {
    setLocation({
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    });
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyDfKCZ1s72Mz5flXTVi0aiRq6jb-x2zyI4">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={18}  // जास्त zoom – गाव clear दिसेल
        center={location}
        onClick={handleClick}
        mapTypeId="hybrid"  // <--- हे add केलं! satellite photo + road labels
      >
        <Marker position={location} />
      </GoogleMap>
    </LoadScript>
  );
}

export default MapPicker;