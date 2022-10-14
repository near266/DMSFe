import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InforRouterComponent } from './infor-router.component';

describe('InforRouterComponent', () => {
  let component: InforRouterComponent;
  let fixture: ComponentFixture<InforRouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InforRouterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InforRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
