const Tag = require("../models/Tag");
const { tagsSchema } = require("../validation/tags");

//craete tags
exports.createTags = async (req, res) => {
    try {
        const body = req.body;

        //validation
        const parsedBody = tagsSchema.safeParse(body);
        if(!parsedBody.success) {
            return res.status(400).json({
                success: false,
                msg: "Tags data is required or validation failed",
                errors: parsedBody.error.errors
            });
        }

        const {name, description} = parsedBody.data;

        //save in db
        const tagsdetails = await Tag.create({
            name,
            description
        });
        console.log(tagsdetails);

        return res.status(201).json({
            success: true,
            msg: "Tag created successfully"
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Failed to create tags"
        });
    }
}

//get all tags
exports.getAllTags = async (req, res) => {
    try {
        const allTags = Tag.findOne({}, {name: true, description: true})
        return res.status(200).json({
            success: true,
            msg: "All tags fetch successfully",
            data: allTags
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Failed to get tags"
        })
    }
}