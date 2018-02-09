import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogengagementComponent } from './dialogengagement.component';

describe('DialogengagementComponent', () => {
  let component: DialogengagementComponent;
  let fixture: ComponentFixture<DialogengagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogengagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogengagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
