package com.datavis.Data.Visualization.Repository;

import com.datavis.Data.Visualization.Entity.RadarChartDataEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RadarChartDataRepository extends JpaRepository<RadarChartDataEntity,Integer> {


    @Query(value = "select rcde from RadarChartDataEntity rcde where rcde.country = :country and rcde.year = :year")
    public List<RadarChartDataEntity> getRadarChartDataByCountryAndYear(@Param("country")String country, @Param("year")Integer year);

    @Query(value = "select distinct country from RadarChartDataEntity order by country")
    public List<String> getCountryList();

}
