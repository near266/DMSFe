import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationRouterComponent } from './location-router.component';

describe('LocationRouterComponent', () => {
  let component: LocationRouterComponent;
  let fixture: ComponentFixture<LocationRouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationRouterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
