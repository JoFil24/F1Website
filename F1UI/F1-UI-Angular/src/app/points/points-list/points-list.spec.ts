import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsList } from './points-list';

describe('PointsList', () => {
  let component: PointsList;
  let fixture: ComponentFixture<PointsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
