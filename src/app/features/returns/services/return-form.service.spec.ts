import { TestBed } from '@angular/core/testing';

import { ReturnFormService } from './return-form.service';

describe('ReturnFormService', () => {
  let service: ReturnFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReturnFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
