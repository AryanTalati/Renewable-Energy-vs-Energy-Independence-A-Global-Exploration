package com.datavis.Data.Visualization.Controller;

import com.datavis.Data.Visualization.Service.EnergyImportAndExportService;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/getDataForNetworkGraph")
public class EnergyImportAndExportForNetworkGraphController {
    private final EnergyImportAndExportService importAndExportService;

    public EnergyImportAndExportForNetworkGraphController(EnergyImportAndExportService importAndExportService) {
        this.importAndExportService = importAndExportService;
    }

    @GetMapping("/getDataBasedOnSourceCountry")
    @ResponseBody
    public ResponseEntity<?> getDataBasedOnCountry(@RequestParam("country") String country){
        return ResponseEntity.ok(importAndExportService.getDataBasedOnCountry(country));
    }

    @GetMapping("/getDataBasedOnCountryAndYear")
    @ResponseBody
    public ResponseEntity<?> getDataBasedOnCountryAndYear(@RequestParam("country") String country, @RequestParam("year")String year){
        return ResponseEntity.ok(importAndExportService.getDataBasedOnCountryAndYear(country,year));
    }

    @GetMapping("/getAllCountries")
    @ResponseBody
    public  ResponseEntity<?> getAllCountries(){
        return ResponseEntity.ok(importAndExportService.getAllCountries());
    }

    @GetMapping("/getAllData")
    @ResponseBody
    public  ResponseEntity<?> getAllData(){
        return ResponseEntity.ok(importAndExportService.getAllData());
    }
}
