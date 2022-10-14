import { faker } from '@faker-js/faker';

const companies: {
    label: string;
    value: string;
}[] = [];

for (let i = 0; i < 10; i++) {
    companies.push({
        value: faker.datatype.uuid(),
        label: faker.company.name(),
    });
}

export default companies;
