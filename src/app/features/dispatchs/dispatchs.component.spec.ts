import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchsComponent } from './dispatchs.component';

describe('DispatchsComponent', () => {
  let component: DispatchsComponent;
  let fixture: ComponentFixture<DispatchsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
