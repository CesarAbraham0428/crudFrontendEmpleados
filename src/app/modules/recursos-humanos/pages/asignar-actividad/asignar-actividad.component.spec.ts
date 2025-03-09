import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarActividadComponent } from './asignar-actividad.component';

describe('AsignarActividadComponent', () => {
  let component: AsignarActividadComponent;
  let fixture: ComponentFixture<AsignarActividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarActividadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
