import { Component, Input } from '@angular/core';
import { GraphDbResult } from '../rut/rut.service';

@Component({
  selector: 'app-query-view',
  templateUrl: './query-view.component.html',
  styleUrls: ['./query-view.component.css']
})
export class QueryViewComponent {
  @Input() result?: GraphDbResult;

  formatCell(cell: any): string {
    return cell? cell.value.replaceAll('\n', '<br>') : "";
  }
}
