import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface JobFilterPayload {
  modalidade: string;
  regime: string;
  fonte: string;
}

@Component({
  selector: 'app-job-filters',
  imports: [CommonModule, FormsModule],
  templateUrl: './job-filters.html',
  styleUrl: './job-filters.css',
})
export class JobFilters {
  @Input() modalidade!: string;
  @Input() regime!: string;
  @Input() fonte!: string;

  modalidades: string[] = ['TODAS', 'Home Office', 'Híbrido', 'Presencial'];
  regimes: string[] = ['TODOS', 'CLT', 'PJ', 'Estágio'];
  fontes: string[] = ['TODAS', 'LinkedIn', 'Gupy', 'Indeed', 'Revelo', 'Catho'];

  @Output() filtersChange = new EventEmitter<JobFilterPayload>();

  emit(): void {
    this.filtersChange.emit({
      modalidade: this.modalidade,
      regime: this.regime,
      fonte: this.fonte,
    });
  }

  clear(): void {
    this.filtersChange.emit({
      modalidade: 'TODAS',
      regime: 'TODOS',
      fonte: 'TODAS',
    });
  }
}
