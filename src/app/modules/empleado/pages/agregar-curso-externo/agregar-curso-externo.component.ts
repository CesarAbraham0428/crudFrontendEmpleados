import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpleadoService } from '../../../../core/services/empleado/empleado.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-agregar-curso-externo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    ToastModule,
    SelectModule,
    DatePickerModule,
  ],
  templateUrl: './agregar-curso-externo.component.html',
  styleUrls: ['./agregar-curso-externo.component.scss'],
  providers: [MessageService]
})
export class AgregarCursoExternoComponent implements OnInit {
  formulario: FormGroup;
  tiposCurso: any[] = [
    { label: 'Online', value: 'online' },
    { label: 'Presencial', value: 'presencial' }
  ];
  minDate: Date = new Date();
  editMode: boolean = false;
  cursoId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private empleadoService: EmpleadoService,
    private messageService: MessageService
  ) {
    this.formulario = this.fb.group({
      nombreCurso: ['', [Validators.required, Validators.minLength(3)]],
      fechaInicio: ['', Validators.required],
      fechaFinalizacion: ['', Validators.required],
      tipoCurso: ['', Validators.required]
    });

    // Verificar si hay datos para edición
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { curso?: any };
    if (state?.curso) {
      this.editMode = true;
      this.cursoId = state.curso._id;
      this.formulario.patchValue({
        nombreCurso: state.curso.Nombre,
        tipoCurso: state.curso.TipoCurso,
        fechaInicio: new Date(state.curso.FechaInicio),
        fechaFinalizacion: new Date(state.curso.FechaFin)
      });
    }
  }

  ngOnInit(): void {}

  guardarCurso(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor, complete todos los campos requeridos'
      });
      return;
    }

    const cursoData = {
      Nombre: this.formulario.get('nombreCurso')?.value,
      TipoCurso: this.formulario.get('tipoCurso')?.value,
      FechaInicio: this.formulario.get('fechaInicio')?.value.toISOString().split('T')[0],
      FechaFin: this.formulario.get('fechaFinalizacion')?.value.toISOString().split('T')[0]
    };

    if (this.editMode && this.cursoId) {
      this.empleadoService.actualizarCursoExterno(this.cursoId, cursoData)
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Curso actualizado correctamente'
            });
            setTimeout(() => {
              this.router.navigate(['empleado/cursos-externos-list']);
            }, 1500);
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo actualizar el curso: ' + (error.error?.details || error.message)
            });
          }
        });
    } else {
      this.empleadoService.agregarCursoExterno(cursoData)
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Curso agregado correctamente'
            });
            setTimeout(() => {
              this.router.navigate(['empleado/cursos-externos-list']);
            }, 1500);
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo agregar el curso: ' + (error.error?.details || error.message)
            });
          }
        });
    }
  }

  cancelar(): void {
    this.router.navigate(['empleado/cursos-externos-list']);
  }
}