import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnOrderPromotionComponent } from './return-order-promotion.component';

describe('ReturnOrderPromotionComponent', () => {
  let component: ReturnOrderPromotionComponent;
  let fixture: ComponentFixture<ReturnOrderPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnOrderPromotionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnOrderPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
