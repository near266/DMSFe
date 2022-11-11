import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTimekeepingComponent } from './report-timekeeping.component';

describe('ReportTimekeepingComponent', () => {
  let component: ReportTimekeepingComponent;
  let fixture: ComponentFixture<ReportTimekeepingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTimekeepingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTimekeepingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
