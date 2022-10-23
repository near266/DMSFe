import { faker } from '@faker-js/faker';
import { Return } from '../models/return';

const returns: Return[] = [];

for (let i = 0; i < 100; i++) {
    returns.push({
        id: faker.datatype.uuid(),
        customerName: faker.name.fullName(),
        orderDate: faker.date.past().toDateString(),
        address: faker.address.cityName(),
        returnsDate: faker.date.past().toDateString(),
        status: faker.helpers.arrayElement([1, 2, 6]),
        description: faker.lorem.paragraph(),
        totalAmount: faker.helpers.arrayElement([5, 10]),
        totalVAT: faker.helpers.arrayElement([5, 10]),
    });
}
