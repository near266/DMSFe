import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteTreeViewComponent } from './route-tree-view.component';

describe('RouteTreeViewComponent', () => {
  let component: RouteTreeViewComponent;
  let fixture: ComponentFixture<RouteTreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteTreeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
