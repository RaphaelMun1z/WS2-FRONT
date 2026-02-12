import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { JobCard } from './core/components/job-card/job-card';
import { debounceTime, switchMap, map, BehaviorSubject } from 'rxjs';
import { VagaService } from './core/services/vaga.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, JobCard],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private vagaService = inject(VagaService);

  showMobileFilters = signal(false);

  toggleMobileFilters() {
    this.showMobileFilters.update((v) => !v);
  }

  closeMobileFilters() {
    this.showMobileFilters.set(false);
  }

  searchTerm = signal('');
  searchEmpresa = signal('');
  selectedModalidade = signal('TODAS');
  selectedRegime = signal('TODOS');
  selectedFonte = signal('TODAS');

  currentPage = signal(0);
  pageSize = signal(12);

  vagas = signal<any[]>([]);
  totalElements = signal(0);
  totalPages = signal(0);
  isLoading = signal(false);

  isFiltering = computed(
    () =>
      this.searchTerm() !== '' ||
      this.selectedModalidade() !== 'TODAS' ||
      this.selectedRegime() !== 'TODOS' ||
      this.selectedFonte() !== 'TODAS',
  );

  private searchSubject = new BehaviorSubject<any>({
    termo: '',
    modalidade: 'TODAS',
    regime: 'TODOS',
    fonte: 'TODAS',
    empresa: '',
    page: 0,
  });

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(400),
        switchMap((params) => {
          this.isLoading.set(true);

          return this.vagaService.listarVagas(params, params.page, this.pageSize()).pipe(
            map((pageData) => {
              this.isLoading.set(false);
              return pageData;
            }),
          );
        }),
      )
      .subscribe((pageData) => {
        this.vagas.set(pageData.content);
        this.totalElements.set(pageData.page.totalElements);
        this.totalPages.set(pageData.page.totalPages);
      });
  }

  private triggerSearch() {
    this.searchSubject.next({
      termo: this.searchTerm(),
      modalidade: this.selectedModalidade(),
      regime: this.selectedRegime(),
      fonte: this.selectedFonte(),
      empresa: '',
      page: this.currentPage(),
    });
  }

  onSearchTermChange(termo: string) {
    this.searchTerm.set(termo);
    this.currentPage.set(0);
    this.triggerSearch();
  }

  onModalidadeChange(modalidade: string) {
    this.selectedModalidade.set(modalidade);
    this.currentPage.set(0);
    this.triggerSearch();
  }

  onRegimeChange(regime: string) {
    this.selectedRegime.set(regime);
    this.currentPage.set(0);
    this.triggerSearch();
  }

  onFonteChange(fonte: string) {
    this.selectedFonte.set(fonte);
    this.currentPage.set(0);
    this.triggerSearch();
  }

  changePage(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.currentPage.set(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.triggerSearch();
    }
  }

  resetFilters() {
    this.searchTerm.set('');
    this.selectedModalidade.set('TODAS');
    this.selectedRegime.set('TODOS');
    this.selectedFonte.set('TODAS');
    this.currentPage.set(0);
    this.showMobileFilters.set(false);
    this.triggerSearch();
  }

  getPageArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i);
  }

  showSuggestions = signal(false);

  suggestions: string[] = [
    'Desenvolvedor Frontend',
    'Desenvolvedor Backend',
    'Full Stack',
    'Angular',
    'React',
    'Java',
    'Spring Boot',
    'Node.js',
    'UX Designer',
    'DevOps',
    'Remoto',
    'Estágio',
  ];

  filteredSuggestions = signal<string[]>([]);

  openSuggestions() {
    const term = this.searchTerm().toLowerCase();

    if (!term) {
      this.showSuggestions.set(false);
      return;
    }

    this.filterSuggestions(term);
  }

  onSearchInput(value: string) {
    this.searchTerm.set(value);

    const term = value.toLowerCase();

    if (!term) {
      this.showSuggestions.set(false);
      return;
    }

    this.filterSuggestions(term);
  }

  private filterSuggestions(term: string) {
    const filtered = this.suggestions.filter((s) => s.toLowerCase().includes(term));

    this.filteredSuggestions.set(filtered);
    this.showSuggestions.set(filtered.length > 0);
  }

  selectSuggestion(value: string) {
    this.searchTerm.set(value);
    this.showSuggestions.set(false);
    this.currentPage.set(0);
    this.triggerSearch();
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-autocomplete')) {
      this.showSuggestions.set(false);
    }
  }
}
