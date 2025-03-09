import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-cursos-internos-list',
  standalone: true,
  imports: [TableModule],
  templateUrl: './cursos-internos-list.component.html',
  styleUrl: './cursos-internos-list.component.scss'
})
export class CursosInternosListComponent {

}
