const { z } = require("zod");

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  age: z.number().int().positive().optional(),
  role: z.enum(["admin", "user", "guest"]),
});

module.exports = { userSchema };
