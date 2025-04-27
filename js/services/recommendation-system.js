import BiDirectionalPriorityQueue from '../data-structures/priority-queue.js';

/**
 * Task 4: Implement a BiDirectionalPriorityQueue
 * Travel Recommendations System
 * Uses a BiDirectionalPriorityQueue to manage and retrieve travel recommendations
 */
class TravelRecommendationSystem {
    constructor() {
        this.recommendationsQueue = new BiDirectionalPriorityQueue();
        this.initializeRecommendations();
    }

    initializeRecommendations() {
        this.recommendationsQueue.enqueue({
            title: "Санторіні, Греція",
            description: "Ідеальний для романтичного відпочинку",
            image: "images/g-4.jpg",
            link: "#"
        }, 95);

        this.recommendationsQueue.enqueue({
            title: "Токіо, Японія",
            description: "Для любителів міських пригод і культури",
            image: "images/p-5.jpg",
            link: "#"
        }, 90);

        this.recommendationsQueue.enqueue({
            title: "Балі, Індонезія",
            description: "Тропічний рай для розслаблення і духовного відпочинку",
            image: "images/g-8.jpg",
            link: "#"
        }, 88);

        this.recommendationsQueue.enqueue({
            title: "Альпи, Швейцарія",
            description: "Ідеально для активного зимового відпочинку",
            image: "images/g-1.jpg",
            link: "#"
        }, 85);

        this.recommendationsQueue.enqueue({
            title: "Нью-Йорк, США",
            description: "Місто, яке ніколи не спить",
            image: "images/New-York.jpg",
            link: "#"
        }, 83);
        
        this.recommendationsQueue.enqueue({
            title: "Барселона, Іспанія",
            description: "Місто дивовижної архітектури та середземноморської кухні",
            image: "images/Barcelona.jpg",
            link: "#"
        }, 87);
        
        this.recommendationsQueue.enqueue({
            title: "Кіото, Японія",
            description: "Традиційна Японія з древніми храмами та садами",
            image: "images/Kyoto.jpg",
            link: "#"
        }, 84);
        
        this.recommendationsQueue.enqueue({
            title: "Амстердам, Нідерланди",
            description: "Місто велосипедів, каналів і мистецтва",
            image: "images/g-6.jpg",
            link: "#"
        }, 82);
        
        this.recommendationsQueue.enqueue({
            title: "Мальдіви",
            description: "Райські острови з білосніжними пляжами та бірюзовою водою",
            image: "images/Maldives.jpg",
            link: "#"
        }, 93);
        
        this.recommendationsQueue.enqueue({
            title: "Прага, Чехія",
            description: "Казкове місто з середньовічною архітектурою та атмосферою",
            image: "images/Prague.jpg",
            link: "#"
        }, 80);
        
        this.recommendationsQueue.enqueue({
            title: "Кейптаун, ПАР",
            description: "Приголомшливі пейзажі на межі двох океанів",
            image: "images/Africa.webp",
            link: "#"
        }, 79);
        
        this.recommendationsQueue.enqueue({
            title: "Патагонія, Аргентина/Чілі",
            description: "Незаймані ландшафти та приголомшлива природа",
            image: "images/Patagonia.jpg",
            link: "#"
        }, 81);
        
        this.recommendationsQueue.enqueue({
            title: "Маракеш, Марокко",
            description: "Екзотичні базари та колоритна культура",
            image: "images/Marrakech.jpeg",
            link: "#"
        }, 78);
        
        this.recommendationsQueue.enqueue({
            title: "Дубай, ОАЕ",
            description: "Футуристичне місто розкоші та інновацій посеред пустелі",
            image: "images/Dubai.jpg",
            link: "#"
        }, 85);
        
        this.recommendationsQueue.enqueue({
            title: "Сідней, Австралія",
            description: "Місто з неймовірною оперою та чудовими пляжами",
            image: "images/p-3.jpg",
            link: "#"
        }, 86);
    }

    getRecommendations(option) {
        return this.recommendationsQueue.getAll(option).slice(0, 3);
    }
    
  // Не реалізовано (замало опцій у рекомендаціях, буде повторюватися) можна видалити
    getMoreRecommendations(option, count = 6) {
        return this.recommendationsQueue.getAll(option).slice(0, count);
    }

    // Не використовується
    addRecommendation(recommendation, priority) {
        this.recommendationsQueue.enqueue(recommendation, priority);
    }
}

export default new TravelRecommendationSystem();
