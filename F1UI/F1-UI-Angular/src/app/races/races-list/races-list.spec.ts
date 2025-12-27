import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RacesList } from './races-list';

describe('RacesList', () => {
  let component: RacesList;
  let fixture: ComponentFixture<RacesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RacesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RacesList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
