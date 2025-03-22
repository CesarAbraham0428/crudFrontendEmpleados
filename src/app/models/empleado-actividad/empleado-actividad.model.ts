export interface EmpleadoActividad {
    id: number;
    actividad: string;
    ClaveEmpleado: string;
    NombreEmpleado: string;
    ActividadEmpresa:ActividadEmpresa[];
  }
 

 export interface ActividadEmpresa {
    NombreActividad: string;
    Estatus: number;
  }