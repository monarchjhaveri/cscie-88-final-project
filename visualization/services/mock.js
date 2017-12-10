module.exports = [
  {
    id: 1,
    name: "One",
    description: "This is a package that does stuff",
    dependents: [],
    dependencies: [2, 3, 6]
  },
  {
    id: 2,
    name: "Two",
    description: "This is a package that does stuff",
    dependents: [1],
    dependencies: [4, 5, 6]
  },
  {
    id: 3,
    name: "Three",
    description: "This is a package that does stuff",
    dependents: [1],
    dependencies: [4, 5, 6]
  },
  {
    id: 4,
    name: "Four",
    description: "This is a package that does stuff",
    dependents: [2, 3],
    dependencies: [6]
  },
  {
    id: 5,
    name: "Five",
    description: "This is a package that does stuff",
    dependents: [2, 3],
    dependencies: [6]
  },
  {
    id: 6,
    name: "Six",
    description: "This is a package that does stuff",
    dependents: [1,2,3,4,5],
    dependencies: []
  }
];