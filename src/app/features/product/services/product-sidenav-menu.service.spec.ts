import { TestBed } from '@angular/core/testing';

import { ProductSidenavMenuService } from './product-sidenav-menu.service';

describe('ProductSidenavMenuService', () => {
  let service: ProductSidenavMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductSidenavMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
