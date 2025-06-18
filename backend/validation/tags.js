const zod = require("zod");

const tagsSchema = zod.object({
    name: zod.string().min(1),
    description: zod.string().min(1),
});

module.exports = {
    tagsSchema
}