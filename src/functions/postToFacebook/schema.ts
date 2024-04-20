export default {
  type: "object",
  properties: {
    promoImage: {
      type: "string",
    },
    promoText: { type: "string" },
  },
  required: ["promoText"],
} as const;
