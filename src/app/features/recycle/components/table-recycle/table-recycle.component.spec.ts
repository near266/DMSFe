import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRecycleComponent } from './table-recycle.component';

describe('TableRecycleComponent', () => {
  let component: TableRecycleComponent;
  let fixture: ComponentFixture<TableRecycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableRecycleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableRecycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
