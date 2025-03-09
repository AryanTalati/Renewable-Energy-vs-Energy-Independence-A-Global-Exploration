package com.datavis.Data.Visualization.Service;

import com.datavis.Data.Visualization.Entity.WitsImportDataEntity;
import com.datavis.Data.Visualization.Repository.WitsImportDataRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WitsDataService {

    private final WitsImportDataRepository witsImportDataRepository;

    public WitsDataService(WitsImportDataRepository witsImportDataRepository) {
        this.witsImportDataRepository = witsImportDataRepository;
    }

    public List<String> getCountryList(){
        return  witsImportDataRepository.getCountryList();
    }

    public List<WitsImportDataEntity> getDataBasedOnCountry(String countryName){
        return  witsImportDataRepository.getDataBasedOnCountry(countryName);
    }

    public List<WitsImportDataEntity> getAllData(){
        return  witsImportDataRepository.findAll();
    }
}
