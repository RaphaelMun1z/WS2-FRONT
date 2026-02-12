import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Vaga } from '../../models/vaga.models';

@Component({
  selector: 'app-job-card',
  imports: [CommonModule],
  templateUrl: './job-card.html',
  styleUrl: './job-card.css',
})
export class JobCard {
  @Input() vaga!: Vaga;

  isValid(value: string | null | undefined): boolean {
    return !!value && value.trim() !== '' && value !== 'N/A';
  }

  getNomeEmpresa(): string {
    return this.isValid(this.vaga.empresa) ? this.vaga.empresa : 'Empresa Confidencial';
  }

  getFonteImage(): string {
    if (!this.vaga.fonte) return 'not_found.webp';

    const nomeLimpo = this.vaga.fonte.toLowerCase().trim().replace(/\s+/g, '');
    return `${nomeLimpo}.webp`;
  }

  handleImageError(event: any) {
    event.target.src = 'not_found.webp';
  }

  getResumoDescricao(): string {
    if (!this.isValid(this.vaga.descricao)) {
      return 'Confira os detalhes completos clicando no botão abaixo.';
    }
    return this.vaga.descricao.length > 150
      ? this.vaga.descricao.substring(0, 150) + '...'
      : this.vaga.descricao;
  }
}
