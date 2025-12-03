import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarPortofolioComponent } from './modificar-portofolio.component';

describe('ModificarPortofolioComponent', () => {
  let component: ModificarPortofolioComponent;
  let fixture: ComponentFixture<ModificarPortofolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarPortofolioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarPortofolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
