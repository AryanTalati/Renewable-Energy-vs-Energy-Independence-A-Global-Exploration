package com.datavis.Data.Visualization.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
public class RenewableAndImportInternalDTO {
    @JsonProperty("name")
    private String country;
    @JsonProperty("attr1")
    private Double renewableEnergyData;
    @JsonProperty("attr2")
    private Double importData;
    @JsonProperty("lat")
    private Double latitude;
    @JsonProperty("lng")
    private Double longitude;

    public RenewableAndImportInternalDTO(String country, Double renewableEnergyData, Double importData, Double latitude, Double longitude) {
        this.country = country;
        this.renewableEnergyData = renewableEnergyData;
        this.importData = importData;
        this.latitude = latitude;
        this.longitude = longitude;
    }


}
