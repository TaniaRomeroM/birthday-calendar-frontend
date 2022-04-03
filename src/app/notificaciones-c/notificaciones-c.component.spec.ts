import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesCComponent } from './notificaciones-c.component';

describe('NotificacionesCComponent', () => {
  let component: NotificacionesCComponent;
  let fixture: ComponentFixture<NotificacionesCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificacionesCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacionesCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
