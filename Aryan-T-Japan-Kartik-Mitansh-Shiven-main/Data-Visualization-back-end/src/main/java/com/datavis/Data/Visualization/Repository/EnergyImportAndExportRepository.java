package com.datavis.Data.Visualization.Repository;

import com.datavis.Data.Visualization.DTO.EnergyImportAndExportDTO;
import com.datavis.Data.Visualization.Entity.EnergyImportAndExportEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnergyImportAndExportRepository extends JpaRepository<EnergyImportAndExportEntity,Integer> {

    @Query(value = "select eiaee from EnergyImportAndExportEntity eiaee where eiaee.country = :country")
    public List<EnergyImportAndExportEntity> getDataBasedOnCountry(@Param("country")String country);

    @Query(value = "select distinct country from data_visual.energy_data_import_export where country <> 'World' order by country",nativeQuery = true)
    public List<String> getAllCountries();

    @Query(value = "select edie.id as id,edie.country as country, edie.year as year,edie.partner_country as partnerCountry,\n" +
            "edie.value as value, prod.value as renewableValue, edie.flow as flow from data_visual.energy_data_import_export edie\n" +
            "join data_visual.production prod on prod.country = edie.country\n" +
            "and prod.year = edie.year  \n" +
            "where edie.country = :country and edie.year = :year and prod.type= 'total energy production from renewables and other'",nativeQuery = true)
    public List<EnergyImportAndExportDTO> getDataBasedOnCountryAndYear(@Param("year")String year, @Param("country")String country);
}
