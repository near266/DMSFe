import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSidenavComponent } from './product-sidenav.component';

describe('ProductSidenavComponent', () => {
  let component: ProductSidenavComponent;
  let fixture: ComponentFixture<ProductSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSidenavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
