import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoNewCustomerComponent } from './photo-new-customer.component';

describe('PhotoNewCustomerComponent', () => {
  let component: PhotoNewCustomerComponent;
  let fixture: ComponentFixture<PhotoNewCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotoNewCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoNewCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
