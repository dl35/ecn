import { TestBed, inject } from '@angular/core/testing';

import { LicenciesService } from './licencies.service';

describe('LicenciesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LicenciesService]
    });
  });

  it('should be created', inject([LicenciesService], (service: LicenciesService) => {
    expect(service).toBeTruthy();
  }));
});
