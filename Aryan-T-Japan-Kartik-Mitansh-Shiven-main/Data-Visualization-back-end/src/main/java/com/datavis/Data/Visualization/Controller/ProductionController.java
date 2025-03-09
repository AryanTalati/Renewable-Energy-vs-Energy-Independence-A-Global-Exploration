package com.datavis.Data.Visualization.Controller;

import com.datavis.Data.Visualization.Service.ProductionService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/ProductionData")
public class ProductionController {

    private final ProductionService productionService;

    public ProductionController(ProductionService productionService) {
        this.productionService = productionService;
    }

    @GetMapping("/getDataBasedOnType")
    @ResponseBody
    public ResponseEntity<?> getDataBasedOnType(@RequestParam("type")String type){
        return ResponseEntity.ok(productionService.getDataBasedOnType(type));
    }

    @GetMapping("/getAllData")
    @ResponseBody
    public ResponseEntity<?> getAllData(){
        return ResponseEntity.ok(productionService.getAllData());
    }

    @GetMapping("/getCombinedData")
    @ResponseBody
    public ResponseEntity<?> getCombinedData(){
        return ResponseEntity.ok((productionService.getCombinedData()));
    }

    @GetMapping("/getDataForSteamGraphBasedOnCountry")
    @ResponseBody
    public ResponseEntity<?> getDataForSteamGraphBasedOnCountry(@RequestParam("country")String country){
        return ResponseEntity.ok(productionService.getDataForSteamGraphBasedOnCountry(country));
    }

    @GetMapping("/getCountryListForSteamGraph")
    @ResponseBody
    public ResponseEntity<?> getCountryListForSteamGraph(){
        return ResponseEntity.ok(productionService.getCountryListForSteamGraph());
    }


}
