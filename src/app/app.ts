import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, CommonModule, MatNativeDateModule],
  template: `
    <ng-container *ngIf="auth.isLoggedIn(); else loginPage">
      <app-header></app-header>
      <app-sidebar></app-sidebar>
      <div class="content">
        <router-outlet></router-outlet>
      </div>
    </ng-container>

    <ng-template #loginPage>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      margin: 0;
    }
    app-header {
      flex-shrink: 0;
    }
    app-sidebar {
      flex-shrink: 0;
    }
    .content {
      margin-top: 64px;
      margin-left: 240px;
      padding: 24px;
      height: calc(100vh - 64px);
      overflow-y: auto;
    }
  `]
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}
