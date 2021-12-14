import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import supabase from "../supabase";

import { useNotificationStore } from "../../store/notifications";

export async function updateVehicle({ vehicle, vehicleId }) {
  const { data, error } = await supabase.from("vehicles").update(vehicle).match({ id: vehicleId });

  if (error) {
    throw new Error(error.message);
  }

  await updateAppenateVehicles(data);

  return data;
}

export const useUpdateVehicle = () => {
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();

  return useMutation((vehicle) => updateVehicle(vehicle), {
    onSuccess: (data) => {
      queryClient.refetchQueries("vehicles");

      addNotification({
        isSuccess: true,
        heading: "Success!",
        content: `Successfully updated vehicle.`,
      });
    },

    onError: (err) => {
      addNotification({
        isSuccess: false,
        heading: "Failed updating vehicle",
        content: err?.message,
      });
    },
    mutationFn: updateVehicle,
  });
};

async function updateAppenateVehicles(data) {
  const vehiclePayload = [];

  data.map((vehicle) =>
    vehiclePayload.push([
      vehicle.id, // id
      vehicle.rego || "", // rego
      vehicle.make || "", // make
      vehicle.model || "", // model
      vehicle.heavy_truck || "", // heavy truck
      vehicle.rego_due || "", // rego due
      vehicle.wof_due || "", // wof due
      vehicle.odometer || "", // odo
      vehicle.hubo || "", // hubo
      vehicle.ruc || "", // ruc
      vehicle.service_due_date || "", // service due date
      vehicle.service_due || "", // service due
      vehicle.status || "", // status
    ]),
  );
  return axios.post("https://scaff-m8-server.herokuapp.com/api/data-sync", {
    id: "53fa1451-1e84-4850-a8d7-ade30150d7ff",
    data: vehiclePayload,
  });
}
