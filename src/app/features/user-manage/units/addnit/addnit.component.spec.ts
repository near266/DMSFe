import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnitComponent } from './addnit.component';

describe('AddnitComponent', () => {
  let component: AddnitComponent;
  let fixture: ComponentFixture<AddnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
