import Orderable from "../order/Orderable";

export default class Cocktail implements Orderable {
  getTasks(): any[] {
    throw new Error("Method not implemented.");
  }
}
