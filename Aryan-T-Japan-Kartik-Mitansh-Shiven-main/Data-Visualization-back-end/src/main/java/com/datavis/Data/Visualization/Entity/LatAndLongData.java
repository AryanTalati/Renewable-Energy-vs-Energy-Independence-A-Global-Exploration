package com.datavis.Data.Visualization.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "latitude_and_longitude")
public class LatAndLongData {
    @Id
    Integer id;

    @Column(name = "latitude")
    @JsonProperty("latitude")
    Double latitude;

    @Column(name = "longitude")
    @JsonProperty("longitude")
    Double longitude;

    @Column(name = "country")
    @JsonProperty("country")
    String country;

}
