package com.datavis.Data.Visualization.DTO;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

public class RenewableAndImportExternalDTO {
    @JsonProperty("year")
    private Integer year;
    @JsonProperty("countries")
    private List<RenewableAndImportInternalDTO> importInternalDTO;

    public Integer getYear() {
        return year;
    }

    public RenewableAndImportExternalDTO() {
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public List<RenewableAndImportInternalDTO> getImportInternalDTO() {
        return importInternalDTO;
    }

    public void setImportInternalDTO(List<RenewableAndImportInternalDTO> importInternalDTO) {
        this.importInternalDTO = importInternalDTO;
    }
}
