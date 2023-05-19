/* This code is defining an array of objects called `populateOptions`. Each object in the array
specifies a path to a field in a MongoDB document, along with additional options for populating that
field. The `path` property specifies the name of the field to populate, while the `select` property
specifies which fields to include in the populated document. The `populate` property is used to
specify additional fields to populate within the referenced document. This code is typically used in
conjunction with Mongoose's `populate()` method to retrieve related documents from the database. */
const populateOptions = [
  {
    path: "comment",
    select: "text createdAt",
    populate: {
      path: "author",
      select: "username",
    },
  },
  {
    path: "taggedUsers",
    select: "username",
  },
  {
    path: "likes",
    select: "username",
  },
];

module.exports = populateOptions;
