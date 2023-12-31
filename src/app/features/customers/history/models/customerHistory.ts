import { List } from './../../../timekeeping/models/List';
import { Order } from './../../../recycle/models/Order';
export interface CustomerHistory {
    list: CustomerHistoryList[];
}
export interface ListHistoryVisit {
    List: HistoryVisit[];
}
export interface HistoryVisit {
    id: string,
    employeeName: string,
    dateCheckin: string,
    timeCheckin: string,
    addressCheckin: string,
    imageCheckin: string,
    note: string,
    order: string,
    isRoute: boolean,
    dayCheckIn: string,
    dayCheckOut: string,
    checkInTime: string,
    checkOutTime: string,


}

export interface CustomerHistoryList {
    id: string;
    customerCode: string;
    customerName: string;
    customerGroup: CustomerGroup;
    customerType: CustomerType;
    channel: Channel;
    area: Area;
    status: boolean;
    address: string;
    phone: string;
    email: string;
    avatar: string;
    latitude: string;
    longitude: string;
    source: string;
    type: number;
    createdBy: string;
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
}

export interface CustomerGroup {
    id: string;
    customerGroupCode: string;
    customerGroupName: string;
}

export interface CustomerType {
    id: string;
    customerTypeCode: string;
    customerTypeName: string;
}

export interface Channel {
    id: string;
    channelCode: string;
    channelName: string;
}

export interface Area {
    id: string;
    areaCode: string;
    areaName: string;
}
