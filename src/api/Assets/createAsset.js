import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import supabase from "../supabase";

import { useNotificationStore } from "../../store/notifications";

async function createAsset(asset) {
  const { data, error } = await supabase.from("assets").insert(asset);

  if (error) {
    throw new Error(error.messge);
  }

  await createAppenateAsset(data);

  return data;
}

export function useCreateAsset() {
  const { addNotification } = useNotificationStore();

  const queryClient = useQueryClient();

  return useMutation((asset) => createAsset(asset), {
    onSuccess: () => {
      queryClient.refetchQueries("assets");

      addNotification({
        isSuccess: true,
        heading: "Success!",
        content: `Successfully created asset.`,
      });
    },
    onError: (err) => {
      addNotification({
        isSuccess: false,
        heading: "Failed creating asset",
        content: err?.message,
      });
    },
    mutationFn: createAsset,
  });
}

async function createAppenateAsset(assets) {
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
