// Task 4:
class BiDirectionalPriorityQueue {
  constructor() {
    this.items = [];
    this.insertionCounter = 0;
  }
  enqueue(item, priority) {
    const queueItem = {
      item,
      priority,
      insertionOrder: this.insertionCounter++,
    };
    this.items.push(queueItem);
    return this;
  }

  peek(option = "highest") {
    if (this.isEmpty()) return null;

    switch (option) {
      case "highest":
        return [...this.items].sort((a, b) => b.priority - a.priority)[0].item;
      case "lowest":
        return [...this.items].sort((a, b) => a.priority - b.priority)[0].item;
      case "oldest":
        return [...this.items].sort(
          (a, b) => a.insertionOrder - b.insertionOrder
        )[0].item;
      case "newest":
        return [...this.items].sort(
          (a, b) => b.insertionOrder - a.insertionOrder
        )[0].item;
      default:
        return null;
    }
  }

  dequeue(option = "highest") {
    if (this.isEmpty()) return null;

    let sortedItems;
    switch (option) {
      case "highest":
        sortedItems = [...this.items].sort((a, b) => b.priority - a.priority);
        break;
      case "lowest":
        sortedItems = [...this.items].sort((a, b) => a.priority - b.priority);
        break;
      case "oldest":
        sortedItems = [...this.items].sort(
          (a, b) => a.insertionOrder - b.insertionOrder
        );
        break;
      case "newest":
        sortedItems = [...this.items].sort(
          (a, b) => b.insertionOrder - a.insertionOrder
        );
        break;
      default:
        return null;
    }
    const itemToRemove = sortedItems[0];
    const index = this.items.findIndex(
      (item) =>
        item.priority === itemToRemove.priority &&
        item.insertionOrder === itemToRemove.insertionOrder
    );

    return this.items.splice(index, 1)[0].item;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  getAll(option = "highest") {
    if (this.isEmpty()) return [];
    switch (option) {
      case "highest":
        return [...this.items]
          .sort((a, b) => b.priority - a.priority)
          .map((elementOfQueue) => {
            return elementOfQueue.item;
          });
      case "lowest":
        return [...this.items]
          .sort((a, b) => a.priority - b.priority)
          .map((elementOfQueue) => elementOfQueue.item);
      case "oldest":
        return [...this.items]
          .sort((a, b) => a.insertionOrder - b.insertionOrder)
          .map((elementOfQueue) => elementOfQueue.item);
      case "newest":
        return [...this.items]
          .sort((a, b) => b.insertionOrder - a.insertionOrder)
          .map((elementOfQueue) => elementOfQueue.item);
      default:
        return [];
    }
  }
}

export default BiDirectionalPriorityQueue;
