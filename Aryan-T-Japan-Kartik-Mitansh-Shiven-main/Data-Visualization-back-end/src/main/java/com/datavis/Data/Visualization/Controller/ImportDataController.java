package com.datavis.Data.Visualization.Controller;

import com.datavis.Data.Visualization.Entity.WitsImportDataEntity;
import com.datavis.Data.Visualization.Service.WitsDataService;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/importData")
public class ImportDataController {

    private final WitsDataService witsDataService;

    public ImportDataController(WitsDataService witsDataService) {
        this.witsDataService = witsDataService;
    }

    @GetMapping("/getCountryList")
    public ResponseEntity<?> getCountryList(){
        return  ResponseEntity.ok(witsDataService.getCountryList());
    }

    @GetMapping("/getDataBasedOnCountry")
    @ResponseBody
    public ResponseEntity< List<WitsImportDataEntity>> getDataBasedOnCountry(@RequestParam("countryName")String countryName){
        return  ResponseEntity.ok(witsDataService.getDataBasedOnCountry(countryName));
    }

    @GetMapping("/getAllData")
    @ResponseBody
    public ResponseEntity<?> getAllData(){
        return  ResponseEntity.ok(witsDataService.getAllData());
    }

}
