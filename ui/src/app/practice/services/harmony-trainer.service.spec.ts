import { TestBed } from '@angular/core/testing';

import { HarmonyTrainerService } from './harmony-trainer.service';

describe('HarmonyTrainerService', () => {
  let service: HarmonyTrainerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HarmonyTrainerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
