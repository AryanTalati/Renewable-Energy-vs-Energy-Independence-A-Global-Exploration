package com.datavis.Data.Visualization.Service;

import com.datavis.Data.Visualization.DTO.EnergyImportAndExportDTO;
import com.datavis.Data.Visualization.Entity.EnergyImportAndExportEntity;
import com.datavis.Data.Visualization.Repository.EnergyImportAndExportRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnergyImportAndExportService {

    private final EnergyImportAndExportRepository importAndExportRepository;

    public EnergyImportAndExportService(EnergyImportAndExportRepository importAndExportRepository) {
        this.importAndExportRepository = importAndExportRepository;
    }

    public List<EnergyImportAndExportEntity> getDataBasedOnCountry(String country){
        return importAndExportRepository.getDataBasedOnCountry(country);
    }

    public List<EnergyImportAndExportDTO> getDataBasedOnCountryAndYear(String country, String year){
        return importAndExportRepository.getDataBasedOnCountryAndYear(year,country);
    }

    public List<String> getAllCountries(){
        return importAndExportRepository.getAllCountries();
    }

    public  List<EnergyImportAndExportEntity> getAllData(){
        return importAndExportRepository.findAll();
    }
}
