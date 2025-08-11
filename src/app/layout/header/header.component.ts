import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatMenuModule, MatButtonModule, MatDividerModule, CommonModule],
  template: `
    <mat-toolbar color="primary" class="header-toolbar">
      <span class="title">Concessionárias Manager</span>

      <span class="spacer"></span>

      <button mat-icon-button [matMenuTriggerFor]="userMenu" aria-label="Menu usuário">
        <mat-icon>account_circle</mat-icon>
      </button>

      <mat-menu #userMenu="matMenu">
        <div class="user-info" mat-menu-item disabled>
          <p><strong>{{ user?.nome }}</strong></p>
          <p>{{ user?.email }}</p>
          <p><em>{{ user?.role }}</em></p>
        </div>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          <span>Sair</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }
    .title {
      font-weight: 600;
      font-size: 1.25rem;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .user-info p {
      margin: 0;
      line-height: 1.2;
      user-select: none;
    }
    mat-menu .mat-menu-content {
      padding-top: 8px !important;
      padding-bottom: 8px !important;
    }
  `]
})
export class HeaderComponent {
  constructor(private auth: AuthService) {}

  get user() {
    return this.auth.getUser();
  }

  logout() {
    this.auth.logout();
  }
}

