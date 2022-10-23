import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReturnFromOrderComponent } from './create-return-from-order.component';

describe('CreateReturnFromOrderComponent', () => {
  let component: CreateReturnFromOrderComponent;
  let fixture: ComponentFixture<CreateReturnFromOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateReturnFromOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReturnFromOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
