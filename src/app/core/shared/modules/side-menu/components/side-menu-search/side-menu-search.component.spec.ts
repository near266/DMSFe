import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuSearchComponent } from './side-menu-search.component';

describe('SideMenuSearchComponent', () => {
  let component: SideMenuSearchComponent;
  let fixture: ComponentFixture<SideMenuSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideMenuSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideMenuSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
