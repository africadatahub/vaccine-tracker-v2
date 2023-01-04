import React from "react";
import _ from 'lodash';
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { countriesData } from "../../data/geojson/africa.js";
import { CaseGradient } from "../../utils/Gradient";
import "bootstrap/dist/css/bootstrap.min.css";

export class CaseMap extends React.Component {
  constructor() {
    super();
    this.state = {
      map: undefined,
      update:0
    };
  }

  style = (feature) => {
    let self = this;
    let color = 0;

    if (
      feature.properties.adm0_a3 == "SOL" ||
      feature.properties.adm0_a3 == "SAH"
    ) {
      color = null;
    } else if (self.props.data != undefined && self.props.data.length > 0) {
      let country = _.filter(self.props.data, function (o) {
        return o.iso_code == feature.properties.adm0_a3;
      })[0];
      if (country != undefined) {
        color = country[this.props.selectedBaseMetric];
      }
    }

    return {
      fillColor: CaseGradient(
        color,
        this.props.selectedBaseMetric == "new_cases_smoothed_per_million"
          ? 250
          : 2500
      ),
      weight: 0.5,
      opacity: 1,
      color: "#fff",
      dashArray: "0",
      fillOpacity: 1,
    };
  };

  countryAction = (feature, layer) => {
    let self = this;

    layer.on("click", function (e) {
      if (
        feature.properties.adm0_a3 != "SOL" &&
        feature.properties.adm0_a3 != "SAH"
      ) {
        self.props.onCountrySelect({
          iso_code: e.target.feature.properties.adm0_a3,
          location: e.target.feature.properties.name,
        });
      }
    });

    layer.on("mouseover", function (e) {
      if (
        e.target.feature.properties.adm0_a3 != "SOL" &&
        e.target.feature.properties.adm0_a3 != "SAH"
      ) {
        layer.bindTooltip(
          function (layer) {
            let selectedBaseMetric = _.filter(self.props.data, function (o) {
              return o.iso_code == e.target.feature.properties.adm0_a3;
            })[0][self.props.selectedBaseMetric];
            return (
              "<strong>" +
              e.target.feature.properties.name +
              "<br/>" +
              (selectedBaseMetric < 1
                ? Math.round(selectedBaseMetric * 100) / 100
                : Math.round(selectedBaseMetric)) +
              "</strong>"
            );
          },
          { permanent: true, opacity: 1 }
        );
      } else {
        layer.bindTooltip(
          function (layer) {
            return (
              "<strong>" + e.target.feature.properties.name + "<br/>-</strong>"
            );
          },
          { permanent: true, opacity: 1 }
        );
      }

      this.setStyle({
        color: "#000",
      });
    });
    layer.on("mouseout", function () {
      layer.bindTooltip().closeTooltip();
      this.setStyle({
        color: "#fff",
      });
    });
  };
  render() {
    return (
      <div className="">
        <MapContainer
          center={[-0, 20]}
          zoom={2.5}
          scrollWheelZoom={false}
          zoomControl={false}
          attributionControl={false}
          doubleClickZoom={false}
          touchZoom={false}
          style={{ height: '500px', width: '500px' ,background: "#fff"}}
          dragging={false}
        >
          <GeoJSON
            key={this.state.update}
            data={countriesData}
            onEachFeature={this.countryAction}
            style={this.style}
          />
        </MapContainer>
      </div>
    );
  }
}
export default CaseMap;
