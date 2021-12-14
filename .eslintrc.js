module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb", "prettier"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["prettier"],
  rules: {
    "react/destructuring-assignment": "off",
    "no-use-before-define": "off",
    "no-underscore-dangle": "off",
    "jsx-a11y/label-has-for": "off",
    "no-shadow": "off",
    "no-unneeded-ternary": "off",
    "no-nested-ternary": "off",
    "no-unused-vars": "off",
    "no-param-reassign": "off",
    "import/prefer-default-export": "off",
    "react/react-in-jsx-scope": "off",
    "no-prototype-builtins": "off",
    "no-restricted-syntax": "off",
    "import/no-cycle": "off",
    "guard-for-in": "off",
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "react/prop-types": "off",
    "react/no-children-prop": "off",
    "react/no-array-index-key": "off",
    "react/jsx-props-no-spreading": "off",
    camelcase: "off",
    "jsx-a11y/anchor-is-valid": "off",
    "jsx-a11y/label-has-associated-control": [
      "error",
      {
        required: {
          some: ["nesting", "id"],
        },
      },
    ],
  },
};
