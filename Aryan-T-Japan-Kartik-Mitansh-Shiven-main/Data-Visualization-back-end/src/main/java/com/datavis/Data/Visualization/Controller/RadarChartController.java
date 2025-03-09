package com.datavis.Data.Visualization.Controller;

import com.datavis.Data.Visualization.Service.RadarChartDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/radarChart")
public class RadarChartController {

    private final RadarChartDataService radarChartDataService;

    public RadarChartController(RadarChartDataService radarChartDataService) {
        this.radarChartDataService = radarChartDataService;
    }

    @GetMapping("/getRadarChartDataByCountryAndYear")
    public ResponseEntity<?> getRadarChartDataByCountryAndYear(@RequestParam("country")String country,@RequestParam("year")String year){
        return ResponseEntity.ok(radarChartDataService.getRadarChartDataByCountryAndYear(country,year));
    }

    @GetMapping("/getCountryList")
    public ResponseEntity<?> getCountryList(){
        return ResponseEntity.ok(radarChartDataService.getCountryList());
    }

}
