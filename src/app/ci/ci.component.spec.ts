import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CIComponent } from './ci.component';

describe('CIComponent', () => {
  let component: CIComponent;
  let fixture: ComponentFixture<CIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
