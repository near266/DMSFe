import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailReturnTableEditComponent } from './detail-return-table-edit.component';

describe('DetailReturnTableEditComponent', () => {
  let component: DetailReturnTableEditComponent;
  let fixture: ComponentFixture<DetailReturnTableEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailReturnTableEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailReturnTableEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
