import { Component, OnInit } from "@angular/core";
import { GmapsService, MarkerDetails } from "../../gmaps.service";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"]
})
export class TableComponent implements OnInit {
  constructor(private gmapService: GmapsService) {}

  ngOnInit(): void {}

  sortTable(markerField: string, isNumber = false, isDate = false) {
    let table = <HTMLTableElement>document.querySelector(".spots-table");
    let header = document.querySelector(".header-row");
    this.gmapService.clearTable(header);
    this.gmapService.populateTable(
      table,
      ["name", "country", "lat", "long", "probability", "month"],
      this.gmapService.sortMarkers(
        JSON.parse(localStorage.getItem("markers")),
        markerField,
        isNumber,
        isDate
      )
    );
  }

  search(event) {
    let table = <HTMLTableElement>document.querySelector(".spots-table");
    let header = document.querySelector(".header-row");
    let markers = <MarkerDetails[]>JSON.parse(localStorage.getItem("markers"));
    let matchedMarkers = markers.filter(markerItem =>
      markerItem.name.toLowerCase().startsWith(event.target.value)
    );
    this.gmapService.clearTable(header);
    this.gmapService.populateTable(
      table,
      ["name", "country", "lat", "long", "probability", "month"],
      matchedMarkers
    );
  }
}
