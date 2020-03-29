import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { GmapsService, MarkerDetails } from "../gmaps.service";
import { AlertService } from "../alert.service";

export interface customMarker {
  marker: google.maps.Marker;
  createdAt: string;
  country: string;
  windProb: number;
  month: string;
  isFavourite: boolean;
  id: number;
}

@Component({
  selector: "app-gmap",
  templateUrl: "./gmap.component.html",
  styleUrls: ["./gmap.component.css"]
})
export class GmapComponent implements OnInit {
  @ViewChild("mapContainer", { static: false }) gmap: ElementRef;
  filtersHidden: boolean = true;

  map: google.maps.Map;
  latitude = 44.435;
  longitude = 26.093;
  coordinates = new google.maps.LatLng(this.latitude, this.longitude);

  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    disableDefaultUI: true,
    zoom: 3
  };

  markers: customMarker[];

  constructor(private gmapsService: GmapsService, private alert: AlertService) {
    this.markers = new Array<customMarker>();
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.mapInit();
  }

  mapInit() {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
    this.loadMarkers();

    document.addEventListener("click", event => {
      let element = <HTMLElement>event.target;
      if (!element.classList.contains("filterMenu") && !this.filtersHidden) {
        this.filtersHidden = true;
      }
    });
  }

  loadMarkers() {
    this.gmapsService.loadAllMarkers(this.map).then(
      markers => {
        this.markers = <customMarker[]>markers;
        let table = <HTMLTableElement>document.querySelector(".spots-table");
        this.gmapsService.populateTable(
          table,
          ["name", "country", "lat", "long", "probability", "month"],
          JSON.parse(localStorage.getItem("markers"))
        );
      },
      () => {
        this.alert.showAlert("Error occurred", "error");
      }
    );
  }

  showFilters() {
    this.filtersHidden = false;
  }

  applyFilter() {
    let country = (<HTMLInputElement>document.querySelector("#country")).value;
    let wind = (<HTMLInputElement>document.querySelector("#wind")).value;
    this.gmapsService.filterMarkers(this.markers, this.map, country, wind);
  }

  showDetails(event) {
    let detailsDiv = <HTMLElement>document.querySelector(".marker-details");
    detailsDiv.style.top = event.y - 68 + "px";
    detailsDiv.style.left = event.x + "px";
    if (!this.gmapsService.checkIfMarker(event.target)) {
      detailsDiv.style.display = "none";
    }
  }

  updateFavorites(event) {
    let markerName = document.querySelector(".name").innerHTML;
    let matchedMarker = this.markers.find(
      markerItem => markerItem.marker.getTitle() === markerName
    );
    if (matchedMarker.isFavourite) {
      matchedMarker.isFavourite = false;
      matchedMarker.marker.setIcon("../../assets/red-spot.png");
      this.gmapsService.addFavorite(matchedMarker.id, true);
      this.alert.showAlert("Spot succesfully removed", "success");
    } else {
      matchedMarker.isFavourite = true;
      matchedMarker.marker.setIcon("../../assets/orange-spot.png");
      this.gmapsService.addFavorite(matchedMarker.id, false);
      this.alert.showAlert("Spot succesfully added", "success");
    }
  }
}
