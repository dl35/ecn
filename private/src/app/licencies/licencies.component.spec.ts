import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenciesComponent } from './licencies.component';

describe('LicenciesComponent', () => {
  let component: LicenciesComponent;
  let fixture: ComponentFixture<LicenciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
