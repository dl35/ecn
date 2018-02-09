import { TestBed, inject } from '@angular/core/testing';

import { EngagementsService } from './engagements.service';

describe('EngagagementsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EngagementsService]
    });
  });

  it('should be created', inject([EngagementsService], (service: EngagementsService) => {
    expect(service).toBeTruthy();
  }));
});
