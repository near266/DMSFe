import { faker } from '@faker-js/faker';
import { Return } from '../models/return';

const returns: Return[] = [];

for (let i = 0; i < 100; i++) {
    returns.push({
        locked: faker.datatype.boolean(),
        customerID: faker.datatype.uuid(),
        productID: faker.random.locale().toUpperCase() + faker.commerce.price(100, 10000, 0),
        salesCode: faker.commerce.price(1000, 10000, 0),
        customerCode: faker.commerce.price(1000, 10000, 0),
        customerName: faker.name.fullName(),
        orderer: faker.name.fullName(),
        orderDate: faker.date.past().toDateString(),
        phoneNo: faker.phone.number(),
        address: faker.address.cityName(),
        returnsCode: faker.datatype.uuid(),
        returnsDate: faker.date.past().toDateString(),
        status: faker.helpers.arrayElement(['pending', 'approved', 'imported']),
        description: faker.lorem.paragraph(),
        totalAmount: faker.commerce.price(1000, 10000, 0) + ',000',
        totalVAT: faker.helpers.arrayElement([5, 10]),
        productDiscount: faker.commerce.price(1000, 10000, 0) + '000',
        orderDiscount: faker.commerce.price(1000, 10000, 0) + '000',
        mandatoryPayment: faker.commerce.price(1000, 10000, 0) + '000',
        debit: faker.commerce.price(1000, 10000, 0) + '000',
    });
}

export default returns;
