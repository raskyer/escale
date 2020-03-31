import Consumable from './Consumable';
import CocktailType from './CocktailType';

export default class Cocktail {
  private constructor(
    private readonly type: CocktailType,
    private readonly consumables: Map<Consumable, integer>
  ) {
    // other stuff such as : lemon, ice, etc ...
    this.consumables.set(Consumable.Rhum, 10);
  }

  getType(): CocktailType {
    return this.type;
  }

  static buildRandom(): Cocktail {
    const type = CocktailType.MOJITO;
    return Cocktail.build(type);
  }

  static build(type: CocktailType): Cocktail {
    return new Cocktail(type, new Map());
  }
}
