const zod = require("zod");

const categorySchema = zod.object({
    name: zod.string().min(1),
    description: zod.string().min(1),
});

module.exports = {
   categorySchema
}