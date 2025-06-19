const { z } = require("zod");

const profileSchema = z.object({
  gender: z.string(),
  dateOfBirth: z.string(),
  about: z.string(),
  contactNumber: z.number()
});

module.exports = {
    profileSchema
}