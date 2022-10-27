import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnsSidenavComponent } from './returns-sidenav.component';

describe('ReturnsSidenavComponent', () => {
  let component: ReturnsSidenavComponent;
  let fixture: ComponentFixture<ReturnsSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnsSidenavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnsSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
