// pipes/fecha.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoFecha',
  standalone: true
})
export class FormatoFechaPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';
    
    const fecha = new Date(value);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}