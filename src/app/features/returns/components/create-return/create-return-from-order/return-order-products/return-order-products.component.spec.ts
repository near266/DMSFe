import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnOrderProductsComponent } from './return-order-products.component';

describe('ReturnOrderProductsComponent', () => {
  let component: ReturnOrderProductsComponent;
  let fixture: ComponentFixture<ReturnOrderProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnOrderProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnOrderProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
