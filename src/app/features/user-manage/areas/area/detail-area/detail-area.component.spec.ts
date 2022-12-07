import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAreaComponent } from './detail-area.component';

describe('DetailAreaComponent', () => {
  let component: DetailAreaComponent;
  let fixture: ComponentFixture<DetailAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
