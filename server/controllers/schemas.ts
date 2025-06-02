const registerBodySchema = {
  type: "object",
  properties: {
    id: { type: "integer", nullable: true },
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string", format: "email" },
    password: { type: "string", format: "password" },
    role: { type: "string" },
    status: { type: "string" },
  },
  required: ["firstName", "lastName", "email", "password", "role", "status"],
}

export { registerBodySchema };