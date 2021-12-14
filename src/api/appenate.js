export default function createOrUpdateRecords(tableId, rows) {
  const URL = "https://secure-au.appenate.com:443/api/v2/datasource";
  const data = {
    Id: tableId,
    IntegrationKey: "edf9539371ca48efb45baa270db4ca75",
    NewRows: rows,
    CompanyId: 61737,
  };
  return new Promise((resolve, reject) => {
    fetch(URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((resp) => {
        if (resp.ok) {
          resolve(resp.json());
        }
      })
      .catch((error) => {
        reject(error);
      });
  }).catch((error) => {

  });
}
