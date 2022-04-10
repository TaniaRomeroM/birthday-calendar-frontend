import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiestasIdCComponent } from './fiestas-id-c.component';

describe('FiestasIdCComponent', () => {
  let component: FiestasIdCComponent;
  let fixture: ComponentFixture<FiestasIdCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiestasIdCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiestasIdCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
