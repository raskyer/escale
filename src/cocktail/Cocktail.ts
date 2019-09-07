import Alcool from "./Alcool";

export default class Cocktail {
  private readonly alcools: Map<Alcool, integer> = new Map();
  // other stuff such as : lemon, ice, etc ...

  private constructor() {}

  static build(): Cocktail {
    return new Cocktail();
  }
}
