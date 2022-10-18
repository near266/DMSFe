import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReturnPromotionTableComponent } from './create-return-promotion-table.component';

describe('CreateReturnPromotionTableComponent', () => {
  let component: CreateReturnPromotionTableComponent;
  let fixture: ComponentFixture<CreateReturnPromotionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateReturnPromotionTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReturnPromotionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
