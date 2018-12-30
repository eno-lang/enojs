const spacingVariants = (tokens) => {
  if(tokens.length > 1) {
    const results = [];

    for(let variant of spacingVariants(tokens.slice(1))) {
      results.push(`${tokens[0]}${variant}`);
      results.push(`   ${tokens[0]}${variant}`);
    }

    return results;
  } else {
    return [tokens[0], `   ${tokens[0]}`];
  }
};

module.exports = (...tokens) => {
  tokens.push('');

  return spacingVariants(tokens);
}
