import { TestBed } from '@angular/core/testing';

import { ReturnsFilterService } from './returns-filter.service';

describe('ReturnsFilterService', () => {
  let service: ReturnsFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReturnsFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
