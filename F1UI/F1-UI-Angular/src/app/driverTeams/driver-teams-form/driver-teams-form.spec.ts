import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverTeamsForm } from './driver-teams-form';

describe('DriverTeamsForm', () => {
  let component: DriverTeamsForm;
  let fixture: ComponentFixture<DriverTeamsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverTeamsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverTeamsForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
