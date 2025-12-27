import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsForm } from './points-form';

describe('PointsForm', () => {
  let component: PointsForm;
  let fixture: ComponentFixture<PointsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointsForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
