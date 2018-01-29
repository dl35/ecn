import { TestBed, inject } from '@angular/core/testing';

import { CompetitionsService } from './competitions.service';

describe('CompetitionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompetitionsService]
    });
  });

  it('should be created', inject([CompetitionsService], (service: CompetitionsService) => {
    expect(service).toBeTruthy();
  }));
});
