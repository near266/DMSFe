import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailReturnTableComponent } from './detail-return-table.component';

describe('DetailReturnTableComponent', () => {
  let component: DetailReturnTableComponent;
  let fixture: ComponentFixture<DetailReturnTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailReturnTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailReturnTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
