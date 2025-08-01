const { z } = require("zod");

const subSectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  sectionId: z.string().min(1),
});

module.exports = {
    subSectionSchema
}