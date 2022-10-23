import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRouteComponent } from './change-route.component';

describe('ChangeRouteComponent', () => {
  let component: ChangeRouteComponent;
  let fixture: ComponentFixture<ChangeRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
