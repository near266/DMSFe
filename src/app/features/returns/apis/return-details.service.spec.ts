import { TestBed } from '@angular/core/testing';

import { ReturnDetailsService } from './return-details.service';

describe('ReturnDetailsService', () => {
  let service: ReturnDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReturnDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
