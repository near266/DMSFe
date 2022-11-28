import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuDateComponent } from './side-menu-date.component';

describe('SideMenuDateComponent', () => {
  let component: SideMenuDateComponent;
  let fixture: ComponentFixture<SideMenuDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideMenuDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideMenuDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
