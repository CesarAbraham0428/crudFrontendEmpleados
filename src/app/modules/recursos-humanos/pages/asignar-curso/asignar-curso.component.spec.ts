import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarCursoComponent } from './asignar-curso.component';

describe('AsignarCursoComponent', () => {
  let component: AsignarCursoComponent;
  let fixture: ComponentFixture<AsignarCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarCursoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
