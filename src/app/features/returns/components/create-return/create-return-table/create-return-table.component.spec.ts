import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReturnTableComponent } from './create-return-table.component';

describe('CreateReturnTableComponent', () => {
  let component: CreateReturnTableComponent;
  let fixture: ComponentFixture<CreateReturnTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateReturnTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReturnTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
