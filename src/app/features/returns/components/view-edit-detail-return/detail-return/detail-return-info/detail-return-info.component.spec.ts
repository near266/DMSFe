import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailReturnInfoComponent } from './detail-return-info.component';

describe('DetailReturnInfoComponent', () => {
  let component: DetailReturnInfoComponent;
  let fixture: ComponentFixture<DetailReturnInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailReturnInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailReturnInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
