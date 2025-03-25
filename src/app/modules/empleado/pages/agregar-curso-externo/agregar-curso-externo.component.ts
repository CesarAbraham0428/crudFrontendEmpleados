import { Documento } from '../../../../models/cargarDatos/cargarDatos';
import { EmpleadoService } from '../../../../core/services/empleado/empleado.service';
import { CargaDatosService } from '../../../../core/services/cargaDatos/carga-datos.service';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { AutoCompleteModule } from 'primeng/autocomplete';

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
    FloatLabel,
    AutoCompleteModule,
    FormsModule
  ],
  templateUrl: './agregar-curso-externo.component.html',
  styleUrls: ['./agregar-curso-externo.component.scss'],
  providers: [MessageService]
})
export class AgregarCursoExternoComponent implements OnInit {
  formulario: FormGroup;
  tipoDocumentoSeleccionado: any;
  filteredItemsTipoDocumento: any[] = [];

  minDate: Date = new Date(1900, 0, 1);
  editMode: boolean = false;
  cursoId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private empleadoService: EmpleadoService,
    private messageService: MessageService,
    private cargaDatosService: CargaDatosService
  ) {
    this.formulario = this.fb.group({
      nombreCurso: ['', [Validators.required, Validators.minLength(3)]],
      fechaInicio: ['', Validators.required],
      fechaFinalizacion: ['', [Validators.required]],
      tipoCurso: ['', Validators.required]
    }, { validator: this.validarFechas });

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

  ngOnInit(): void {
      this.cargaDatosService.getTipoDocumento().subscribe(data => {
            if (data && data.tipodocumento) {
              this.filteredItemsTipoDocumento = data.tipodocumento.map((item:Documento) => ({
                label: item.TipoDocumento,
                value: item.TipoDocumento
              }));
            } else {
              console.error('La respuesta del backend no tiene la estructura esperada:', data);
            }
          });  
  }

  validarFechas(group: FormGroup): ValidationErrors | null {
    const inicio = group.get('fechaInicio')?.value;
    const fin = group.get('fechaFinalizacion')?.value;
  
    if (inicio && fin) {
      const inicioDate = new Date(inicio);
      const finDate = new Date(fin);
      
      if (finDate < inicioDate) {
        group.get('fechaFinalizacion')?.setErrors({ fechaInvalida: true });
        return { fechaInvalida: true };
      }
    }
    
    group.get('fechaFinalizacion')?.setErrors(null);
    return null;
  }
  
  filterItemsTipoDocumento(event: any) {
    const query = event.query.toLowerCase();
    this.filteredItemsTipoDocumento = this.filteredItemsTipoDocumento.filter(item =>
      item.label.toLowerCase().includes(query)
    );
  }

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