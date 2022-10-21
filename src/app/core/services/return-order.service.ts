import { Injectable } from '@angular/core';
import { api_gateway_url, base_url } from '../const/url';

@Injectable({
  providedIn: 'root'
})
export class ReturnOrderService {

  constructor() { }


  api_gateway_url = api_gateway_url;
  id_url_gw = base_url + '/gw';
}
