import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLancamentoComponent } from './form-lancamento.component';

describe('FormLancamentoComponent', () => {
  let component: FormLancamentoComponent;
  let fixture: ComponentFixture<FormLancamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLancamentoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormLancamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
