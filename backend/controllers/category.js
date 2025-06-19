const Category = require("../models/Category");
const { categorySchema } = require("../validation/category");

//craete category
exports.createCategory = async (req, res) => {
  try {
    const body = req.body;

    //validation
    const parsedBody = categorySchema.safeParse(body);
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        msg: "Category data is required or validation failed",
        errors: parsedBody.error.errors,
      });
    }

    const { name, description } = parsedBody.data;

    //save in db
    const categorydetails = await Category.create({
      name,
      description,
    });
    console.log(categorydetails);

    return res.status(201).json({
      success: true,
      msg: "Category created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Failed to create Category",
    });
  }
};

//get all category
exports.getAllCategory = async (req, res) => {
  try {
    const categorydetails = Category.findOne({}, { name: true, description: true });
    return res.status(200).json({
      success: true,
      msg: "All Category fetch successfully",
      data: categorydetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Failed to get category",
    });
  }
};
