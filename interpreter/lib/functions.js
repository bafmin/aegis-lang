
function greet(name) {
  return `Hello, ${name}`;
}

function multiply(a, b) {
  return a * b;
}

function fail() {
  throw new Error("Intentional failure");
}

module.exports = {
  tools: {
    greet,
    multiply,
    fail
  }
};
