package com.datavis.Data.Visualization.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "radar_chart_data")
@Getter
@Setter
public class RadarChartDataEntity {
    @Id
    @JsonProperty("Id")
    Integer id;

    @Column(name = "Country")
    @JsonProperty("country")
    String country;

    @Column(name = "Year")
    @JsonProperty("year")
    Integer year;

    @Column(name = "Renewable-electricity-generating-capacity-per-capita")
    @JsonProperty("renewableElectricityPerCapita")
    Double renewableElectricityPerCapita;

    @Column(name = "Renewable energy share")
    @JsonProperty("renewEnergyShare")
    Double renewEnergyShare;

    @Column(name = "Electricity from fossil fuels (TWh)")
    @JsonProperty("fossilElectricity")
    Double fossilElectricity;

    @Column(name = "Electricity from renewables (TWh)")
    @JsonProperty("renewableElectricity")
    Double renewableElectricity;

}
