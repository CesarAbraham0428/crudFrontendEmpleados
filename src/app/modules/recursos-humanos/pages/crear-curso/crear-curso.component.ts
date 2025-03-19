import { Component,OnInit } from '@angular/core';
import { CargaDatosService } from '../../../../core/services/cargaDatos/carga-datos.service';
import { EmpleadoService } from '../../../../core/services/empleado/empleado.service';
import { Curso,Documento} from '../../../../models/cargarDatos/cargarDatos';
import { CargaEmpleadoCursos} from '../../../../models/empleado/empleado';
import { RecursosHumanosService } from '../../../../core/services/recursos-humanos/recursos-humanos.service';


//Importaciones de PrimeNG
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { DividerModule } from 'primeng/divider';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SeleccionarEmpleadosComponent } from '../seleccionar-empleados/seleccionar-empleados.component';




@Component({
  selector: 'app-crear-curso',
  standalone: true,
  imports: [KeyFilterModule,InputTextModule,PanelModule,CardModule,FieldsetModule,DatePickerModule,ButtonModule,FloatLabelModule,AutoCompleteModule,DividerModule,SkeletonModule,TableModule,FormsModule],
  providers:[DialogService,DynamicDialogRef],
  templateUrl: './crear-curso.component.html',
  styleUrl: './crear-curso.component.scss'
})
export class CrearCursoComponent implements OnInit {
  puestoSeleccionado: any; // Valor seleccionado en el autocompletado
  cursosSeleccionados: any;
  tipoDocumentoSeleccionado: any;
  Seleccionado: any; // Valor seleccionado en el autocompletado
  filteredItems: any[] = []; // Lista filtrada
  display: boolean = false;
  ref: DynamicDialogRef | undefined;
  empleadosSeleccionados: any[] = []; // Aquí se guardan los empleados seleccionados
  filteredItemsCursos: any[] = [];
  filteredItemsTipoDocumento: any[] = [];
  empleados: CargaEmpleadoCursos[] = [];
    // Definir las propiedades para las fechas
    fechaInicio: Date | null = null;
    fechaTermino: Date | null = null;
    
  constructor(private router: Router,public dialogService: DialogService,private empleadoService: EmpleadoService, private cargaDatosService: CargaDatosService,private recursosHumanosServices:RecursosHumanosService) {}



  ngOnInit() {

    this.cargaDatosService.getCurso().subscribe(data => {
      if (data && data.nombrecurso) {
        this.filteredItemsCursos = data.nombrecurso.map((item:Curso) => ({
          label: item.NombreCurso,
          value: item.NombreCurso
        }));
      } else {
        console.error('La respuesta del backend no tiene la estructura esperada:', data);
      }
    });


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
  
  filterItemsCursos(event: any) {
    const query = event.query.toLowerCase();
    this.filteredItemsCursos = this.filteredItemsCursos.filter(item =>
      item.label.toLowerCase().includes(query)
    );
  }

  filterItemsTipoDocumento(event: any) {
    const query = event.query.toLowerCase();
    this.filteredItemsTipoDocumento = this.filteredItemsTipoDocumento.filter(item =>
      item.label.toLowerCase().includes(query)
    );
  }
  
  redirigir() {
    this.router.navigate(['recursos-humanos/cursos-internos']);
}

showDialog() {
  this.display = true; 
}
abrirDialogo() {
    this.ref = this.dialogService.open(SeleccionarEmpleadosComponent, {
      header: 'Seleccionar Empleados',
      width: '50%',
      data: { empleadosSeleccionados: this.empleadosSeleccionados } // Pasamos los datos de empleados seleccionados al diálogo
    });

    this.ref.onClose.subscribe((empleados: any[]) => {
      if (empleados) {
        this.empleadosSeleccionados = empleados;
        console.log('Empleados seleccionados:', this.empleadosSeleccionados);
      }
    });
  }


  guardarCurso() {
    if (!this.empleadosSeleccionados || !Array.isArray(this.empleadosSeleccionados)) {
      console.error("Error: empleadosSeleccionados no está definido o no es un array");
      return;
    }
  
    const nuevoCurso = {
      actividad: this.cursosSeleccionados,
      tipoDocumento: this.tipoDocumentoSeleccionado,
      fechaInicio: this.fechaInicio,
      fechaTermino: this.fechaTermino,
      empleados: this.empleadosSeleccionados.map(emp => ({ ClaveEmpleado: emp.ClaveEmpleado })) 
    };
  
    console.log("Guardando curso:", nuevoCurso);
  
    this.recursosHumanosServices.guardarCurso(nuevoCurso).subscribe(
      response => {
        console.log("Curso guardado con éxito", response);
        this.limpiarFormulario();
      },
      error => {
        console.error("Error al guardar el curso", error);
      }
    );
  }
  
  limpiarFormulario() {
   
    this.cursosSeleccionados = null;
    this.tipoDocumentoSeleccionado = null;
    this.fechaInicio = null;
    this.fechaTermino = null;
    this.empleadosSeleccionados = [];
  }
}

