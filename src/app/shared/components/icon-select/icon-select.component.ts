import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { LISTA_ICONES, getNomeExibicaoIcone } from '../../constants/icones.constant';

@Component({
  selector: 'app-icon-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './icon-select.component.html',
  styleUrls: ['./icon-select.component.css']
})
export class IconSelectComponent {
  @Input({ required: true }) parentForm!: FormGroup;
  @Input() controlName: string = 'icone';

  readonly listaIcones = LISTA_ICONES;
  readonly getNomeExibicaoIcone = getNomeExibicaoIcone;

  get valorSelecionado(): string {
    return this.parentForm.get(this.controlName)?.value || 'label';
  }
}