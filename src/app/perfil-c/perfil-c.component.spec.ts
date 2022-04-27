import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilCComponent } from './perfil-c.component';

describe('PerfilCComponent', () => {
  let component: PerfilCComponent;
  let fixture: ComponentFixture<PerfilCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
