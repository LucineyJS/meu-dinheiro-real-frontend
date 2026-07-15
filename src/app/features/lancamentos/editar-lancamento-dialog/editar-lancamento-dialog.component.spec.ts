import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarLancamentoDialogComponent } from './editar-lancamento-dialog.component';

describe('EditarLancamentoDialogComponent', () => {
  let component: EditarLancamentoDialogComponent;
  let fixture: ComponentFixture<EditarLancamentoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarLancamentoDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarLancamentoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
