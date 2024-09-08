import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrl: './metrics.component.scss'
})
export class MetricsComponent {
  constructor(
    private router: Router
  ){}

  goTo(template: string){
    this.router.navigate([template])
  }
}
