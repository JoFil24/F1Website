import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracksForm } from './tracks-form';

describe('TracksForm', () => {
  let component: TracksForm;
  let fixture: ComponentFixture<TracksForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TracksForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TracksForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
