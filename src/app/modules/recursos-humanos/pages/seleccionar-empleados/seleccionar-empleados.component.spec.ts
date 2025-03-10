import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarEmpleadosComponent } from './seleccionar-empleados.component';

describe('SeleccionarEmpleadosComponent', () => {
  let component: SeleccionarEmpleadosComponent;
  let fixture: ComponentFixture<SeleccionarEmpleadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionarEmpleadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionarEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
