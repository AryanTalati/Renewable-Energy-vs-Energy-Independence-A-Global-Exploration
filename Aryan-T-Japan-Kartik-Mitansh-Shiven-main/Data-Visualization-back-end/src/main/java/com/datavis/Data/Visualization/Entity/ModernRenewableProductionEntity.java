package com.datavis.Data.Visualization.Entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "modern_renewable_prod")
public class ModernRenewableProductionEntity {

    @Id
    Integer id;

    @Column(name = "Entity")
    String country;

    @Column(name = "Year")
    Integer year;

    @Column(name = "Code")
    String countryShortForm;

    @Column(name = "Other_renewables_including_bioenergy_TWh")
    Integer geoBioMass;

    @Column(name = "Electricity_from_solar_TWh")
    Integer solarGeneration;

    @Column(name = "Electricity_from_wind_TWh")
    Integer windGeneration;

    @Column(name = "Electricity_from_hydro_TWh")
    Double hydroGeneration;
}
