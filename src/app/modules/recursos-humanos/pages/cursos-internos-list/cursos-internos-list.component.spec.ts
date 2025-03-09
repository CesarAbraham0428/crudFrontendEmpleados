import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosInternosListComponent } from './cursos-internos-list.component';

describe('CursosInternosListComponent', () => {
  let component: CursosInternosListComponent;
  let fixture: ComponentFixture<CursosInternosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursosInternosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursosInternosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
