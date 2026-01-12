import { Component,OnInit} from '@angular/core';
import * as dashboardData from '../../../shared/data/dashboard/dashboard'
import * as L from 'leaflet';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { SpkDashboardCardComponent } from 'src/app/@spk/reusable-dashboard/spk-dashboard-card/spk-dashboard-card.component';
import { apexSparkline, apexSparkline1, apexSparkline2, apexSparkline3, RecentCustomersData, RecentCustomersData1, RecentCustomersData2, RecentCustomersData3, RecentCustomersData4, RecentCustomersData5 } from '../../../shared/data/dashboard/dashboard';
import { SpkDropdownsComponent } from 'src/app/@spk/reusable-ui-elements/spk-dropdowns/spk-dropdowns.component';
import { ApexChartComponent } from 'src/app/@spk/reusable-charts/apex-chart/apex-chart.component';
import { CommonModule } from '@angular/common';
import { SpkReusableTablesComponent } from 'src/app/@spk/spk-reusable-tables/spk-reusable-tables.component';

@Component({
    selector: 'app-dashboard',
    standalone:true,
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    imports: [NgApexchartsModule, NgbModule, LeafletModule,SpkDashboardCardComponent,SpkDropdownsComponent,ApexChartComponent,CommonModule,SpkReusableTablesComponent]
})
export class DashboardComponent implements OnInit {
  map!: L.Map;

  ngOnInit() {
  
  }
  
  //Basic Map
  options1 = {
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '',
      }),
    ],
    zoom: 5,
    center: L.latLng(20.5937, 78.9629),
  };

  width = '100%';
  height = 400;
  type = 'usa';
  dataFormat = 'json';
  dataSource = dashboardData.data;
  
  public statusData: any = dashboardData.StatusData;
  public orderData: any = dashboardData.OrderData;
  public recentCustomersData = RecentCustomersData;
  public recentCustomersData1 = RecentCustomersData1;
  public recentCustomersData2 = RecentCustomersData2;
  public recentCustomersData3 = RecentCustomersData3;
  public recentCustomersData4 = RecentCustomersData4;
  public recentCustomersData5 = RecentCustomersData5;

  //Sparkline using ApexCharts
  public apexSparkline = apexSparkline;
  public apexSparkline1 = apexSparkline1;
  public apexSparkline2 = apexSparkline2;
  public apexSparkline3 = apexSparkline3;

  cards = [
    {
      label: 'TODAY ORDERS',
      amount: '$5,74.12',
      comparisonText: 'Compared to last week',
      change: '427',
      icon: 'fas fa-arrow-circle-up',
      bgClass: 'bg-primary-gradient',
      isPositive: true,
      chartId: 'compositeline1',
      chartOptions: apexSparkline,
    },
    {
      label: 'TODAY EARNINGS',
      amount: '$1,230.17',
      comparisonText: 'Compared to last week',
      change: '23.09%',
      icon: 'fas fa-arrow-circle-down',
      bgClass: 'bg-danger-gradient',
      isPositive: false,
      chartId: 'compositeline2',
      chartOptions: apexSparkline1,
    },
    {
      label: 'TOTAL EARNINGS',
      amount: '$7,125.70',
      comparisonText: 'Compared to last week',
      change: '52.09%',
      icon: 'fas fa-arrow-circle-up',
      bgClass: 'bg-success-gradient',
      isPositive: true,
      chartId: 'compositeline3',
      chartOptions: apexSparkline2,
    },
    {
      label: 'PRODUCT SOLD',
      amount: '$4,820.50',
      comparisonText: 'Compared to last week',
      change: '152.3',
      icon: 'fas fa-arrow-circle-down',
      bgClass: 'bg-warning-gradient',
      isPositive: false,
      chartId: 'compositeline4',
      chartOptions: apexSparkline3,
    }
  ]

  users = [
    {
      name: 'Samantha Melon',
      userId: '#1234',
      status: 'Paid',
      statusClass: 'text-success',
      image: './assets/images/faces/3.jpg',
      chartOptions: RecentCustomersData1
    },
    {
      name: 'Jimmy Changa',
      userId: '#1234',
      status: 'Pending',
      statusClass: 'text-danger',
      image: './assets/images/faces/11.jpg',
      chartOptions: RecentCustomersData2
    },
    {
      name: 'Gabe Lackmen',
      userId: '#1234',
      status: 'Pending',
      statusClass: 'text-danger',
      image: './assets/images/faces/17.jpg',
      chartOptions: RecentCustomersData3
    },
    {
      name: 'Manuel Labor',
      userId: '#1234',
      status: 'Paid',
      statusClass: 'text-success',
      image: './assets/images/faces/15.jpg',
      chartOptions: RecentCustomersData4
    },
    {
      name: 'Sharon Needles',
      userId: '#1234',
      status: 'Paid',
      statusClass: 'text-success',
      image: './assets/images/faces/6.jpg',
      chartOptions: RecentCustomersData5
    }
  ]

  timelineItems = [
    {
      iconClass: 'fe fe-pie-chart bg-primary-gradient text-fixed-white',
      title: 'Total Products',
      timeAgo: '3 days ago',
      description: '1.3k New Products',
      marginBottom:''
    },
    {
      iconClass: 'fe fe-shopping-cart bg-danger-gradient text-fixed-white',
      title: 'Total Sales',
      timeAgo: '35 mins ago',
      description: '1k New Sales',
       marginBottom:''
    },
    {
      iconClass: 'fe fe-bar-chart bg-success-gradient text-fixed-white',
      title: 'Total Revenue',
      timeAgo: '50 mins ago',
      description: '23.5K New Revenue',
       marginBottom:''
    },
    {
      iconClass: 'fe fe-box bg-warning-gradient text-fixed-white',
      title: 'Total Profit',
      timeAgo: '1 hour ago',
      description: '3k New profit',
       marginBottom:''
    },
    {
      iconClass: 'fe fe-eye bg-purple-gradient text-fixed-white',
      title: 'Customer Visits',
      timeAgo: '1 day ago',
      description: '15% increased',
       marginBottom:''
    },
    {
      iconClass: 'fe fe-edit bg-primary-gradient text-fixed-white',
      title: 'Customer Reviews',
      timeAgo: '1 day ago',
      description: '1.5k reviews',
       marginBottom:'mb-0'
    }
  ];

  ProductsHeader = [
      { tableHeadColumn:'wd-lg-25p' ,header:'Date'},
      {tableHeadColumn:'wd-lg-25p' ,header:'Sales Count'},
     { tableHeadColumn:'wd-lg-25p' ,header:'Earnings'},
     { tableHeadColumn:'wd-lg-25p' ,header:'Tax Withholding '},
  ]
  tableData = [
    { date: '05 Dec 2019', quantity: 34, amount: '$658.20', change: '-$45.10', isNegative: true },
    { date: '06 Dec 2019', quantity: 26, amount: '$453.25', change: '-$15.02', isNegative: true },
    { date: '07 Dec 2019', quantity: 34, amount: '$653.12', change: '-$13.45', isNegative: true },
    { date: '08 Dec 2019', quantity: 45, amount: '$546.47', change: '-$24.22', isNegative: true },
    { date: '09 Dec 2019', quantity: 31, amount: '$425.72', change: '-$25.01', isNegative: true }
  ];
}

