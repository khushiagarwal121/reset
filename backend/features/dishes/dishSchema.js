import Joi from "joi";

// Variant Schema
const variantSchema = Joi.object({
  uuid: Joi.optional(),
  name: Joi.string().required().messages({
    "string.base": "Variant name must be a string.",
    "any.required": "Variant name is required.",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number.",
    "number.positive": "Price must be a positive number.",
    "any.required": "Price is required.",
  }),
  is_default: Joi.boolean().required().messages({
    "boolean.base": "is_default must be a boolean.",
    "any.required": "is_default is required.",
  }),
  is_available: Joi.boolean().required().messages({
    "boolean.base": "is_available must be a boolean.",
    "any.required": "is_available is required.",
  }),
});

// Combined Dish Schema
const updateDishSchema = Joi.object({
  dish: Joi.object({
    name: Joi.string().trim().required().messages({
      "string.base": "Name must be a string.",
      "any.required": "Name is required.",
    }),
    category_uuid: Joi.string().required().messages({
      "string.base": "Category must be a string.",
      "any.required": "Category is required.",
    }),
    is_veg: Joi.boolean().required().messages({
      "boolean.base": "is_veg must be a boolean.",
      "any.required": "is_veg is required.",
    }),
    is_jain: Joi.boolean().required().messages({
      "boolean.base": "is_jain must be a boolean.",
      "any.required": "is_jain is required.",
    }),
    details: Joi.optional(),
    image: Joi.optional(),
    variants: Joi.array()
      .items(variantSchema)
      .min(1)
      .required()
      .custom((value, helpers) => {
        // Check if exactly one variant has is_default: true
        const defaultVariants = value.filter(
          (variant) => variant.is_default === true
        );
        if (defaultVariants.length !== 1) {
          return helpers.error("any.invalid", {
            message: "Exactly one variant must have is_default: true.",
          });
        }
        return value; // Return the value if valid
      })
      .messages({
        "array.base": "Variants must be an array.",
        "array.min": "At least one variant is required.",
        "any.required": "Variants are required.",
      }),
  }),
});

// Define the schema for an array of dishes
const dishSchema = Joi.object({
  dish: Joi.object({
    name: Joi.string().trim().max(50).required().messages({
      "string.base": "Name must be a string.",
      "string.length": "Name must be less than 50 characters.",
      "any.required": "Name is required.",
    }),
    category_uuid: Joi.required().messages({
      "any.required": "category_uuid is required.",
    }),
    is_veg: Joi.boolean().required().messages({
      "boolean.base": "is_veg must be a boolean.",
      "any.required": "is_veg is required.",
    }),
    details: Joi.string().optional(),
    avg_rating: Joi.number(),
    is_available: Joi.boolean().required().messages({
      "boolean.base": "is_available must be a boolean.",
      "any.required": "is_available is required.",
    }),
    is_jain: Joi.boolean().required().messages({
      "boolean.base": "is_jain must be a boolean.",
      "any.required": "is_jain is required.",
    }),
    variants: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required().messages({
            "string.base": "Variant name must be a string.",
            "any.required": "Variant name is required.",
          }),
          price: Joi.number().required().messages({
            "number.base": "Price  must be a decimal number.",
            "any.required": "Price is required.",
          }),
          is_default: Joi.boolean().required().messages({
            "boolean.base": "is_default must be a boolean.",
            "any.required": "is_default is required.",
          }),
          is_available: Joi.boolean().required().messages({
            "boolean.base": "is_available must be a boolean.",
            "any.required": "is_available is required.",
          }),
        })
      )
      .custom((value, helpers) => {
        // Check if exactly one variant has is_default: true
        const defaultVariants = value.filter(
          (variant) => variant.is_default === true
        );
        if (defaultVariants.length !== 1) {
          return helpers.error("any.custom", {
            message: "Exactly one variant must have is_default: true",
          });
        }
        return value; // Return the value if valid
      }),
  }),
});

export { updateDishSchema, dishSchema };
