import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import supabase from "../supabase";

import { useNotificationStore } from "../../store/notifications";

export async function updateAsset({ asset, assetId }) {
  const { data, error } = await supabase.from("assets").update(asset).match({ id: assetId });

  if (error) {
    throw new Error(error.message);
  }
  await updateAppenateAsset(data);

  return data;
}

export const useUpdateAsset = () => {
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();

  return useMutation((asset) => updateAsset(asset), {
    onSuccess: (data) => {
      queryClient.refetchQueries("assets");

      addNotification({
        isSuccess: true,
        heading: "Success!",
        content: `Successfully updated asset.`,
      });
    },

    onError: (err) => {
      addNotification({
        isSuccess: false,
        heading: "Failed updating asset",
        content: err?.message,
      });
    },
    mutationFn: updateAsset,
  });
};

async function updateAppenateAsset(assets) {
  const assetPayload = [];

  assets.map((asset) =>
    assetPayload.push([
      asset.id,
      asset.manufacture_num || "", // Manufacturers Number
      asset.item_code || "", // Item code
      asset.asset_type || "", // type
      asset.last_inspected || "", // last inspection
      asset.next_inspection || "", // next inspection
      "", // Display next inspection
      asset.asset_expiry || "", // Asset Expiry
      asset.assigned_to || "", // Staff Name
      "", // display type #
      "", // vehicle name
      "", // concat assigned
      asset.comments || "", // comments
      asset.make_type || "", // make / type
      asset.manufacture_date || "", // manufacture date
      "", // Staff
      "", // Vehicle Id
      asset.status || "", // Status
    ]),
  );

  return axios.post("https://scaff-m8-server.herokuapp.com/api/data-sync", {
    id: "fe4f1392-8821-464c-bde8-ade9003e8010",
    data: assetPayload,
  });
}
