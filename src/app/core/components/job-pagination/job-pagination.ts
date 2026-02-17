import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-job-pagination',
  imports: [CommonModule],
  templateUrl: './job-pagination.html',
  styleUrl: './job-pagination.css',
})
export class JobPagination {
  @Input() currentPage = 0;
  @Input() totalPages = 0;
  @Output() pageChange = new EventEmitter<number>();

  get pages() {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  change(page: number) {
    this.pageChange.emit(page);
  }
}
