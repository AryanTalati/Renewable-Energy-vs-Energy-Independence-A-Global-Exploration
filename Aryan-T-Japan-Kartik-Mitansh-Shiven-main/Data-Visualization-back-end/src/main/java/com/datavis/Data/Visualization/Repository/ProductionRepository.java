package com.datavis.Data.Visualization.Repository;

import com.datavis.Data.Visualization.DTO.SteamGraphDTO;
import com.datavis.Data.Visualization.Entity.ProductionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductionRepository extends JpaRepository<ProductionEntity,Integer> {

    @Query(value = "select pe from ProductionEntity pe where pe.type = :type order by pe.country,pe.year")
    public List<ProductionEntity> getDataBasedOnType(@Param("type")String type);

    @Query(value = "select * from data_visual.production where type in ('total energy production from petroleum and other liquids',\n" +
            "'total energy production from petroleum and other liquids','total energy production from natural gas',\n" +
            "'total energy production from nuclear, renewables, and other','total energy production from coal') and country =:country\n" +
            "order by year",nativeQuery = true)
    public List<SteamGraphDTO> getDataForSteamGraphBasedOnCountry(@Param("country")String country);

    @Query(value = "select distinct country from data_visual.production where country <> 'World' order by country",nativeQuery = true)
    public List<String> getCountryListForSteamGraph();
}
