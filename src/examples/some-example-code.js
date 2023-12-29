/**
 * Small example for making use of jscodeshift
 */

// Will be shifted to "Cat" and "Dog"
const TYPE_CAT = "cat";
const TYPE_DOG = "dog";

const foo = "bar";

// Will be shifted to "Roxie", "Prumsche" and Zoë"
const cats = [
  { name: "roxie", type: TYPE_DOG },
  { name: "prumsche", type: TYPE_CAT },
  { name: "zoë", type: TYPE_CAT },
];

const display = () => {
  // Will be shifted to forEach
  for (const cat of cats) {
    console.log("name: " + cat.name);
  }
};

display();

module.exports = display;
