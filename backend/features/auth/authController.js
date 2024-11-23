import {
  register,
  checkUserExistence,
  loginWithGoogle,
  loginUser,
  logoutUser,
  forgotPasswordService,
  resetPasswordService,
  getUserProfile,
  validateResetTokenService,
} from "./authService.js";
import ApiError from "../../utils/apiError.js";
import {
  respondError,
  respondOk,
  respondRedirect,
} from "../../utils/responseHandler.js";
import passport from "../../utils/passport.js";

const googleAuth = async (req, res) => {
  try {
    const { role } = req.body;
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      scope: "profile email",
      prompt: "select_account",
      session: "false",
      response_type: "code",
      ...(role && { state: role }),
    });

    const redirectUri = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    return respondOk(res, { redirect_uri: redirectUri });
    // res.redirect(redirectUri);
  } catch (error) {
    !(error instanceof ApiError) &&
      (error.statusCode = 500) &&
      (error.message =
        "Internal Server Error: Something went wrong, Please try again later");

    return respondError(res, {
      message: error.message,
      statusCode: error.statusCode,
    });
  }
};

const googleAuthCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, (error, user) => {
    try {
      if (error || !user) {
        throw new ApiError(error?.message || "Authentication failed", 401);
      }
      req.user = user;
      next();
    } catch (error) {
      !(error instanceof ApiError) &&
        (error.statusCode = 500) &&
        (error.message =
          "Internal Server Error: Something went wrong, Please try again later");
      return res.redirect(
        `http://localhost:3000?error_message=${encodeURIComponent(
          error.message
        )}`
      );
    }
  })(req, res, next);
};

const googleAuthSuccess = async (req, res) => {
  try {
    const role = req.query?.state;
    const { user, roleNames, accessToken, refreshToken } =
      await loginWithGoogle(req.user, role);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: process.env.ACCESS_TOKEN_EXPIRY_COOKIE,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: process.env.REFRESH_TOKEN_EXPIRY_COOKIE,
    });

    return res.redirect(`http://localhost:3000/`);
  } catch (error) {
    !(error instanceof ApiError) &&
      (error.statusCode = 500) &&
      (error.message =
        "Internal Server Error: Something went wrong, Please try again later");
    return res.redirect(
      `http://localhost:3000?error_message=${encodeURIComponent(error.message)}`
    );
  }
};

const signup = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      country_code,
      phone_number,
      date_of_birth,
      role_name,
      other_details,
    } = req.body;

    const files = req.files;

    const requiredFiles = {
      restaurant: ["fssai_certificate", "gst_certificate"],
      delivery_partner: ["license", "document"],
    };

    // Check if required files are present
    const required = requiredFiles[role_name] || [];
    const missingFiles = required.filter((file) => !files[file]);

    // if some files are absent, then send the error
    if (missingFiles.length > 0) {
      throw new ApiError(
        `Missing required files: ${missingFiles.join(", ")}`,
        400
      );
    }

    // add the files in the object to be added into the database
    if (role_name === "restaurant") {
      other_details.fssai_certificate = files.fssai_certificate[0].filename;
      other_details.gst_certificate = files.gst_certificate[0].filename;
      if (files.images) {
        other_details.images = files.images[0].filename;
      }
    }
    if (role_name === "delivery_partner") {
      if (files.profile_image) {
        other_details.profile_image = files.profile_image[0].filename;
      }
      other_details.license = files.license[0].filename;
      other_details.document = files.document[0].filename;
    }

    const user = await register({
      first_name,
      last_name,
      email,
      password,
      country_code,
      phone_number,
      date_of_birth,
      role_name,
      other_details,
    });

    return respondOk(res, {
      message: user.message,
    });
  } catch (error) {
    !(error instanceof ApiError) &&
      (error.statusCode = 500) &&
      (error.message =
        "Internal Server Error: Something went wrong, Please try again later");

    return respondError(res, {
      message: error.message,
      statusCode: error.statusCode,
    });
  }
};

const checkUser = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await checkUserExistence(email);

    const userDetails = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      roles: user.roles,
    };
    return respondOk(res, {
      user: userDetails,
    });
  } catch (error) {
    !(error instanceof ApiError) &&
      (error.statusCode = 500) &&
      (error.message =
        "Internal Server Error: Something went wrong, Please try again later");
    respondError(res, {
      message: error.message,
      statusCode: error.statusCode,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    // Call loginUser to get user info and role IDs
    const { user, roleNames, accessToken, refreshToken } = await loginUser({
      email,
      password,
      role,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: process.env.ACCESS_TOKEN_EXPIRY_COOKIE,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: process.env.REFRESH_TOKEN_EXPIRY_COOKIE,
    });

    return respondOk(res, {
      message: "Login successful! Welcome back.",
      data: {
        user,
        roleNames,
      },
    });
  } catch (error) {
    !(error instanceof ApiError) &&
      (error.statusCode = 500) &&
      (error.message =
        "Internal Server Error: Something went wrong, Please try again later");
    respondError(res, {
      message: error.message,
      statusCode: error.statusCode,
    });
  }
};

const logout = async (req, res) => {
  try {
    // delete refresh token from database
    await logoutUser(req.cookies.refreshToken);

    // clear cookies
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    return respondOk(res, {
      message: "You have successfully logged out",
    });
  } catch (error) {
    !(error instanceof ApiError) &&
      (error.statusCode = 500) &&
      (error.message =
        "Internal Server Error: Something went wrong, Please try again later");
    respondError(res, {
      message: error.message,
      statusCode: error.statusCode,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await forgotPasswordService(req.protocol, email);

    return respondOk(res, result);
  } catch (error) {
    !(error instanceof ApiError) &&
      (error.statusCode = 500) &&
      (error.message =
        "Internal Server Error: Something went wrong, Please try again later");
    respondError(res, {
      message: error.message,
      statusCode: error.statusCode,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params; // Extract token from URL parameter
    const result = await resetPasswordService(token, password);
    return respondOk(res, result);
  } catch (error) {
    !(error instanceof ApiError) &&
      (error.statusCode = 500) &&
      (error.message =
        "Internal Server Error: Something went wrong, Please try again later");
    respondError(res, {
      message: error.message,
      statusCode: error.statusCode,
    });
  }
};
const userProfile = async (req, res) => {
  try {
    const { user_uuid, current_role_uuid } = req;

    const { user, current_role_name } = await getUserProfile(
      user_uuid,
      current_role_uuid
    );
    return respondOk(res, {
      data: {
        user,
        current_role_name,
      },
    });
  } catch (error) {
    !(error instanceof ApiError) &&
      (error.statusCode = 500) &&
      (error.message =
        "Internal Server Error: Something went wrong, Please try again later");
    respondError(res, {
      message: error.message,
      statusCode: error.statusCode,
    });
  }
};

const validateResetToken = async (req, res) => {
  try {
    const { token } = req.params; // Extract token from the URL
    const result = await validateResetTokenService(token);

    return respondOk(res, result);
  } catch (error) {
    !(error instanceof ApiError) &&
      (error.statusCode = 500) &&
      (error.message =
        "Internal Server Error: Something went wrong, Please try again later");

    respondError(res, {
      message: error.message,
      statusCode: error.statusCode,
    });
  }
};

export {
  googleAuth,
  googleAuthCallback,
  googleAuthSuccess,
  signup,
  checkUser,
  login,
  logout,
  forgotPassword,
  resetPassword,
  userProfile,
  validateResetToken,
};
