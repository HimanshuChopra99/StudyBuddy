const z = require("zod");

const courseSchema = z.object({
  courseName: z.string().min(1),
  courseDescription: z.string().min(1),
  price: z.string(),
  whatYouWillLearn: z.string(),
  tag: z.string().min(1),
  whatYouWillLearn: z.string(),
  category: z.string()
});

module.exports = {
    courseSchema
}
