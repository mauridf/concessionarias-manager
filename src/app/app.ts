import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule],
  template: `
    <mat-toolbar color="primary">
      Concessionárias Manager
    </mat-toolbar>
    <main class="main">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .main { padding: 24px; display:flex; justify-content:center; }
  `]
})
export class AppComponent {}
