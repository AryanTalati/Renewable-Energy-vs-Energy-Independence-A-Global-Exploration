package com.datavis.Data.Visualization.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

public interface SteamGraphDTO {

    @JsonProperty("country")
    String getCountry();

    @JsonProperty("year")
    Integer getYear();

    @JsonProperty("value")
    String getValue();

    @JsonProperty("type")
    String getType();
}
