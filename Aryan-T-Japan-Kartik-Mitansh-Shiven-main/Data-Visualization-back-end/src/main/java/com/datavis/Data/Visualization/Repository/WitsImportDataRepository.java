package com.datavis.Data.Visualization.Repository;

import com.datavis.Data.Visualization.Entity.WitsImportDataEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WitsImportDataRepository extends JpaRepository<WitsImportDataEntity,Integer> {

    @Query(value = "select distinct wide.country_name from data_visual.wits_import_data wide order by wide.country_name",nativeQuery = true)
    public List<String> getCountryList();

    @Query(value = "select wide from WitsImportDataEntity wide where wide.country = :country")
    public List<WitsImportDataEntity> getDataBasedOnCountry(@Param("country")String country);
}
