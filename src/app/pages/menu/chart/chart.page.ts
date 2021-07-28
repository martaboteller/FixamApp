import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { Capture } from 'src/app/interfaces/interfaces';
import { CapturesService } from 'src/app/services/captures/captures.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.page.html',
  styleUrls: ['./chart.page.scss'],
})
export class ChartPage implements OnInit {
  //Variables
  public listOfCaptures: Capture[];
  public topCaptures: Capture[];
  public usernames: string[] = [];
  public votes: String;
  public clicks: number = 0;
  public clickedI: number;

  //x & y labels displaied in html dynamically
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: false,
            labelString: this.translateService.instant('chart.xAxes'),
          },
        },
      ],
      yAxes: [
        {
          ticks: { min: 0, max: 200 },
          scaleLabel: {
            display: false,
            labelString: this.translateService.instant('chart.yAxes'),
          },
        },
      ],
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };

  public barChartLabels: Label[] = [''];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];
  public dataArray = [];

  public barChartData: ChartDataSets[] = [
    {
      data: this.dataArray,
      label: this.translateService.instant('chart.votes'),
      backgroundColor: ['#333333', '#737373', '#a6a6a6', '#cccccc', '#e6e6e6'],
    },
  ];

  constructor(
    private capturesService: CapturesService,
    private usersService: UsersService,
    private translateService: TranslateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.listOfCaptures = this.capturesService.capturesFromFirebase;
    this.retriveData(this.getTopFiveCaptures());
  }

  //Get the top 5 captures
  getTopFiveCaptures(): Capture[] {
    this.topCaptures = this.listOfCaptures.sort((a, b) => b.votes - a.votes);
    this.topCaptures = this.topCaptures.slice(0, 5);
    return this.topCaptures;
  }

  //Get data from the top 5 captures
  retriveData(topCaptures: Capture[]) {
    for (var _i = 0; _i < 4; _i++) {
      this.usernames[_i] = this.usersService.filterUserByUid(
        topCaptures[_i].uid
      );
      this.votes = topCaptures[_i].votes.toString();
      this.dataArray.push(this.votes);
    }
    this.barChartLabels = this.usernames;
  }

  //If bar chart clicked accumulate clicks, when double click got to detail
  chartClicked(ev) {
    this.clicks = this.clicks + 1;
    var indEx = ev.active[0]._index;
    if (this.clicks > 1 && this.clickedI === indEx) {
      var i = ev.active[0]._index;
      var imageUrl = this.topCaptures[i].imageUrl;
      var idCapture = this.topCaptures[i].idCapture;
      this.router.navigate(['../../menu/first/detail/', imageUrl, idCapture]);
      this.clicks = 0;
    } else {
      this.clickedI = indEx;
    }
  }
}
