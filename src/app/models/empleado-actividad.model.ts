export interface EmpleadoActividad {
    id: number; // ID único del registro
    actividad: string; // Nombre de la actividad
    claveEmpleado: string; // Clave del empleado
    nombreEmpleado: string; // Nombre del empleado
    participacion: boolean; // Participación (true si participó, false si no)
  }
  