import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="home-content">
      <h1>Concessionárias Manager</h1>
      <p>Bem-vindo ao sistema de gerenciamento de concessionárias.</p>
    </section>
  `,
  styles: [`
    .home-content {
      padding: 24px;
      max-width: 900px;
      margin: 0 auto;
      text-align: center;
    }
    h1 {
      font-weight: 700;
      margin-bottom: 16px;
    }
    p {
      font-size: 1.2rem;
      color: #666;
    }
  `]
})
export class HomeComponent {}
