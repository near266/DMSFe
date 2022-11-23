export class CustomerType {
  id?: string;
  serial: number;
  customerTypeCode: string;
  customerTypeName: string
  miniumCheckinTime: any;
  compulsoryPhotography: any;
  mandatoryInventoryRecord: any;
  deptLimit: any;
  status: boolean;
  createdBy?: string;
  lastModifiedDate?: Date
}
