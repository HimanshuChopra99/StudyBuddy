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
    const categorydetails = Category.findOne(
      {},
      { name: true, description: true }
    );
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
