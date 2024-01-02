/**
 * Small example for making use of jscodeshift
 */

// Will be shifted to "Cat" and "Dog"
const TYPE_CAT = "cat";
const TYPE_DOG = "dog";

// Will be shifted to 'bar = "bar"
const foo = "bar";

// Will be shifted to "animals"
const cats = [
  // Will be shifted to "Roxie", "Prumsche" and Zoë"
  { name: "roxie", type: TYPE_DOG },
  { name: "prumsche", type: TYPE_CAT },
  { name: "zoë", type: TYPE_CAT },
];

const display = () => {
  // Will be shifted to forEach
  // Will be shifted to "animals"
  for (const cat of cats) {
    // Will be shifted to string interpolation
    console.log("name: " + cat.name + ", type: " + cat.type);
  }
};

display();

module.exports = display;
