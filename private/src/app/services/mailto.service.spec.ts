import { TestBed, inject } from '@angular/core/testing';

import { MailtoService } from './mailto.service';

describe('MailtoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MailtoService]
    });
  });

  it('should be created', inject([MailtoService], (service: MailtoService) => {
    expect(service).toBeTruthy();
  }));
});
