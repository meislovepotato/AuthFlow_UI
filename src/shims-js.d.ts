declare module "*.js";
declare module "*.jsx";

// Generic catch-all for local JS/JSX modules without type declarations
declare module "*" {
  const value: any;
  export default value;
}
