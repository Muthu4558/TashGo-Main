import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies?.token;
    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: "Not authorized. Try login again." });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const resp = await User.findById(decodedToken.userId).select(
      "isAdmin isSuperAdmin email tenantId"
    );
    if (!resp) {
      return res
        .status(401)
        .json({ status: false, message: "Not authorized. Try login again." });
    }

    req.user = {
      userId: decodedToken.userId,
      email: resp.email,
      isAdmin: resp.isAdmin,
      isSuperAdmin: resp.isSuperAdmin,
      tenantId: resp.tenantId,
    };

    next();
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ status: false, message: "Not authorized. Try login again." });
  }
};

const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: "Not authorized as admin. Try login as admin.",
    });
  }
};

export { protectRoute, isAdminRoute };