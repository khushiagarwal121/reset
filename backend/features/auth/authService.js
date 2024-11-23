import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; // For password hashing
import crypto from "crypto";
import { validatePassword } from "../../utils/validatePassword.js";
import {
  createUserRole,
  findRoleByName,
  findUserByEmail,
  findUserByEmailOrPhoneNumber,
  createUser,
  createRestaurant,
  createDeliveryPartner,
  saveRefreshToken,
  findUserByEmailRole,
  deleteRefreshToken,
  findUserByResetToken,
  updateUserPasswordAndClearToken,
  savePasswordResetToken,
  findUserByUUID,
  findResetToken,
} from "./authRepository.js";
import ApiError from "../../utils/apiError.js";
import databaseConfig from "../../models/index.js";
import { sendMail } from "../../utils/sendMail.js";

const { sequelize } = databaseConfig.db;

const register = async (registrationDetails) => {
  const transaction = await sequelize.transaction();
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
  } = registrationDetails;

  try {
    // decode and validate the password
    const decodedPassword = decodeURIComponent(atob(password));
    const validPasswordMessage = validatePassword(decodedPassword);

    if (validPasswordMessage !== true)
      throw new ApiError(validPasswordMessage, 400);

    let user = await findUserByEmailOrPhoneNumber(
      email,
      phone_number,
      transaction
    );

    const role = await findRoleByName(role_name, transaction);

    if (user) {
      const roleExists = user.roles.includes(role_name);

      if (roleExists) {
        throw new ApiError(
          "User with given email or phone number already exists",
          400
        );
      } else {
        if (role_name === "restaurant") {
          await createRestaurant(user.uuid, other_details, transaction);
        } else if (role_name === "delivery_partner") {
          await createDeliveryPartner(user.uuid, other_details, transaction);
        }
        await createUserRole(user.uuid, role.uuid, transaction);
        await transaction.commit();
        return {
          message: `You are already registered with us as ${user.roles[0].name}. Use the same set of credentials to login as ${role_name}`,
        };
      }
    } else {
      user = await createUser(
        {
          first_name,
          last_name,
          email,
          password: decodedPassword,
          country_code,
          phone_number,
          date_of_birth,
        },
        transaction
      );
      if (role_name === "restaurant") {
        await createRestaurant(user.uuid, other_details, transaction);
      } else if (role_name === "delivery_partner") {
        await createDeliveryPartner(user.uuid, other_details, transaction);
      }
      await createUserRole(user.uuid, role.uuid, transaction);
      await transaction.commit();
      return {
        message: "You are registered successfully",
      };
    }
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const checkUserExistence = async (email) => {
  const transaction = await sequelize.transaction();
  try {
    const user = await findUserByEmailOrPhoneNumber(email, "", transaction);

    if (user) {
      return user;
    } else {
      throw new ApiError(
        "User with given email does not exist. Register Instead.",
        400
      );
    }
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const loginWithGoogle = async (user, role) => {
  const { email, first_name, last_name } = user;

  role = role.toLowerCase();

  // check if user already exists or not.
  let userDetails = await findUserByEmailRole(email);

  // user with role customer is trying to sign up or log in
  if (!role || role.toLowerCase() === "customer") {
    // get role_uuid for customer role
    const customer_role = await findRoleByName("customer");

    // user already exists, check role and then allow signup
    if (userDetails) {
      const roleExists = userDetails.roles.find(
        (userRole) => userRole.name === "customer"
      );

      let roleNames;
      // if role exists then directly log in
      if (!roleExists) {
        await createUserRole(userDetails.uuid, customer_role.uuid);
        roleNames = ["customer"];
      }
      roleNames =
        roleNames || userDetails.roles.map((userRole) => userRole.name);

      const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(
          userDetails.uuid,
          customer_role.uuid
        );

      return {
        user: {
          first_name: userDetails.first_name,
          last_name: userDetails.last_name,
          email: userDetails.email,
        },
        roleNames,
        accessToken,
        refreshToken,
      };
    } else {
      // create a new user as well as user role and then generate tokens
      const transaction = await sequelize.transaction();
      try {
        // create user
        userDetails = await createUser(
          { email, first_name, last_name },
          transaction
        );

        // assign customer role to user
        await createUserRole(userDetails.uuid, customer_role.uuid, transaction);

        // commit given transaction
        await transaction.commit();

        // login successful
        const { accessToken, refreshToken } =
          await generateAccessAndRefreshTokens(
            userDetails.uuid,
            customer_role.uuid
          );

        return {
          user: {
            first_name: userDetails.first_name,
            last_name: userDetails.last_name,
            email: userDetails.email,
          },
          roleNames: ["customer"],
          accessToken,
          refreshToken,
        };
      } catch (error) {
        await transaction.rollback();
        throw new ApiError("Internal Server Error", 500);
      }
    }
  }
  // try to login user with either delivery partner or restaurant role
  else {
    if (!userDetails) {
      throw new ApiError(
        "User not found. Please sign up to create an account.",
        404
      );
    } else {
      // const userRoles = await findUserRoles(userDetails.uuid);
      let roleNames = userDetails.roles.map((userRole) => userRole.name);

      let roleExists = userDetails.roles.find(
        (userRole) => userRole.name === role
      );

      if (!roleExists) {
        throw new ApiError(
          "User not found. Please sign up to create an account.",
          404
        );
      } else {
        let currentRoleId = userDetails.roles.find(
          (userRole) => userRole.name === role
        ).uuid;
        // generate tokens and login user
        const { accessToken, refreshToken } =
          await generateAccessAndRefreshTokens(userDetails.uuid, currentRoleId);
        return {
          user: {
            first_name: userDetails.first_name,
            last_name: userDetails.last_name,
            email: userDetails.email,
          },
          roleNames,
          accessToken,
          refreshToken,
        };
      }
    }
  }
};

const loginUser = async ({ email, password, role }) => {
  // Decode the password
  password = decodeURIComponent(atob(password));

  // Find the user by email and include associated roles
  const user = await findUserByEmailRole(email);

  // send error in case user not found or role doesn't exist
  if (!user) {
    throw new ApiError("User not found", 404);
  }

  // Extract the role UUIDs from the associated roles
  const roleNames = user.roles.map((role) => role.name);

  if (!roleNames.includes(role)) {
    throw new ApiError(
      `It looks like you're already signed up with us as a ${roleNames[0]}. Please also sign up as a ${role} to proceed.`,
      401
    );
  }

  // Check if user logged in via google and no password exists
  if (!user.password) {
    throw new ApiError(
      "It looks like you signed up with Google. Please log in using the Google option, as no password is set for this account.",
      403
    );
  }

  // Validate password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(
      "Invalid credentials. Please check your email and password and try again",
      401
    );
  }

  const currentRoleId = user.roles.find((roles) => roles.name === role).uuid;

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user.uuid,
    currentRoleId
  );

  return {
    user: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    },
    roleNames,
    accessToken,
    refreshToken,
  };
};

