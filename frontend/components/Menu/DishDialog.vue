<template>
  <v-dialog v-model="props.show" max-width="600px">
    <v-card class="rounded-lg">
      <v-card-title class="pa-4 text-white">
        <span class="text-h6" v-if="props.dishProp">Edit Dish</span>
        <span class="text-h6" v-else>Add Dish</span>
      </v-card-title>

      <v-card-text class="mt-4">
        <!-- Dish Name -->
        <v-text-field
          v-model="dish.name"
          label="Dish Name"
          variant="outlined"
          :rules="dishNameRules"
        />

        <!-- Dish Description -->
        <v-text-field
          v-model="dish.details"
          label="Description"
          variant="outlined"
          class="mt-2"
          :rules="dishDetailsRules"
        />

        <!-- Dish Image -->
        <v-file-input
          v-model="dish.image"
          label="Upload Dish Image"
          variant="outlined"
          class="mt-2"
          accept="image/*"
          :rules="imageRules"
          prepend-icon=""
          v-if="!props.dishProp"
        />

        <!-- Is Veg and Is Jain -->
        <v-row>
          <v-col class="pb-0">
            <v-checkbox
              color="#E53935"
              v-model="dish.is_veg"
              label="Is pure veg?"
              class="text-black"
            />
          </v-col>
          <v-col class="pb-0">
            <v-checkbox
              color="#E53935"
              v-model="dish.is_jain"
              label="Is jain available?"
              class="text-black"
            />
          </v-col>
        </v-row>

        <!-- Variants Section -->
        <v-card class="mt-1 pa-3">
          <div class="d-flex justify-space-between align-center">
            <span class="text-h6">Variants</span>
            <v-btn icon color="primary" size="small" @click="addVariant">
              <v-icon size="large">mdi-plus</v-icon>
            </v-btn>
          </div>
          <v-divider class="mt-2 mb-4" />
          <v-row v-for="(variant, index) in dish.variants" :key="index">
            <!-- Checkbox for Default Variant -->
            <v-col cols="1" class="pb-1 pr-0">
              <v-tooltip
                location="bottom"
                text="This variant would appear by default when dish is selected"
              >
                <template #activator="{ props }">
                  <v-checkbox
                    v-model="variant.is_default"
                    :input-value="variant.is_default"
                    hide-details
                    color="green"
                    @change="markDefault(index)"
                    v-bind="props"
                  />
                </template>
              </v-tooltip>
            </v-col>

            <!-- Name Field -->
            <v-col class="pb-1 pr-0 mb-2">
              <v-text-field
                v-model="variant.name"
                label="Name"
                type="text"
                variant="outlined"
                hint="2 pcs, 250 gm, 7 inch, regular etc."
                :rules="variantNameRules"
                :persistent-hint="true"
              />
            </v-col>

            <!-- Price Field -->
            <v-col class="pb-1 pr-1">
              <v-text-field
                v-model="variant.price"
                label="Price (INR)"
                type="text"
                variant="outlined"
                @input="(event) => variantPriceInput(event, index)"
                :rules="priceRules"
              />
            </v-col>

            <!-- Availability Switch -->
            <v-col class="d-flex align-start justify-center mb-4">
              <v-switch
                v-model="variant.is_available"
                hide-details
                color="green"
                track-color="red"
                :ripple="false"
              />
              <!-- Text Widget showing Available/Unavailable -->
              <v-chip v-if="variant.is_available" color="green" class="mt-3"
                >Available</v-chip
              >
              <v-chip v-else color="red" class="mt-3">Unavailable</v-chip>
            </v-col>

            <!-- Delete Button -->
            <v-col
              v-if="dish.variants.length > 1"
              cols="1"
              class="px-0 mr-2 mb-4 d-flex justify-center align-center"
            >
              <v-btn
                icon
                color="red"
                size="small"
                class="mb-4"
                @click="removeVariant(index)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-card-text>

      <v-card-actions class="px-4">
        <v-btn color="primary" :disabled="disable" @click="saveDish"
          >Save</v-btn
        >
        <v-btn color="red" @click="closeDialog">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import requiredValidation from "../../utils/requiredVaidation";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  dishProp: {
    type: Object,
  },
});

const emits = defineEmits(["updateShow", "saveDish"]);

// Dish Details
const dish = ref(
  props.dishProp
    ? JSON.parse(JSON.stringify(props.dishProp))
    : {
        name: null,
        details: null,
        image: null,
        is_veg: false,
        is_jain: false,
        is_available: true,
        variants: [
          { name: null, price: null, is_default: true, is_available: true },
        ],
      }
);

watch(
  () => props.dishProp,
  (newDish) => {
    dish.value = newDish
      ? JSON.parse(JSON.stringify(newDish))
      : {
          name: null,
          details: null,
          image: null,
          is_veg: false,
          is_jain: false,
          is_available: true,
          variants: [
            { name: null, price: null, is_default: true, is_available: true },
          ],
        };
  },
  { immediate: true } // Sync immediately on component load
);

