import { TestBed, inject } from '@angular/core/testing';

import { CotationService } from './cotation.service';

describe('CotationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CotationService]
    });
  });

  it('should be created', inject([CotationService], (service: CotationService) => {
    expect(service).toBeTruthy();
  }));
});
