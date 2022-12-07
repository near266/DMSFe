import { Injectable } from '@angular/core';
import { ReturnApiService } from '../apis/return-api.service';

import { ReturnsFilterService } from './returns-filter.service';

@Injectable({
    providedIn: 'root',
})
export class ReturnsService {
    constructor(private returnApiService: ReturnApiService, private filterService: ReturnsFilterService) {}
}
