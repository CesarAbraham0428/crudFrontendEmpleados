export interface Empleado {
  ClaveEmpleado: string;
  Nombre: string;
  ApP: string;
  ApM: string;
  FechaNacimiento: string;
  RFC: string;
  Sexo: string;
  Departamento: string;
  Puesto: string;
  Telefono: string[];
  CorreoElectronico: string[];
  Password: string;
  Rol: string;
  CursoExterno: CursoExterno[];
  ActividadEmpresa: ActividadEmpresa[];
  ReferenciaFamiliar: ReferenciaFamiliar[];
  createdAt: string;
  updatedAt: string;
  Domicilio: Domicilio; 
}


export interface CursoExterno {
    Nombre: string;
    TipoCurso: string;
    FechaInicio: string;
    FechaFin: string;
  }
  
  enum EstatusActividad {
    NoPaticipo= 0,
    Participo = 1
  }

 export interface ActividadEmpresa {
    NombreActividad: string;
    Estatus: EstatusActividad;
  }
  export interface ReferenciaFamiliar {
    NombreFamiliar: string;
    Parentesco: string;
    Telefono: string[];
    CorreoElectronico: string;
  }
  
  export interface Domicilio {
    Calle: string;
    NumeroExterior: string;
    NumeroInterior: string;
    Colonia: string;
    CodigoPostal: string;
    Ciudad: string;
  }

  export interface CargaEmpleadoCursos {
    ClaveEmpleado: string;
    Nombre: string;
    selected?: boolean; 
  }
  