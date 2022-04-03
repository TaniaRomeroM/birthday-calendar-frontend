import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactosCComponent } from './contactos-c.component';

describe('ContactosCComponent', () => {
  let component: ContactosCComponent;
  let fixture: ComponentFixture<ContactosCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactosCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactosCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
