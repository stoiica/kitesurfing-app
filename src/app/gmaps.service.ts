import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { customMarker } from "./gmap/gmap.component";

export interface MarkerDetails {
  id: string;
  createdAt: string;
  name: string;
  country: string;
  lat: string;
  long: string;
  probability: number;
  month: string;
}

export interface Favourite {
  id: string;
  createdAt: string;
  spot: number;
}

@Injectable({
  providedIn: "root"
})
export class GmapsService {
  constructor(private http: HttpClient) {}

  loadAllMarkers(map: google.maps.Map) {
    return new Promise((resolve, reject) => {
      this.http
        .get<MarkerDetails[]>(
          "https://5e774573e3fd85001601f758.mockapi.io/spot"
        )
        .subscribe(
          spots => {
            localStorage.setItem("markers", JSON.stringify(spots));
            let markers: customMarker[] = [];
            spots.forEach(spot => {
              let marker = new google.maps.Marker({
                position: new google.maps.LatLng(
                  parseInt(spot.lat),
                  parseInt(spot.long)
                ),
                map,
                title: spot.name,
                icon: "../../assets/red-spot.png"
              });
              markers.push({
                marker,
                createdAt: spot.createdAt,
                country: spot.country,
                windProb: spot.probability,
                month: spot.month,
                isFavourite: false,
                id: parseInt(spot.id)
              });
            });
            this.loadFavourites(markers).subscribe(favourites => {
              favourites.forEach(favourite => {
                let selected = markers.find(
                  marker => marker.id === favourite.spot
                );
                if (selected !== undefined) {
                  selected.marker.setIcon("../../assets/orange-spot.png");
                  selected.isFavourite = true;
                }
              });
              this.addMarkerEvent(markers);
              resolve(markers);
            });
          },
          err => {
            reject(err);
          }
        );
    });
  }

  loadFavourites(markers: customMarker[]) {
    return this.http.get<Favourite[]>(
      "https://5e774573e3fd85001601f758.mockapi.io/favourites"
    );
  }

  filterMarkers(
    markers: customMarker[],
    map: google.maps.Map,
    country,
    windProb
  ) {
    let windToNumber = Number(windProb);
    let matched = false;
    if (!isNaN(windToNumber) && !country.match(/\d+/g)) {
      markers.forEach(markerItem => {
        if (
          markerItem.country.localeCompare(country, undefined, {
            sensitivity: "accent"
          }) === 0 ||
          country.localeCompare("") === 0
        ) {
          matched = true;
        } else {
          matched = false;
        }
        if (markerItem.windProb === windToNumber || windToNumber === 0) {
          matched = matched && true;
        } else {
          matched = false;
        }
        if (matched) {
          markerItem.marker.setMap(map);
        } else {
          markerItem.marker.setMap(null);
        }
        matched = false;
      });
    } else {
      console.log("eroare");
    }
  }

  populateTable(
    table: HTMLTableElement,
    markerFields: string[],
    markers: MarkerDetails[]
  ) {
    markers.forEach((marker, index) => {
      let tableRow = document.createElement("tr");
      if (index % 2) {
        tableRow.style.background = "#f3f3f3";
      }
      markerFields.forEach(field => {
        if (field !== "id") {
          let rowData = document.createElement("td");
          rowData.innerHTML = marker[field];
          tableRow.appendChild(rowData);
        }
      });
      table.appendChild(tableRow);
    });
  }

  sortMarkers(
    markers: MarkerDetails[],
    markerField: string,
    isNumber = false,
    isDate = false
  ) {
    if (isNumber) {
      return markers.sort((a, b) => {
        if (parseFloat(a[markerField]) > parseFloat(b[markerField])) {
          return 1;
        } else {
          return -1;
        }
      });
    } else if (isDate) {
      let months = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12
      };
      return markers.sort((a, b) => {
        if (months[a[markerField]] > months[b[markerField]]) {
          return 1;
        } else {
          return -1;
        }
      });
    } else {
      return markers.sort((a, b) =>
        a[markerField].localeCompare(b[markerField])
      );
    }
  }

  clearTable(tableHeader: Element) {
    let next;
    while ((next = tableHeader.nextSibling)) {
      tableHeader.parentNode.removeChild(next);
    }
  }

  addMarkerEvent(markers: customMarker[]) {
    for (let markerInfo of markers) {
      markerInfo.marker.addListener("click", event => {
        let detailsDiv = <HTMLElement>document.querySelector(".marker-details");
        let markers = <MarkerDetails[]>(
          JSON.parse(localStorage.getItem("markers"))
        );
        let matchedMarker = markers.find(
          markerItem => markerItem.name === markerInfo.marker.getTitle()
        );

        detailsDiv.style.display = "block";
        let otherFields = [
          "name",
          "country",
          "probability",
          "lat",
          "long",
          "month"
        ];
        for (let field of otherFields) {
          document.querySelector("." + field).innerHTML = matchedMarker[field];
        }
        let favortesDiv = <HTMLElement>document.querySelector(".details-btn");
        if (markerInfo.isFavourite) {
          favortesDiv.innerHTML = "- REMOVE FROM FAVORITES";
          favortesDiv.style.background = "#FF3B30";
        } else {
          favortesDiv.innerHTML = "+ ADD TO FAVORITES";
          favortesDiv.style.background = "#e8b100";
        }
      });
    }
  }

  checkIfMarker(child) {
    let parent = document.querySelector(
      "#map > div > div > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(3)"
    );
    return parent.contains(child);
  }

  addFavorite(id: number, add: boolean) {
    if (add) {
      this.http.post("https://5e774573e3fd85001601f758.mockapi.io/favourites", {
        spot: id
      });
    } else {
      this.http.delete(
        "https://5e774573e3fd85001601f758.mockapi.io/favourites/" + id
      );
    }
  }
}
