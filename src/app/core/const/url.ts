import { environment } from 'src/environments/environment';

export const base_url = environment.ID_URL;
export const api_url = base_url + '/api';
export const gateway_url = base_url + '/gw';
export const route_api = gateway_url + '/Route';

export const admin_url = api_url + '/admin';
export const admin_user_url = admin_url + '/Users';
export const api_gateway_url = environment.API_URL + '/gw';
export const api_base_url = environment.API_URL + '/api';
export const warehouses_url = api_gateway_url + '/Warehouse';
export const customer_url = api_gateway_url + '/Customer';
export const route_customer_url = api_gateway_url + '/Route';
export const customer_group_url = api_gateway_url + '/CustomerGroup';
export const customer_type_url = api_gateway_url + '/CustomerType';
export const channel_url = api_gateway_url + '/Channel';
export const area_url = api_gateway_url + '/Area';
export const album_url = api_gateway_url + '/Album';
export const check_in_url = api_gateway_url + '/CheckIn';
export const history_url = api_gateway_url + '/HistoryLog';
export const notification_url = api_base_url + '/Notify';

export const upload_url = environment.UPLOAD_URL;
export const gateway_img_url = upload_url + '/gateway';
export const uploadImg_url = gateway_img_url + '/Image';
