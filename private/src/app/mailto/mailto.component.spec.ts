import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailtoComponent } from './mailto.component';

describe('MailtoComponent', () => {
  let component: MailtoComponent;
  let fixture: ComponentFixture<MailtoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailtoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