const dishNameRegex =
  /^(?:(\d+[A-Za-z]+(?:[ -][A-Za-z0-9]+)*))|([A-Za-z]+(?:[ -][A-Za-z0-9]+)*)$/;
const detailsRegex = /^[\s\S]*$/;
const priceRegex = /^[1-9]\d*(\.\d{1,2})?$/;

const dishNameRules = [
  requiredValidation("Dish Name"),
  (value) => {
    if (value.trim().length > 0) {
      return dishNameRegex.test(value.trim())
        ? true
        : "Dish name can contain alphabets, numbers, and a hyphen between words only.";
    }
  },
];

const variantNameRules = [requiredValidation("Variant Name")];

const priceRules = [
  requiredValidation("Price"),
  (value) => priceRegex.test(value) || "Price must be a positive number",
];

const dishDetailsRules = [
  (value) => {
    if (value && value.length > 0 && value.trim().length == 0)
      return "Please enter a valid description for the dish";
    if (value && value.trim().length > 0) {
      return detailsRegex.test(value.trim())
        ? true
        : "Description can contain alphabets, numbers, and a hyphen between words only.";
    }
  },
];

const imageRules = [
  (value) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (value && value[0] && !allowedTypes.includes(value[0].type))
      return "Only JPEG, PNG, or JPG images are allowed.";
    if (value && value[0] && value[0].size > 2 * 1024 * 1024)
      return "Image size must be less than 2MB";
    return true;
  },
];

const disable = computed(() => {
  if (!validateDishName(dish.value.name)) return true;
  if (
    dish.value.details &&
    dish.value.details.length > 0 &&
    !detailsRegex.test(dish.value.details.trim())
  )
    return true;
  if (!props.dishProp && dish.value.image && !validateFile(dish.value.image))
    return true;
  if (!validateVariants(dish.value.variants)) return true;
  return false;
});

const addVariant = () => {
  dish.value.variants.push({
    name: null,
    price: null,
    is_default: false,
    is_available: true,
  });
  if (dish.value.variants.length == 1) dish.value.variants[0].is_default = true;
};

const removeVariant = (index) => {
  const is_default = dish.value.variants[index].is_default;
  dish.value.variants.splice(index, 1);
  if (is_default) dish.value.variants[0].is_default = true;
};

const closeDialog = () => {
  if (!props.dishProp)
    dish.value = {
      name: null,
      details: null,
      image: null,
      is_veg: false,
      is_jain: false,
      is_available: true,
      variants: [
        { name: null, price: null, is_default: true, is_available: true },
      ],
    };
  else dish.value = JSON.parse(JSON.stringify(props.dishProp));
  emits("updateShow");
};

const saveDish = () => {
  dish.value.name = dish.value.name.trim();
  if (dish.value.details) dish.value.details = dish.value.details.trim();
  const dishData = { ...dish.value };
  dish.value = {
    name: null,
    details: null,
    image: null,
    is_veg: false,
    is_jain: false,
    is_available: true,
    variants: [
      { name: null, price: null, is_default: true, is_available: true },
    ],
  };
  closeDialog();
  emits("saveDish", dishData);
};

const variantPriceInput = (event, index) => {
  const value = event.target.value;

  const sanitizedValue = value.replace(/[^0-9.]/g, "");
  const cleanedValue = sanitizedValue.replace(/(\..*?)\..*/g, "$1");
  let finalValue = cleanedValue;

  if (cleanedValue !== "" && Number(cleanedValue) < 1) finalValue = "1";

  dish.value.variants[index].price = cleanedValue !== "" ? finalValue : null;
  event.target.value = finalValue;
};

const validateDishName = (name) => {
  if (!name || !name.trim()) return false;
  if (!dishNameRegex.test(name.trim())) return false;
  return true;
};

const validateNumber = (price) => {
  if (!price) return false;
  if (!priceRegex.test(price)) return false;
  return true;
};

const validateFile = (file) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  const maxSize = 2 * 1024 * 1024; // 2 MB
  if (!file) return true;
  if (!allowedTypes.includes(file.type) || file.size > maxSize) return false;
  return true;
};

const validateVariantName = (name) => {
  if (!name || !name.trim()) return false;
  return true;
};

const validateVariants = (variants) => {
  if (!variants.length) return false;
  let def = false;
  for (const { name, price, is_default } of variants) {
    if (!validateVariantName(name)) return false;
    if (!validateNumber(price)) return false;
    def = def || is_default;
  }
  return true && def;
};

const markDefault = (index) => {
  // Looping through the variants to ensure only one variant is marked as default
  dish.value.variants.forEach(
    (variant, i) => (variant.is_default = i === index)
  );
};
</script>

<style scoped>
.v-card-text {
  padding: 0.4rem 1rem 0px !important;
}
.v-card-title {
  background-color: #e53935 !important;
}
.v-btn--slim {
  padding: 0 0 !important;
}
:deep(.v-input__details) {
  padding-bottom: 0.1rem !important;
  padding-inline: 0rem !important;
}
</style>
