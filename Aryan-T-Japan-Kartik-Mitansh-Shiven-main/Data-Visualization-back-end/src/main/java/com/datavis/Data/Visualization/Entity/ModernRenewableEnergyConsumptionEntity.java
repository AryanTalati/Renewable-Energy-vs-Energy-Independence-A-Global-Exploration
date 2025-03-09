package com.datavis.Data.Visualization.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "modern_renewable_energy_consumption")
public class ModernRenewableEnergyConsumptionEntity {
    @Id
    Integer id;

    @Column(name = "Entity")
    String country;

    @Column(name = "Year")
    Integer year;

    @Column(name = "Code")
    String countryShortForm;

    @Column(name = "Geo_Biomass_Other_TWh")
    Double geoBioMass;

    @Column(name = "Solar_Generation_TWh")
    Integer solarConsumption;

    @Column(name = "Wind_Generation_TWh")
    Integer windConsumption;

    @Column(name = "Hydro_Generation_TWh")
    Double hydroConsumption;
}
