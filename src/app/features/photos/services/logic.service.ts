import { Injectable } from '@angular/core';
import { Response } from 'src/app/core/model/Response';
import { CheckInService } from 'src/app/core/services/check-in.service';
import { Photo } from '../models/Photo';

@Injectable({
  providedIn: 'root'
})
export class LogicService {

  constructor(
    private checkIn: CheckInService
  ) { }

  getListPhoto() {
    this.checkIn.getAll(1,20).subscribe( (response: Response<Photo>) => {
        console.log(response);

    });
  }
}
