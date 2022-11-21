import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailChannelComponent } from './detail-channel.component';

describe('DetailChannelComponent', () => {
  let component: DetailChannelComponent;
  let fixture: ComponentFixture<DetailChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailChannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
