import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCustomerGroupComponent } from './detail-customer-group.component';

describe('DetailCustomerGroupComponent', () => {
  let component: DetailCustomerGroupComponent;
  let fixture: ComponentFixture<DetailCustomerGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailCustomerGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCustomerGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
