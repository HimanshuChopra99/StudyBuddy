const { z } = require("zod");

const contactSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
  phoneNumber: z.string().min(1, "Phone Number is required"),
});

module.exports = contactSchema;