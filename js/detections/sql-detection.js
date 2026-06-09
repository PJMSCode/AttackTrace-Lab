const assert = require("assert");

const { analyzeSqlInput } =
  require("../js/detections/sql-detection");

// UNION SELECT
const unionResult =
  analyzeSqlInput("' UNION SELECT * FROM users");

assert.strictEqual(
  unionResult.name,
  "UNION SELECT pattern"
);

// Tautology
const tautologyResult =
  analyzeSqlInput("' OR '1'='1");

assert.strictEqual(
  tautologyResult.name,
  "SQL tautology pattern"
);

// Comment operator
const commentResult =
  analyzeSqlInput("pikachu' --");

assert.strictEqual(
  commentResult.name,
  "SQL comment operator"
);

// Stacked query
const stackedResult =
  analyzeSqlInput(
    "pikachu'; DROP TABLE pokemon;"
  );

assert.strictEqual(
  stackedResult.name,
  "Stacked query attempt"
);

// Benign query
const benignResult =
  analyzeSqlInput("pikachu");

assert.strictEqual(
  benignResult,
  null
);

console.log(
  "All SQL injection detection tests passed."
);