// Function to handle user logout
const logoutUser = async (refreshToken) => {
  // delete refresh token
  await deleteRefreshToken(refreshToken);
};

// Function to generate access token (short-lived)
const generateAccessToken = (userId, currentRoleId) => {
  return jwt.sign(
    {
      // Include both userId and roleIds in the token payload
      userId,
      currentRoleId,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
  );
};

// Function to generate refresh token (long-lived)
const generateRefreshToken = async (userId, currentRoleId) => {
  const refreshToken = jwt.sign(
    {
      // Include both userId and roleIds in the token payload
      userId,
      currentRoleId,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  await saveRefreshToken(userId, refreshToken);
  return refreshToken;
};

// Function to generate both access and refresh tokens
const generateAccessAndRefreshTokens = async (userId, currentRoleId) => {
  const accessToken = generateAccessToken(userId, currentRoleId);
  const refreshToken = await generateRefreshToken(userId, currentRoleId);

  return { accessToken, refreshToken };
};

const forgotPasswordService = async (protocol, email) => {
  const transaction = await sequelize.transaction();
  try {
    const user = await findUserByEmail(email);

    if (user) {
      const passwordResetToken = await createPasswordResetToken(
        user,
        transaction
      );
      // Replace the domain and port according to the frontend
      const resetURL = `${protocol}://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}/reset-password/${passwordResetToken}`;

      const message = `<p>We have received a request to reset your password. Please use the below link to reset your password:</p>
        <p><a href="${resetURL}">Reset Password</a></p>
        <p>This reset password link will expire in 15 minutes.</p>`;

      try {
        await sendMail({
          email: user.email,
          subject: "Password Reset",
          message,
        });
      } catch (error) {
        throw new ApiError(
          "There was an error sending password reset email. Please try again later!",
          503
        );
      }
      await transaction.commit();
      return {
        message: `Password reset link has been sent to ${email}`,
      };
    } else {
      throw new ApiError(
        "User with given email does not exist. Register Instead.",
        400
      );
    }
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
// Function to create a password reset token
const createPasswordResetToken = async (user, transaction) => {
  // Generate a random token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash the token before saving it to the database (for security)
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set an expiration date (e.g., 15 minutes from now)
  const expirationDate = new Date(
    Date.now() + Number(process.env.PASSWORD_RESET_TOKEN_EXPIRY)
  );

  // Save the hashed token and expiration date to the user's record in the database
  await savePasswordResetToken(user, hashedToken, expirationDate, transaction);

  return resetToken;
};

const resetPasswordService = async (token, newPassword) => {
  const transaction = await sequelize.transaction();
  try {
    // Hash the provided reset token to match the stored hashed version
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // decode password
    const decodedPassword = decodeURIComponent(atob(newPassword));
    const validPasswordMessage = validatePassword(decodedPassword);

    if (validPasswordMessage !== true)
      throw new ApiError(validPasswordMessage, 400);

    // Find the user by reset token and check if the token has not expired
    const user = await findUserByResetToken(hashedToken, transaction);

    // If no user is found, either the token is invalid or expired
    if (!user) {
      throw new ApiError("Invalid or expired password reset token.", 400);
    }

    // Check if the new password matches the current password
    const isSameAsOldPassword = await bcrypt.compare(
      decodedPassword,
      user.password
    );

    if (isSameAsOldPassword) {
      throw new ApiError(
        "New password must be different from the previous password.",
        400
      );
    }

    // Update user's password and clear reset token fields
    await updateUserPasswordAndClearToken(user, decodedPassword, transaction);

    // Commit the transaction after successful password reset
    await transaction.commit();
    return {
      message: "Password has been successfully reset.",
    };
  } catch (error) {
    // Rollback transaction in case of error
    await transaction.rollback();
    throw error;
  }
};
const validateResetTokenService = async (token) => {
  // Hash the provided reset token to match the stored hashed version
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  // Fetch token details from the database
  const tokenDetails = await findResetToken(hashedToken);

  if (!tokenDetails) {
    throw new ApiError("Invalid token.", 400);
  }

  // Check if token is expired
  if (new Date() > new Date(tokenDetails.password_reset_token_expiry)) {
    throw new ApiError("Password reset token expired", 400);
  }

  return {
    tokenValid: true,
  };
};

const getUserProfile = async (user_uuid, current_role_uuid) => {
  const user = await findUserByUUID(user_uuid);

  const current_role_name = user.roles.find(
    (role) => role.uuid === current_role_uuid
  ).name;
  return { user, current_role_name };
};

export {
  register,
  checkUserExistence,
  loginUser,
  logoutUser,
  loginWithGoogle,
  generateAccessToken,
  generateAccessAndRefreshTokens,
  forgotPasswordService,
  resetPasswordService,
  getUserProfile,
  validateResetTokenService,
};
