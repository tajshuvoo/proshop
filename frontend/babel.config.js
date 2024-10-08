module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: [
    "@babel/plugin-transform-private-property-in-object",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-syntax-jsx",
    "@babel/plugin-proposal-class-properties"
  ],
};