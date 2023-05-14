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
