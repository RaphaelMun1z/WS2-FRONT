import { Component, inject, signal } from '@angular/core';
import { BehaviorSubject, debounceTime, switchMap, map, catchError, of } from 'rxjs';
import { VagaService } from '../../services/vaga.service';
import { CommonModule } from '@angular/common';
import { JobCard } from '../../components/job-card/job-card';
import { JobSearch } from '../../components/job-search/job-search';
import { JobPagination } from '../../components/job-pagination/job-pagination';
import { JobFilters } from '../../components/job-filters/job-filters';

@Component({
  selector: 'app-jobs-page',
  imports: [CommonModule, JobCard, JobFilters, JobSearch, JobPagination],
  templateUrl: './jobs-page.html',
  styleUrl: './jobs-page.css',
})
export class JobsPage {
  private vagaService = inject(VagaService);

  searchTerm = signal('');
  modalidade = signal('TODAS');
  regime = signal('TODOS');
  fonte = signal('TODAS');

  currentPage = signal(0);
  pageSize = signal(12);

  vagas = signal<any[]>([]);
  totalElements = signal(0);
  totalPages = signal(0);

  isLoading = signal(false);
  hasError = signal(false);
  isEmpty = signal(false);

  private searchSubject = new BehaviorSubject<any>({
    termo: '',
    modalidade: 'TODAS',
    regime: 'TODOS',
    fonte: 'TODAS',
    page: 0,
  });

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(400),
        switchMap((params) => {
          this.isLoading.set(true);
          this.hasError.set(false);
          this.isEmpty.set(false);

          return this.vagaService.listarVagas(params, params.page, this.pageSize()).pipe(
            catchError((error) => {
              this.isLoading.set(false);

              if (error.tipo === 'SERVIDOR_OFFLINE') {
                this.hasError.set(true);
              }

              return of(null);
            }),
            map((res) => {
              this.isLoading.set(false);
              return res;
            }),
          );
        }),
      )
      .subscribe((res) => {
        if (!res) return;

        this.vagas.set(res.content);
        this.totalElements.set(res.page.totalElements);
        this.totalPages.set(res.page.totalPages);

        this.isEmpty.set(res.content.length === 0);
      });

    this.triggerSearch();
  }

  triggerSearch() {
    this.searchSubject.next({
      termo: this.searchTerm(),
      modalidade: this.modalidade(),
      regime: this.regime(),
      fonte: this.fonte(),
      page: this.currentPage(),
    });
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
    this.currentPage.set(0);
    this.triggerSearch();
  }

  onFiltersChange(filters: any) {
    this.modalidade.set(filters.modalidade);
    this.regime.set(filters.regime);
    this.fonte.set(filters.fonte);
    this.currentPage.set(0);
    this.triggerSearch();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.triggerSearch();
  }

  resetBusca() {
    this.searchTerm.set('');
    this.modalidade.set('TODAS');
    this.regime.set('TODOS');
    this.fonte.set('TODAS');
    this.currentPage.set(0);

    this.triggerSearch();
  }
}
