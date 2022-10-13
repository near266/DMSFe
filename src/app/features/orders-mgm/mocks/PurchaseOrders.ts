import { faker } from '@faker-js/faker';
import { PurchaseOrder } from 'src/app/core/model/PurchaseOrder';
const purchaseOrdersList: PurchaseOrder[] = [];

for (let i = 0; i < 1000; i++) {
    purchaseOrdersList.push({
        purchaseOrderId: faker.datatype.uuid(),
        purchaseOrderCode: faker.datatype.hexadecimal({ length: 6, case: 'upper' }),
        status: faker.datatype.number({ min: 1, max: 5 }),
        orderDate: faker.datatype.datetime(),
        deliveryDate: faker.datatype.datetime(),
        orderEmployee: {
            employeeId: faker.datatype.uuid(),
            employeeName: faker.name.fullName(),
        },
        customerCode: faker.datatype.hexadecimal({ length: 6, case: 'upper' }),
        customerName: faker.name.fullName(),
        phone: faker.phone.number('+84#########'),
        address: faker.address.streetAddress(),
        description: faker.datatype.hexadecimal({ length: 20, case: 'lower' }),
        totalPayment: faker.datatype.number({ min: 1000000 }),
        approveDate: faker.datatype.datetime(),
        approveBy: faker.name.fullName(),
        createdDate: faker.datatype.datetime(),
        createdBy: faker.name.fullName(),
        lastModifiedBy: faker.name.fullName(),
        lastModifiedDate: faker.datatype.datetime(),
        source: faker.datatype.hexadecimal({ length: 5, case: 'lower' }),
    });
}

export default purchaseOrdersList;
