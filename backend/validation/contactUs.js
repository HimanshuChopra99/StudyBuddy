const { zod } = require("zod");

const contactSchema = z.object({
  firstName: zod.string().min(1, "First Name is required"),
  lastName: zod.string().min(1, "Last Name is required"),
  mail: zod.string().email("Invalid email address"),
  message: zod.string().min(1, "Message is required"),
  phoneNo: zod.number().min(1, "Phone Number is required"),
});

module.exports = contactSchema;