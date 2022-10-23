import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailReturnTablePromotionEditComponent } from './detail-return-table-promotion-edit.component';

describe('DetailReturnTablePromotionEditComponent', () => {
  let component: DetailReturnTablePromotionEditComponent;
  let fixture: ComponentFixture<DetailReturnTablePromotionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailReturnTablePromotionEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailReturnTablePromotionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
