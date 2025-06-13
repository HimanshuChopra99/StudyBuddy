const jwt = require("jsonwebtoken");
require("dotenv").config();

//auth
exports.auth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "No token found",
      });
    }

    //verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (decode) {
      req.user = decode;
      next();
    } else {
      return res.status(401).json({
        success: false,
        msg: "Error in verifying jwt token",
      });
    }

  } catch (error) {
    console.error(error);
    return res.status(401).json({
      sucess: false,
      msg: "Something went wrong while validating the jwt token",
    });
  }
};
