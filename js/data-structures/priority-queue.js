/**
 * Task 4: Implement a BiDirectionalPriorityQueue
 * BiDirectionalPriorityQueue Class
 * Provides a priority queue implementation that supports retrieving elements
 * based on both priority (highest/lowest) and insertion order (oldest/newest)
 */
class BiDirectionalPriorityQueue {
    constructor() {
        this.items = [];
        this.insertionCounter = 0;
    }


    // Add an item with a priority and track insertion order
    enqueue(item, priority) {
        const queueItem = {
            item, 
            priority,
            insertionOrder: this.insertionCounter++
        };
        this.items.push(queueItem);
        return this;
    }

    // queue.enqueue(3, 76);
    // queue.enqueue(5, 23);
    // queue.enqueue(7, 95);
    // queue.enqueue("name", 12);

    // [76, 23, 95, 12]

    // queue [
    // {item: 3, priority: 76, insertionOrder: 0},
    //  {item: 5, priority: 23, insertionOrder: 1},
    // {item: 7, priority: 95, insertionOrder: 2},
    //  {item: "name", priority: 12, insertionOrder: 3}]
   
   // queue.peek("lowest") //12
    // Peek at an item without removing it
    peek(option = 'highest') {
        if (this.isEmpty()) return null;

        switch(option) {
            case 'highest':
                // [95, 76, 23, 12] {item: 7, priority: 95, insertionOrder: 2}
                return [...this.items].sort((a, b) => b.priority - a.priority)[0].item;
            case 'lowest':
                // [12, 23, 76, 95] {item: "name", priority: 12, insertionOrder: 3}
                return [...this.items].sort((a, b) => a.priority - b.priority)[0].item;
            case 'oldest':
                // [0, 1, 2, 3] {item: 3, priority: 76, insertionOrder: 0}
                return [...this.items].sort((a, b) => a.insertionOrder - b.insertionOrder)[0].item;
            case 'newest':
                // [3, 2, 1, 0] {item: "name", priority: 12, insertionOrder: 3}
                return [...this.items].sort((a, b) => b.insertionOrder - a.insertionOrder)[0].item;
            default:
                return null;
        }
    }

    // Remove and return an item
    dequeue(option = 'highest') {
        if (this.isEmpty()) return null;

        let sortedItems;
        switch(option) {
            case 'highest':
                // сортування за пріоритетом від найбільшого до найменшого.
                // [95, 76, 23, 12]
                // у сортедІтемс повертається масив об'єктів, відсортованих за пріоритетом
                sortedItems = [...this.items].sort((a, b) => b.priority - a.priority);
                break;
            case 'lowest':
                sortedItems = [...this.items].sort((a, b) => a.priority - b.priority);
                break;
            case 'oldest':
                sortedItems = [...this.items].sort((a, b) => a.insertionOrder - b.insertionOrder);
                break;
            case 'newest':
                sortedItems = [...this.items].sort((a, b) => b.insertionOrder - a.insertionOrder);
                break;
            default:
                return null;
        }

        // Присвоюємо перший елемент масиву sortedItems до itemToRemove
        const itemToRemove = sortedItems[0];
        // Знаходимо індекс елемента, який потрібно видалити в оригінальному масиві this.items
        const index = this.items.findIndex(item => 
            item.priority === itemToRemove.priority && 
            item.insertionOrder === itemToRemove.insertionOrder);
        
        // Видаляємо елемент з this.items за знайденим індексом
        // this.items.splice(index, 1) видаляє елемент з масиву this.items за індексом index
        // і повертає масив видалених елементів, з якого беремо перший (і єдиний) елемент [0]
        return this.items.splice(index, 1)[0].item;
    }

    // Check if queue is empty
    isEmpty() {
        return this.items.length === 0;
    }

   // getAll("highest")
    // Get all items sorted by various criteria
      // queue [
    // {item: 3, priority: 76, insertionOrder: 0},
    //  {item: 5, priority: 23, insertionOrder: 1},
    // {item: 7, priority: 95, insertionOrder: 2},
    //  {item: "name", priority: 12, insertionOrder: 3}]
    getAll(option = 'highest') {
        if (this.isEmpty()) return [];

        switch(option) {
            case 'highest':
                // [95, 76, 23, 12].map(item => item.item) [Санторіні, Греція, Мальдіви, Токіо, Японія, "name"]
                return [...this.items].sort((a, b) => b.priority - a.priority).map(elementOfQueue => {return elementOfQueue.item});
            case 'lowest':
                // [12, 23, 76, 95].map(item => item.item) ["name", 5, 3, 7]
                return [...this.items].sort((a, b) => a.priority - b.priority).map(elementOfQueue => elementOfQueue.item);
            case 'oldest'://fifo [0, 1, 2, 3].map(item => item.item) [3, 5, 7, "name"]
                return [...this.items].sort((a, b) => a.insertionOrder - b.insertionOrder).map(elementOfQueue => elementOfQueue.item);
            case 'newest': //lifo [3, 2, 1, 0].map(elementOfQueue => elementOfQueue.item) ["name", 7, 5, 3]
                return [...this.items].sort((a, b) => b.insertionOrder - a.insertionOrder).map(elementOfQueue => elementOfQueue.item);
            default:
                return [];
        }
    }
}

export default BiDirectionalPriorityQueue;
