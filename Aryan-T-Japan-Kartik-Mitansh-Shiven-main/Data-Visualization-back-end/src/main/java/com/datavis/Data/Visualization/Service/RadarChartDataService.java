package com.datavis.Data.Visualization.Service;


import com.datavis.Data.Visualization.Entity.RadarChartDataEntity;
import com.datavis.Data.Visualization.Repository.RadarChartDataRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RadarChartDataService {

    private final RadarChartDataRepository radarChartDataRepository;

    public RadarChartDataService(RadarChartDataRepository radarChartDataRepository) {
        this.radarChartDataRepository = radarChartDataRepository;
    }

    public List<RadarChartDataEntity> getRadarChartDataByCountryAndYear(String country,String year){
        return  radarChartDataRepository.getRadarChartDataByCountryAndYear(country,Integer.parseInt(year));
    }

    public List<String> getCountryList(){
        return  radarChartDataRepository.getCountryList();
    }
}
