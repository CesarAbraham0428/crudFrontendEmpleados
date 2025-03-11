export interface Empleado {
  _id: string;
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
  __v: number;
  Domicilio: Domicilio;
}


interface CursoExterno {
    Nombre: string;
    TipoCurso: string;
    FechaInicio: string;
    FechaFin: string;
    _id: string;
  }
  
  interface ActividadEmpresa {
    NombreActividad: string;
    Estatus: number;
    _id: string;
  }
  
  interface ReferenciaFamiliar {
    NombreFamiliar: string;
    Parentesco: string;
    Telefono: string[];
    CorreoElectronico: string;
    _id: string;
  }
  
  interface Domicilio {
    Calle: string;
    NumeroExterior: string;
    NumeroInterior: string;
    Colonia: string;
    CodigoPostal: string;
    Ciudad: string;
  }