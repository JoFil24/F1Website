import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RacesForm } from './races-form';

describe('RacesForm', () => {
  let component: RacesForm;
  let fixture: ComponentFixture<RacesForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RacesForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RacesForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
