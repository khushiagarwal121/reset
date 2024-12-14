"use strict";

module.exports = {
  up: async (queryInterface) => {
    const users = [
      "078a83d3-682c-416e-a3ce-11807ed96aeb", // User 1 (John Doe)
      "e71e6c2c-c6da-491e-b381-ab25e0843ab6", // User 2 (Jane Smith)
      "5382cb9c-33e6-4679-9cf7-b94769439d23", // User 3 (Alice Brown)
      "2cdff2c1-5684-4ac2-a9e6-4ddcc7b3f2f4", // User 4 (Michael Clark)
      "43f64402-e476-44c6-af6a-3d155749444d", // User 5 (Emma Johnson)
    ];


    const restaurants = [
      {
        uuid: "a7e1f62d-5dcb-45f7-8c17-438a6271c52b",
        owner_uuid: users[0],
        name: "Sunrise Café",
        is_pure_veg: true,
        operating_hour: JSON.stringify({
          monday: [{ start_time: "08:00 AM", end_time: "10:00 PM" }],
          tuesday: [{ start_time: "08:00 AM", end_time: "10:00 PM" }],
        }),
        is_open: true,
        created_by: users[0],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: "b8f2f63d-4d5e-43d8-8f7e-123abc123ef1",
        owner_uuid: users[1],
        name: "The Green Bowl",
        is_pure_veg: false,
        operating_hour: JSON.stringify({
          monday: [
            { start_time: "09:00 AM", end_time: "01:00 PM" },
            { start_time: "05:00 PM", end_time: "11:00 PM" },
          ],
          wednesday: [{ start_time: "09:00 AM", end_time: "11:00 PM" }],
        }),
        is_open: true,
        created_by: users[1],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: "c9f3f64e-5e6f-44f8-9f8f-456def456ef2",
        owner_uuid: users[2],
        name: "Ocean Breeze Restaurant",
        is_pure_veg: false,
        operating_hour: JSON.stringify({
          thursday: [
            { start_time: "10:00 AM", end_time: "03:00 PM" },
            { start_time: "06:00 PM", end_time: "09:00 PM" },
          ],
        }),
        is_open: true,
        created_by: users[2],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: "318a6798-0675-4289-9e3e-0d95da3815ae",
        owner_uuid: users[3],
        name: "Mountain View Diner",
        is_pure_veg: true,
        operating_hour: JSON.stringify({
          friday: [{ start_time: "07:00 AM", end_time: "10:00 PM" }],
          saturday: [{ start_time: "07:00 AM", end_time: "11:00 PM" }],
        }),
        is_open: true,
        created_by: users[3],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: "0c06fb2c-2f1e-4c1a-8de6-06586e740d76",
        owner_uuid: users[4],
        name: "Downtown Bites",
        is_pure_veg: false,
        operating_hour: JSON.stringify({
          sunday: [
            { start_time: "10:00 AM", end_time: "04:00 PM" },
            { start_time: "06:00 PM", end_time: "11:00 PM" },
          ],
        }),
        is_open: true,
        created_by: users[4],
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];


    await queryInterface.bulkInsert("restaurants", restaurants, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("restaurants", null, {});
  },
};
