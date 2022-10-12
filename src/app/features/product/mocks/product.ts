import { faker } from '@faker-js/faker';
import { Product } from '../models/product';

const products: Product[] = [];

for (let i = 0; i < 100; i++) {
    products.push({
        locked: faker.datatype.boolean(),
        unitId: faker.helpers.arrayElement(['Hộp', 'Tuýt', 'Lọ', 'Chai', undefined]),
        retailPrice: faker.datatype.float({ min: 1000, max: 100000000000, precision: 2 }),
        SKU: faker.random.locale().toUpperCase() + faker.commerce.price(100, 10000, 0),
        VAT: faker.helpers.arrayElement([5, 10, undefined]),
        discountAcc: faker.commerce.price(1000, 10000, 0),
        warehouseID: faker.address.city(),
        brandId: faker.company.name(),
        productName: faker.commerce.productName(),
        supplierId: faker.datatype.uuid(),
        image: faker.image.imageUrl(),
        productDescription: faker.lorem.paragraph(),
        priceAcc: faker.datatype.float({ min: 1000, max: 10000, precision: 2 }),
        warehouseAcc: faker.datatype.float({ min: 1000, max: 10000, precision: 2 }),
        inventoryWarning: faker.datatype.number({ min: 1, max: 100 }),
        barcode: faker.commerce.price(1000, 10000, 0),
    });
}

export default products;
