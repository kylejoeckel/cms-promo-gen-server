export default {
  type: "object",
  properties: {
    storeName: { type: "string" },
    productName: { type: "string" },
    productLink: { type: "string" },
    productType: { type: "string" },
    description: { type: "string" },
  },
  required: [
    "storeName",
    "productName",
    "productType",
    "productLink",
    "description",
  ],
} as const;
