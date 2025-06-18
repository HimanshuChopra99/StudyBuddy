const zod = require("zod");

const courseSchema = zod.object({
  courseName: zod.string().min(1),
  courseDescription: zod.string().min(1),
  price: z.number().positive(),
  whatYouWillLearn: zod.string(),
  tag: zod.string().min(1),
});

module.exports = {
    courseSchema
}
