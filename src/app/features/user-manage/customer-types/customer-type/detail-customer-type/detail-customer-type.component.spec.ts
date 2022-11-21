import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCustomerTypeComponent } from './detail-customer-type.component';

describe('DetailCustomerTypeComponent', () => {
  let component: DetailCustomerTypeComponent;
  let fixture: ComponentFixture<DetailCustomerTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailCustomerTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCustomerTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
