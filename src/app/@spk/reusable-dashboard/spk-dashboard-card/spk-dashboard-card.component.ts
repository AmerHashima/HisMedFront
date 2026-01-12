import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ApexChartComponent } from "../../reusable-charts/apex-chart/apex-chart.component";

@Component({
  selector: 'spk-dashboard-card',
  imports: [CommonModule, ApexChartComponent, ApexChartComponent],
  templateUrl: './spk-dashboard-card.component.html',
  styleUrl: './spk-dashboard-card.component.scss'
})
export class SpkDashboardCardComponent {
  @Input() label: string = '';
  @Input() amount: string = '';
  @Input() comparisonText: string = 'Compared to last week';
  @Input() change: string = '';
  @Input() icon: string = '';
  @Input() bgClass: string = '';
  @Input() isPositive: boolean = true;
  @Input() chartId: string = '';
  @Input() chartOptions: any = null;
}
