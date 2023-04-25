import { Component, Input, OnChanges } from '@angular/core';
import { Summary } from '../rut/rut.service';

@Component({
  selector: 'app-tbx-summary',
  templateUrl: './tbx-summary.component.html',
  styleUrls: ['./tbx-summary.component.css']
})
export class TbxSummaryComponent implements OnChanges {
  @Input() summary?: Summary;
  data: any;
  options: any;

  ngOnChanges() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    if (!this.summary) return;
    let total = this.summary.numberOfTerms;
    let labels = Object.entries(this.summary!.languages).map((language) => `${language[0]} (${(language[1]/total*100).toPrecision(2)}%)`);
    let data = Object.values(this.summary.languages);
    this.data = {
      labels,
      datasets: [{data}]
    };

    this.options = {
      cutout: '60%',
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
          legend: {
              labels: {
                  color: textColor
              }
          }
      }
  }
}}
