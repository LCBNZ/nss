import React, { useEffect, useState } from "react";
import { CursorClickIcon } from "@heroicons/react/solid";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css"
import { Link, useParams, useLocation, useHistory } from "react-router-dom";
import { VehiclesApi } from "../../api";
import { TwoColumnDetails, Section } from "../../common/Details";
import { Spinner, Tabs } from "../../common";
import { FileList } from "../../components/Files";
import { AppFileList } from "../../components/AppFiles";

export const VehicleDetails = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const { vehicleId } = useParams(0);
  const location = useLocation();
  const history = useHistory();

  const vehicleQuery = VehiclesApi.useFetchVehicle(vehicleId);

  const vehicleIconMap = new Icon({
    iconUrl:'/marker.svg',
    iconSize:[40,40]
  })

  const items = [
    { label: "Admin Files", id: 0 },
    { label: "App Files", id: 1 },
  ];
  if (vehicleQuery.isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!vehicleQuery.data) return null;

  const editPage = {
    pathname: `/vehicles/${vehicleId}/editVehicle`,
    state: { background: location, name: "editVehicle" },
  };

  return (
    <div className="w-full mx-auto mt-8 mb-28">
      <TwoColumnDetails heading="Vehicle Details" editBtn="Edit Vehicle" editLink={editPage}>
        <Section title="Vehicle Rego" content={`#${vehicleQuery?.data?.rego || ""}`} />
        <Section title="Code Name" content={vehicleQuery?.data?.code || ""} />
        <Section title="Make" content={vehicleQuery?.data?.make || ""} />
        <Section title="Model" content={vehicleQuery?.data?.model || ""} />
        <Section title="Rego Due" content={vehicleQuery?.data?.rego_due || ""} />
        <Section title="WOF Due" content={vehicleQuery?.data?.wof_due || ""} />
        <Section title="Service Due Date" content={vehicleQuery?.data?.service_due_date || ""} />
        <Section title="Service Due (Km)" content={vehicleQuery?.data?.service_due || ""} />
        <Section title="Odometer" content={vehicleQuery?.data?.odometer || ""} />
        <Section title="Hubo" content={vehicleQuery?.data?.hubo || ""} />
        <Section title="Road User Charges" content={vehicleQuery?.data?.ruc || ""} />
        <Section title="Stanchions" content={vehicleQuery?.data?.number_stanchions || ""} />
        <Section title="Binders" content={vehicleQuery?.data?.number_binders || ""} />
        <Section title="Strops" content={vehicleQuery?.data?.number_strops || ""} />
        <Section title="Heavy Truck" content={vehicleQuery?.data?.heavy_truck || ""} />
        <Section title="Location" content={vehicleQuery?.data?.location.address || ""} />
      </TwoColumnDetails>

      <MapContainer
        style={{ height: "40vh", width: "100%" }}
        center={[vehicleQuery?.data?.location.latitude, vehicleQuery?.data?.location.longitude]}
        zoom="75" >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker icon={vehicleIconMap} position={[vehicleQuery?.data?.location.latitude, vehicleQuery?.data?.location.longitude]}>
          <Popup>
            Vehicle
          </Popup>
        </Marker>

      </MapContainer>


      <div className="px-8">
        <Tabs tabIndex={tabIndex} setTabIndex={setTabIndex} tabs={items} />
      </div>

      {tabIndex === 0 && (
        <div className="mb-8">
          <FileList
            title="Admin Vehicle Files"
            column="vehicle_id"
            type="vehicles"
            id={vehicleId}
          />
        </div>
      )}
      {tabIndex === 1 && (
        <div className="">
          <AppFileList
            title="App Files"
            column="vehicle_id"
            fileType="Vehicle Checklist"
            id={vehicleId}
          />
        </div>
      )}
    </div>
  );
};
