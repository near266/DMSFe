import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSidenavMenuComponent } from './product-sidenav-menu.component';

describe('ProductSidenavMenuComponent', () => {
  let component: ProductSidenavMenuComponent;
  let fixture: ComponentFixture<ProductSidenavMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSidenavMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSidenavMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
