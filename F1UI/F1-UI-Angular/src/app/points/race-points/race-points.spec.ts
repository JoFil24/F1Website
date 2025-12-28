import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RacePoints } from './race-points';

describe('RacePoints', () => {
  let component: RacePoints;
  let fixture: ComponentFixture<RacePoints>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RacePoints]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RacePoints);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
