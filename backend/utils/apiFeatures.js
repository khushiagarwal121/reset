const sort = (fields) => {
  let sortingFields = [["updated_at", "DESC"]];

  if (fields) {
    sortingFields = fields.split(",");

    sortingFields = sortingFields.map((el) => {
      if (el[0] == "-") {
        el = el.slice(1);
        return [el, "DESC"];
      } else {
        return [el, "ASC"];
      }
    });
  }

  return sortingFields;
};

const paginate = (page, limit) => {
  let skip = 0;

  if (page) {
    page = parseInt(page);
    limit = parseInt(limit);
    skip = (page - 1) * limit;
  }

  return skip;
};

const limitFields = (fields) => {
  let excludeFields = [
    "created_at",
    "updated_at",
    "deleted_at",
    "created_by",
    "updated_by",
  ];

  if (fields) {
    excludeFields = excludeFields.concat(fields.split(","));
    //   if (fields.includes("password")) {
    //     const index = fields.indexOf("password");
    //     fields.splice(index, 1);
    //   }
  }

  return excludeFields;
};

export { sort, limitFields, paginate };
