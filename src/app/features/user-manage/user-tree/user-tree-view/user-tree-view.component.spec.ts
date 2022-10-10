import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTreeViewComponent } from './user-tree-view.component';

describe('UserTreeViewComponent', () => {
  let component: UserTreeViewComponent;
  let fixture: ComponentFixture<UserTreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTreeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
