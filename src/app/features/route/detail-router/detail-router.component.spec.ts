import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRouterComponent } from './detail-router.component';

describe('DetailRouterComponent', () => {
  let component: DetailRouterComponent;
  let fixture: ComponentFixture<DetailRouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailRouterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
