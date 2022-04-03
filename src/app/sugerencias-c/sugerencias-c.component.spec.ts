import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SugerenciasCComponent } from './sugerencias-c.component';

describe('SugerenciasCComponent', () => {
  let component: SugerenciasCComponent;
  let fixture: ComponentFixture<SugerenciasCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SugerenciasCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SugerenciasCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
