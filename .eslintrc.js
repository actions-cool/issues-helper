module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  plugins: ["simple-import-sort"],
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  },
};
