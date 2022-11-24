export interface Channel {
  id?: string;
  channelCode: string;
  channelName: string;
  deptLimit: any;
  status: boolean;
  createdBy?: string;
  lastModifiedDate?: Date
}
