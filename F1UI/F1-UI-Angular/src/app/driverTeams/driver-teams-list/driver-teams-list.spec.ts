import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverTeamsList } from './driver-teams-list';

describe('DriverTeamsList', () => {
  let component: DriverTeamsList;
  let fixture: ComponentFixture<DriverTeamsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverTeamsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverTeamsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
