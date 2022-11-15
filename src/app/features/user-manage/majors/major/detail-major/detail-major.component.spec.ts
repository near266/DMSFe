import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMajorComponent } from './detail-major.component';

describe('DetailMajorComponent', () => {
  let component: DetailMajorComponent;
  let fixture: ComponentFixture<DetailMajorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailMajorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailMajorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
