import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuSelectComponent } from './side-menu-select.component';

describe('SideMenuSelectComponent', () => {
  let component: SideMenuSelectComponent;
  let fixture: ComponentFixture<SideMenuSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideMenuSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideMenuSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
