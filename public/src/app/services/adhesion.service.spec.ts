import { TestBed, inject } from '@angular/core/testing';

import { AdhesionService } from './adhesion.service';

describe('AdhesionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdhesionService]
    });
  });

  it('should be created', inject([AdhesionService], (service: AdhesionService) => {
    expect(service).toBeTruthy();
  }));
});
