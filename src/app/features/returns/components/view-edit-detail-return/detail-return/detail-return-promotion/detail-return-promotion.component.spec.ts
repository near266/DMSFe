import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailReturnPromotionComponent } from './detail-return-promotion.component';

describe('DetailReturnPromotionComponent', () => {
  let component: DetailReturnPromotionComponent;
  let fixture: ComponentFixture<DetailReturnPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailReturnPromotionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailReturnPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
