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

    this.empleadoService.agregarCursoExterno(cursoData)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Curso ${this.editMode ? 'actualizado' : 'agregado'} correctamente`
          });
          setTimeout(() => {
            this.router.navigate(['empleado/cursos-externos-list']);
          }, 1500);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo agregar el curso externo: ' + (error.error?.details || error.message)
          });
          console.error('Error al agregar curso:', error);
        }
      });
  }

  cancelar(): void {
    this.router.navigate(['empleado/cursos-externos-list']);
  }
}