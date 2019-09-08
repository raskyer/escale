import Consumable from "./Consumable";

export default class Cocktail {
  private readonly consumables: Map<Consumable, integer> = new Map();
  // other stuff such as : lemon, ice, etc ...

  private constructor() {
    this.consumables.set(Consumable.Rhum, 10);
  }

  static build(): Cocktail {
    return new Cocktail();
  }
}
