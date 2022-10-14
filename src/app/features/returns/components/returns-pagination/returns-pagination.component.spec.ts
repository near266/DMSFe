import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnsPaginationComponent } from './returns-pagination.component';

describe('ReturnsPaginationComponent', () => {
  let component: ReturnsPaginationComponent;
  let fixture: ComponentFixture<ReturnsPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnsPaginationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnsPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
