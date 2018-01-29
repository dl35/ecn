import { TestBed, inject } from '@angular/core/testing';

import { Top10Service } from './top10.service';

describe('Top10Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Top10Service]
    });
  });

  it('should be created', inject([Top10Service], (service: Top10Service) => {
    expect(service).toBeTruthy();
  }));
});
