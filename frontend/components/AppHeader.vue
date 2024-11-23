<template>
  <div>
    <!-- App bar containing navigation and logo -->
    <v-app-bar>
      <!-- Display the menu icon on small screens if user is logged in -->
      <v-app-bar-nav-icon
        v-if="$vuetify.display.smAndDown && user"
        @click="toggleDrawer"
      >
      </v-app-bar-nav-icon>

      <!-- Tooltip with the food delivery logo linking to home page -->
      <v-tooltip text="Food Delivery">
        <template v-slot:activator="{ props }">
          <nuxt-link to="/">
            <img
              class="logo ml-4 mt-1"
              v-bind="props"
              src="~/assets/food.svg"
              alt="Logo"
              style="width: auto; height: 43px"
            />
          </nuxt-link>
        </template>
      </v-tooltip>

      <v-spacer></v-spacer>

      <!-- Displayed on medium and larger screens for user registration/login -->
      <template v-if="$vuetify.display.mdAndUp">
        <div v-if="!user">
          <a
            v-for="item in items.filter(() => !signed_user)"
            :key="item"
            class="custom-link"
            @click="openSignupDialog(item.role)"
          >
            {{ item.name }}
          </a>

          <!-- Login menu for users to choose their role -->
          <v-menu offset="24" v-model="parentMenu">
            <template v-slot:activator="{ props }">
              <a
                v-bind="props"
                class="custom-link"
                :class="{ active: parentMenu }"
              >
                Login As
              </a>
            </template>

            <!-- List of login options based on roles -->
            <v-list class="pa-0">
              <v-list-item
                v-for="item in items"
                :key="item"
                class="custom-list-item"
                @click="openLoginDialog(item.role)"
              >
                <v-list-item-title class="custom-list-item-title">{{
                  item.value
                }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <!-- User-specific menu displayed when a user is logged in -->
        <div v-else>
          <a
            class="custom-link d-flex align-center"
            :class="{ active: parentMenu }"
            @click="
              outerArrow = parentMenu ? 'mdi-chevron-down' : 'mdi-chevron-up'
            "
            ><v-icon class="mr-1">mdi-account-circle</v-icon>
            {{ user }}
            <v-icon>{{ outerArrow }}</v-icon>
          </a>

          <!-- Menu for user profile, settings, and role switching -->
          <v-menu
            offset="24"
            activator="parent"
            v-model="parentMenu"
            @click:outside="toggleArrow"
          >
            <v-list class="pa-0">
              <v-list-item
                v-for="userItem in userItems"
                :key="userItem"
                class="custom-list-item"
                @click="clickHandler(userItem)"
              >
                <v-list-item-title class="custom-list-item-title">{{
                  userItem
                }}</v-list-item-title>
              </v-list-item>

              <!-- Switch role menu toggle -->
              <v-list-item
                class="custom-list-item"
                @click="
                  innerArrow = childMenu
                    ? 'mdi-chevron-left'
                    : 'mdi-chevron-down'
                "
              >
                <v-list-item-title class="custom-list-item-title"
                  >Switch Role</v-list-item-title
                >
                <template v-slot:append>
                  <v-icon>{{ innerArrow }}</v-icon>
                </template>

                <!-- Submenu for switching roles -->
                <v-menu
                  activator="parent"
                  submenu
                  v-model="childMenu"
                  @click:outside="toggleArrow"
                >
                  <v-list class="pa-0">
                    <v-list-item
                      v-for="item in switchRoles"
                      :key="item"
                      class="custom-list-item"
                      @click="toggleArrow"
                    >
                      <v-list-item-title class="custom-list-item-title">{{
                        item.value
                      }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>

      <!-- Displayed on smaller screens for role-based menu (mobile view) -->
      <template v-else>
        <v-menu
          v-if="user"
          offset="20"
          v-model="parentMenu"
          @click:outside="toggleArrow"
        >
          <template v-slot:activator="{ props }">
            <a
              v-bind="props"
              class="custom-link"
              :class="{ active: parentMenu }"
              ><v-icon size="34">mdi-account-circle</v-icon>
            </a>
          </template>

          <!-- List of user-specific menu items (Profile, Favorites, etc.) -->
          <v-list class="pa-0">
            <v-list-item
              v-for="(item, index) in userItems"
              :key="index"
              class="custom-list-item"
            >
              <v-list-item-title class="custom-list-item-title">{{
                item
              }}</v-list-item-title>
            </v-list-item>

            <!-- Switch role item on mobile view -->
            <v-list-item class="custom-list-item">
              <v-list-item-title class="custom-list-item-title"
                >Switch Role</v-list-item-title
              >
              <template v-slot:append>
                <v-icon>{{ innerArrow }}</v-icon>
              </template>

              <!-- Submenu for switching roles on mobile -->
              <v-menu
                activator="parent"
                submenu
                v-model="childMenu"
                @click:outside="toggleArrow"
              >
                <v-list class="pa-0">
                  <v-list-item
                    v-for="item in items"
                    :key="item"
                    class="custom-list-item"
                    @click="toggleArrow"
                  >
                    <v-list-item-title class="custom-list-item-title">{{
                      item.role
                    }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- Menu for unauthenticated users with role selection -->
        <v-menu v-else offset="12" @click:outside="isRoleMenu = false">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <!-- List of signup/login options for unauthenticated users -->
          <v-list
            class="pa-0"
            style="
              box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px,
                rgba(0, 0, 0, 0.23) 0px 6px 6px;
              border-radius: 4px;
            "
          >
            <template v-if="!isRoleMenu">
              <v-list-item
                v-for="item in items.filter(() => !signed_user)"
                :key="item"
                :ripple="false"
                class="custom-list-item"
                @click="openSignupDialog(item.role)"
              >
                <v-list-item-title class="custom-list-item-title">{{
                  item.name
                }}</v-list-item-title>
              </v-list-item>

              <!-- Menu item for login when user is not authenticated -->
              <v-list-item
                v-if="!user"
                :ripple="false"
                class="custom-list-item"
                @click.stop="isRoleMenu = true"
              >
                <v-list-item-title class="custom-list-item-title"
                  >Login As</v-list-item-title
                >
              </v-list-item>
            </template>

            <!-- List of login options when user wants to select a role -->
            <template v-else>
              <v-list-item
                v-for="item in items"
                :key="item"
                :ripple="false"
                class="custom-list-item"
                @click="openLoginDialog(item.role)"
              >
                <v-list-item-title class="custom-list-item-title">{{
                  item.role
                }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <!-- Drawer for navigation on mobile -->
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list-item
        v-for="userItem in userItems"
        :key="userItem"
        :ripple="false"
        class="custom-list-item"
        @click="clickHandler(userItem)"
      >
        <v-list-item-title class="custom-list-item-title">{{
          userItem
        }}</v-list-item-title>
      </v-list-item>
    </v-navigation-drawer>

    <!-- Dialogs for Login and Signup forms -->
    <LoginForm ref="loginDialog" @switch-to-signup="handleSwitchToSignup" />
    <SignupForm ref="signupDialog" @switch-to-login="handleSwitchToLogin" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";

const store = useStore();

// Fetching user from store
const user = computed(() => store.getters["auth/userFullName"]);
const signed_user = computed(
  () => store.getters["auth/getUserForRegistration"]
);
const role_name = computed(() => store.getters["auth/currentRole"]);
const drawer = ref(false);

const items = ref([
  {
    name: "Become Delivery Partner",
    role: "delivery_partner",
    value: "Delivery Partner",
  },
  { name: "Add Restaurant", role: "restaurant", value: "Restaurant" },
  { name: "Signup", role: "customer", value: "Customer" },
]);

const switchRoles = items.value.filter((item) => {
  return item.role !== role_name.value;
});

const outerArrow = ref("mdi-chevron-down");
const innerArrow = ref("mdi-chevron-left");

// const user = "Username";
const userItems = ref(["Profile", "Favorites", "Settings", "Logout"]);

function clickHandler(item) {
  outerArrow.value = "mdi-chevron-down";

  if (item === "Profile") {
    showProfile();
  } else if (item === "Favorites") {
    showFavorites();
  } else if (item === "Settings") {
    openSettings();
  } else if (item === "Logout") {
    logout();
  }
}

function showProfile() {
  const entity =
    store.getters["auth/currentRole"] === "delivery_partner"
      ? "delivery_partner"
      : store.getters["auth/currentRole"];
  navigateTo(`/${entity}/dashboard`);
}

function showFavorites() {
  console.log("Opening Favorites...");
}

function openSettings() {
  console.log("Opening Settings...");
}

async function logout() {
  console.log("Logging out...");
  await store.dispatch("auth/logoutUser");
  navigateTo("/");
}

// const selectedButton = ref(null); // Track the selected button
let isRoleMenu = ref(false); // isRoleMenu to toggle between items and roles
const parentMenu = ref(false);
const childMenu = ref(false);

// Reference to Form components
const loginDialog = ref(null); // Using ref to get the LoginForm component
const signupDialog = ref(null); // Using ref to get the LoginForm component

// Toggle the drawer state
const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

// Open the login dialog with the selected role
const openLoginDialog = (role) => {
  isRoleMenu.value = false;
  loginDialog.value.openDialog(role); // Call the child method
};

// Switch to signup
const handleSwitchToSignup = (role) => {
  signupDialog.value.openDialog(role);
};

// Switch to login
const handleSwitchToLogin = (role) => {
  loginDialog.value.openDialog(role);
};

// Open the login dialog with the selected role

const openSignupDialog = (role) => {
  signupDialog.value.openDialog(role); // Call the child method
};

const toggleArrow = () => {
  outerArrow.value = "mdi-chevron-down";
  innerArrow.value = "mdi-chevron-left";
};
</script>
