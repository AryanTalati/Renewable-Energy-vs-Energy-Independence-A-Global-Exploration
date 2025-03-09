package com.datavis.Data.Visualization.Entity;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "wits_import_data")
//Energy imported
public class WitsImportDataEntity {
    @Id
    @JsonProperty("id")
    String id;

    @Column(name = "country_name")
    @JsonProperty("countryName")
    String country;

    @Column(name = "year")
    @JsonProperty("year")
    String year;

    @Column(name = "Value")
    @JsonProperty("value")
    Double value;
}
