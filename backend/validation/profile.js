const { z } = require("zod");

const profileSchema = z.object({
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  about: z.string().optional(),
  contactNumber: z.string().min(10).max(10).optional(),
});

module.exports = {
    profileSchema
}