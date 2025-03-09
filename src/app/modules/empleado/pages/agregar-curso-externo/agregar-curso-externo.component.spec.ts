import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarCursoExternoComponent } from './agregar-curso-externo.component';

describe('AgregarCursoExternoComponent', () => {
  let component: AgregarCursoExternoComponent;
  let fixture: ComponentFixture<AgregarCursoExternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarCursoExternoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarCursoExternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
