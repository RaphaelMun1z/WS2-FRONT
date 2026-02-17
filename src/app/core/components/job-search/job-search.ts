import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './job-search.html',
  styleUrl: './job-search.css',
})
export class JobSearch {
  @Input() value: string = '';
  @Output() search = new EventEmitter<string>();

  term: string = '';
  showSuggestions = false;

  suggestions: string[] = [
    'Desenvolvedor Frontend',
    'Desenvolvedor Backend',
    'Full Stack',
    'Java',
    'Angular',
    'React',
    'Node.js',
    'UX/UI Designer',
  ];

  filteredSuggestions: string[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.term = this.value;
    }
  }

  onInput() {
    const value = this.term.toLowerCase().trim();

    if (!value) {
      this.showSuggestions = false;
      return;
    }

    this.filteredSuggestions = this.suggestions.filter((s) => s.toLowerCase().includes(value));

    this.showSuggestions = this.filteredSuggestions.length > 0;
  }

  selectSuggestion(value: string) {
    this.term = value;
    this.showSuggestions = false;
    this.search.emit(value);
  }

  submit() {
    this.showSuggestions = false;
    this.search.emit(this.term.trim());
  }
}
