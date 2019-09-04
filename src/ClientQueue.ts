import Character from "character/Character";
import Bar from "drawable/Bar";

export default class ClientQueue {
  private bar: Bar;
  private queue: Character[] = [];

  constructor(bar: Bar) {
    this.bar = bar;
  }

  addClient(client: Character) {
    if (this.queue.length === 0) {
      client.moveTo(this.bar.getX(), this.bar.getY())
      .then(_ => {
        client.startWait(client => {
          client.leave();
          client.moveTo(0, client.getY());
        });
      });
    } else {
      const last = this.queue[this.queue.length - 1];
      client.follow(last)
      .then(_ => {
        client.startWait(client => {
          client.leave();
          client.moveTo(0, client.getY());
        });
      });;
    }
    client.addOnLeaveListener(this.onLeave.bind(this));
    this.queue.push(client);
    return this;
  }

  private onLeave(client: Character) {
    const id = this.queue.findIndex(c => c === client);
    if (id === -1) {
      throw new Error('Unable to find this client in queue');
    }

    // If it got follower
    if (id + 1 < this.queue.length) {
      if (id - 1 > -1) {
        this.queue[id + 1].follow(this.queue[id - 1]);
      } else {
        this.queue[id + 1].moveTo(this.bar.getX(), this.bar.getY());
      }
    }

    this.queue.splice(id, 1);
  }
}
