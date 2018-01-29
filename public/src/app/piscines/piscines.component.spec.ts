import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PiscinesComponent } from './piscines.component';

describe('PiscinesComponent', () => {
  let component: PiscinesComponent;
  let fixture: ComponentFixture<PiscinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PiscinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiscinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
