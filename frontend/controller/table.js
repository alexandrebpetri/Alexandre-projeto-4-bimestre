export class Game {
    constructor({ id, name, description, price, release_date, categories, category, developer, image }) {
        // Garantir que id seja numérico para comparações confiáveis
        this.id = typeof id === 'number' ? id : (id ? Number(id) : null);
        this.name = name;
        this.description = description;
        this.price = typeof price === 'number' ? price : parseFloat(price) || 0;
        this.release_date = release_date;
        this.categories = categories || category || [];
        this.developer = developer;
        this.image = image;
    }
}