import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarHerramientasComponent } from './editar-herramientas.component';

describe('EditarHerramientasComponent', () => {
  let component: EditarHerramientasComponent;
  let fixture: ComponentFixture<EditarHerramientasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarHerramientasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarHerramientasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
