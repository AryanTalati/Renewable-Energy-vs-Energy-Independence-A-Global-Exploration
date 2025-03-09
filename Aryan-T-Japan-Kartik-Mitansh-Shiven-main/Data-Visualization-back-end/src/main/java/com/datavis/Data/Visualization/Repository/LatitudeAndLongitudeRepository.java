package com.datavis.Data.Visualization.Repository;

import com.datavis.Data.Visualization.DTO.LatLongRepoDTO;
import com.datavis.Data.Visualization.Entity.LatAndLongData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LatitudeAndLongitudeRepository extends JpaRepository<LatAndLongData,Integer> {

    @Query(value = "SELECT \n" +
            "lal.country as country, lal.latitude as latitude, lal.longitude as longitude,\n" +
            "prod.year as year,prod.Value as value\n" +
            " FROM data_visual.latitude_and_longitude lal\n" +
            "inner join data_visual.wits_import_data prod on prod.country_name= lal.country\n" +
            "where year>='2000'",nativeQuery = true)
    List<LatLongRepoDTO> getCombinedData();


}
