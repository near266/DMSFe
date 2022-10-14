import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditDetailReturnComponent } from './view-edit-detail-return.component';

describe('ViewEditDetailReturnComponent', () => {
  let component: ViewEditDetailReturnComponent;
  let fixture: ComponentFixture<ViewEditDetailReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEditDetailReturnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEditDetailReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
