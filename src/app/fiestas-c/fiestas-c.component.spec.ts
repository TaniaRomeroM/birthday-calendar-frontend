import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiestasCComponent } from './fiestas-c.component';

describe('FiestasCComponent', () => {
  let component: FiestasCComponent;
  let fixture: ComponentFixture<FiestasCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiestasCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiestasCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
