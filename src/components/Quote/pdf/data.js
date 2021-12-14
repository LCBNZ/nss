export const invoiceData = {
  id: "5df3180a09ea16dc4b95f910",
  invoice_no: "201906-28",
  balance: "$2,283.74",
  company: "MANTRIX",
  email: "susanafuentes@mantrix.com",
  phone: "+1 (872) 588-3809",
  address: "922 Campus Road, Drytown, Wisconsin, 1986",
  trans_date: "2019-09-12",
  due_date: "2019-10-12",
  items: [
    {
      zone: 1,
      zoneLabel: "Zone 1",
      description: "test description 1",
      type: "Scaffolding",
      qty: 5,
      rate: 405.89,
      duration: 5,
      amount: 899.89,
    },

    {
      zone: 1,
      zoneLabel: "Zone 2",
      description: "test description 2",
      type: "Scaffolding",
      qty: 5,
      rate: 405.89,
      duration: 5,
      amount: 899.89,
    },
    {
      zone: 2,
      zoneLabel: "Zone 3",
      description: "test description 3",
      type: "Scaffolding",
      qty: 5,
      rate: 405.89,
      duration: 5,
      amount: 899.89,
    },
  ],
};

export const zoneData = [
  {
    zone: 1,
    zoneLabel: "Zone 1",
    description: "Upper Left Building",
    type: 3600,
    qty: "$200",
    rate: "$3800",
  },
  {
    zone: 1,
    zoneLabel: "Zone 1",
    description: "Upper Left Building",
    type: 4200,
    qty: "$200",
    rate: "$3800",
  },
  {
    zone: 2,
    zoneLabel: "Zone 2",
    description: "Upper Right Building",
    type: 3600,
    qty: "$200",
    rate: "$4800",
  },
];

export const additionalData = {
  items: [
    {
      description: "Engineering",
      duration: "40",
      charge: "$120",
      weekly: "$45",
      additionalTotal: "$625",
    },
    {
      description: "Engineering 2",
      duration: "40",
      charge: "$120",
      weekly: "$45",
      additionalTotal: "$625",
    },
  ],
};
