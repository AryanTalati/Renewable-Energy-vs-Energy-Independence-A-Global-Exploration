package com.datavis.Data.Visualization.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "energy_data_import_export")
public class EnergyImportAndExportEntity {
    @Id
    @JsonProperty("id")
    Integer id;

    @Column(name = "country")
    @JsonProperty("country")
    String country;

    @Column(name = "country_code")
    @JsonProperty("countryCode")
    String countryCode;

    @Column(name = "year")
    @JsonProperty("year")
    String year;

    @Column(name = "flow")
    @JsonProperty("flow")
    String flow;

    @JsonProperty("partnerCountryCode")
    @Column(name = "partner_country_code")
    String partnerCountryCode;

    @JsonProperty("partnerCountry")
    @Column(name = "partner_country")
    String partnerCountry;

    @JsonProperty("value")
    @Column(name = "value")
    Double value;
}

