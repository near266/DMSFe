import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderRecycleComponent } from './header-recycle.component';

describe('HeaderRecycleComponent', () => {
  let component: HeaderRecycleComponent;
  let fixture: ComponentFixture<HeaderRecycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderRecycleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderRecycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
