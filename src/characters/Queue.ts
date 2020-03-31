import Character from './Character';
import { Consumer, BiConsumer } from 'utils/Interfaces';

export default class Queue {
  private readonly queue: Character[] = [];
  private readonly leaving: Character[] = [];

  constructor(private readonly onReady: Consumer<Character>, private readonly onAwait: BiConsumer<Character>) {}

  addClient(client: Character) {
    if (this.queue.length === 0) {
      this.onReady(client);
    } else {
      const last = this.queue[this.queue.length - 1];
      this.onAwait(client, last);
    }
    client.addOnLeaveListener(this.onLeave.bind(this));
    this.queue.push(client);
    return this;
  }

  isFull() {
    return this.queue.length > 5;
  }

  private onLeave(client: Character) {
    const id = this.queue.findIndex(c => c === client);
    if (id === -1) {
      throw new Error('Unable to find this client in queue');
    }

    // If client have follower
    if (id + 1 < this.queue.length) {
      if (id - 1 > -1) {
        this.onAwait(this.queue[id + 1], this.queue[id - 1]);
      } else {
        this.onReady(this.queue[id + 1]);
      }
    }

    this.queue.splice(id, 1);
  }
}
