function analyzeSqlInput(query) {
  const lowered = query.toLowerCase();

  if (lowered.includes("union select")) {
    return {
      name: "UNION SELECT pattern",
      severity: "high"
    };
  }

  if (lowered.includes("' or '1'='1") || lowered.includes("or 1=1")) {
    return {
      name: "SQL tautology pattern",
      severity: "high"
    };
  }

  if (query.includes("--") || query.includes("#")) {
    return {
      name: "SQL comment operator",
      severity: "medium"
    };
  }

  if (
    query.includes(";") &&
    (
      lowered.includes("drop") ||
      lowered.includes("delete") ||
      lowered.includes("update") ||
      lowered.includes("insert")
    )
  ) {
    return {
      name: "Stacked query attempt",
      severity: "high"
    };
  }

  return null;
}

module.exports = {
  analyzeSqlInput
};