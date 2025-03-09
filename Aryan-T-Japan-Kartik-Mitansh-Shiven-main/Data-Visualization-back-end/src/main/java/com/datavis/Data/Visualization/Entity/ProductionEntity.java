package com.datavis.Data.Visualization.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "production")
public class ProductionEntity {
    @Id
    @JsonProperty("id")
    Integer id;

    @Column(name = "country")
    @JsonProperty("country")
    String country;

    @Column(name = "type")
    @JsonProperty("type")
    String type;

    @Column(name = "year")
    @JsonProperty("year")
    Integer year;

    @Column(name = "Value")
    @JsonProperty("value")
    String value;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
