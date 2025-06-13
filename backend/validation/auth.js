const zod = require("zod");

const signUpSchema = zod.object({
    firstName: zod.string().min(1),
    lastName: zod.string().min(1),
    email: zod.string().email(),
    password: zod.string().min(1),
    confirmPassword: zod.string().min(1),
    accountType: zod.string().min(1),
    contactNumber: zod.string().min(10).max(10),
    otp: zod.string().min(1),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

const loginSchema = zod.object({
  email: zod.string().email(),
  password: zod.string()
})

module.exports = {
    signUpSchema,
    loginSchema
}