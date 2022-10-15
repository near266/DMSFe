import { environment } from "src/environments/environment";

export const base_url = environment.ID_URL;
export const api_url = base_url + '/api';
export const gateway_url = base_url + '/gw';

export const api_gateway_url = environment.API_URL + '/gw';
export const customer_url = api_gateway_url + '/Customer';
export const customer_group_url = api_gateway_url + '/CustomerGroup';
export const customer_type_url = api_gateway_url + '/CustomerType';
export const channel_url = api_gateway_url + '/Channel';
export const area_url = api_gateway_url + '/Area';
