const { v4: uuidv4 } = require("uuid"); // For generating UUIDs
const users = [
  "078a83d3-682c-416e-a3ce-11807ed96aeb",
  "e71e6c2c-c6da-491e-b381-ab25e0843ab6",
  "5382cb9c-33e6-4679-9cf7-b94769439d23",
  "2cdff2c1-5684-4ac2-a9e6-4ddcc7b3f2f4",
  "43f64402-e476-44c6-af6a-3d155749444d",
  "e189db94-2b3b-4307-998b-e3bdc66bb014",
  "a00d7911-838e-4dc3-889a-088f863f72c4",
  "72f2882e-cab1-4017-bdad-1d18fb1db0c7",
  "c30d1d13-583b-4ea7-bb3f-e751d5073117",
  "ced31ef0-9300-4ef3-a91b-95073937187d",
  "cf9e82b5-01b4-4878-ac7e-afc917e2d184",
  "3b826742-60c1-4d0e-abc1-ed9ff1f4e2a6",
  "f655cffc-2391-40a8-b06f-d301e57af0de",
  "30c2c478-4c1b-48ae-b28c-f538d1f0f26f",
  "6fc12bde-e1d4-4cba-90b7-8ee2ae6aa93a",
];

module.exports = {
  up: async (queryInterface) => {
    const userRoles = [];

    // Define role UUIDs
    const restaurantRoleUuid = "2a22d5b4-fca6-4971-9afc-95901ee0e449";
    const deliveryRoleUuid = "c9040807-b84b-47f0-ac6d-a332d5ae7d8c";
    const customerRoleUuid = "57a86148-e621-42cf-b8d4-9bb7cef6074c";

    // Assign the first 5 users to the restaurant role
    for (let i = 0; i < 5; i++) {
      userRoles.push({
        uuid: uuidv4(),
        user_uuid: users[i],
        role_uuid: restaurantRoleUuid,
        created_by: users[0], // Assuming the first user is the creator
        updated_by: null,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // Assign the next 5 users to the delivery partner role
    for (let i = 5; i < 10; i++) {
      userRoles.push({
        uuid: uuidv4(),
        user_uuid: users[i],
        role_uuid: deliveryRoleUuid,
        created_by: users[0],
        updated_by: null,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // Assign the last 5 users to the customer role
    for (let i = 10; i < 15; i++) {
      userRoles.push({
        uuid: uuidv4(),
        user_uuid: users[i],
        role_uuid: customerRoleUuid,
        created_by: users[0],
        updated_by: null,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("user_roles", userRoles, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("user_roles", null, {});
  },
};
