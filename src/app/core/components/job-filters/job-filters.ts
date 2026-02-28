import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface JobFilterPayload {
  modalidade: string;
  regime: string;
  fonte: string;
}

interface FonteOption {
  label: string;
  value: string;
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
  fontes: FonteOption[] = [
    { label: 'Todas', value: 'TODAS' },
    { label: 'Catho', value: 'Catho' },
    { label: 'Glassdoor', value: 'Glassdoor' },
    { label: 'Indeed', value: 'Indeed' },
    { label: 'InfoJobs', value: 'InfoJobs' },
    { label: 'Nerdin', value: 'Nerdin' },
  ];

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
