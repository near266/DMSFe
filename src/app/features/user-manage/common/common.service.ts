import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CommonService {
    constructor() {}
}

export enum TypeExport {
    Selected,
    Filter,
}
