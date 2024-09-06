export const ProductService = {
    getProductsData() {
        return [
            {
                image: 'tete.jpg',
                name: 'test',
            },
            {
                image: 'shirt.jpg',
                name: 'test',
            },
            {
                image: 'short.jpg',
                name: 'test',
            },
            {
                image: 'shoes.jpg',
                name: 'test',
            },
        ];
    },

    getProductsSmall() {
        return Promise.resolve(this.getProductsData().slice(0, this.getProductsData().length));
    },
};
