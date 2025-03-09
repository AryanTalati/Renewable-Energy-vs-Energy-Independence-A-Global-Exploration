package com.datavis.Data.Visualization.DTO;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;


public interface LatLongRepoDTO {
    String getCountry();
    Double getLatitude();
    Double getLongitude();
    Integer getYear();
    String getValue();
}
