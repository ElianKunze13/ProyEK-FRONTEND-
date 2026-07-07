import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducacionComponent } from './educacion.component';
import { describe, beforeEach, it } from 'node:test';

describe('EducacionComponent', () => {
  let component: EducacionComponent;
  let fixture: ComponentFixture<EducacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
