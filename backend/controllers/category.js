const Category = require("../models/Category");
const { categorySchema } = require("../validation/category");
require("dotenv").config();

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

    const existingCategory = await Category.findOne({ name: name });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        msg: "Category with this name already exists",
      });
    }

    //save in db
    const categorydetails = await Category.create({
      name,
      description,
    });

    return res.status(201).json({
      success: true,
      msg: "Category created successfully",
      categorydetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Failed to create Category",
    });
  }
};


//get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const allCategorys = await Category.find({});
    res.status(200).json({
      success: true,
      msg: "All Category fetch successfully",
      data: allCategorys,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Failed to fetch all Category",
      error: error.message,
    });
  }
};

//category page details
exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    // Get courses for the specified category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec();

    //category not found
    if (!selectedCategory) {
      console.log("Category not found.");
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    // Handle the case when there are  no courses
    if (selectedCategory.courses.length === 0) {
      console.log("No courses found for the selected category.");
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      });
    }

    // Get courses for other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    });

    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec();

    // Get top-selling courses across all categories
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: {
          path: "instructor",
        },
      })
      .exec();
    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);
    // console.log("mostSellingCourses COURSE", mostSellingCourses)

    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
