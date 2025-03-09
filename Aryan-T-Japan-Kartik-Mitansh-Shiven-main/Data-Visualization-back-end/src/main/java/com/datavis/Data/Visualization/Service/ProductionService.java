package com.datavis.Data.Visualization.Service;

import com.datavis.Data.Visualization.DTO.LatLongRepoDTO;
import com.datavis.Data.Visualization.DTO.RenewableAndImportExternalDTO;
import com.datavis.Data.Visualization.DTO.RenewableAndImportInternalDTO;
import com.datavis.Data.Visualization.DTO.SteamGraphDTO;
import com.datavis.Data.Visualization.Entity.LatAndLongData;
import com.datavis.Data.Visualization.Entity.ProductionEntity;

import com.datavis.Data.Visualization.Entity.WitsImportDataEntity;
import com.datavis.Data.Visualization.Repository.LatitudeAndLongitudeRepository;
import com.datavis.Data.Visualization.Repository.ProductionRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductionService {

    private final ProductionRepository productionRepository;

    private final LatitudeAndLongitudeRepository latitudeAndLongitudeRepository;


    public ProductionService(ProductionRepository productionRepository, LatitudeAndLongitudeRepository latitudeAndLongitudeRepository) {
        this.productionRepository = productionRepository;
        this.latitudeAndLongitudeRepository = latitudeAndLongitudeRepository;
    }

    public List<ProductionEntity> getAllData(){
        return productionRepository.findAll();
    }

    public List<ProductionEntity> getDataBasedOnType(String type){
        return productionRepository.getDataBasedOnType(type);
    }

    public List<RenewableAndImportExternalDTO> getCombinedData(){
        List<ProductionEntity> prodData  = productionRepository.getDataBasedOnType("total energy production from renewables and other");
        List<LatLongRepoDTO> latLongData =latitudeAndLongitudeRepository.getCombinedData();
        List<RenewableAndImportExternalDTO> listToBeSent = new ArrayList<>();
        Map<Integer,List<RenewableAndImportInternalDTO>> map = new HashMap<>();
        for(ProductionEntity productionEntity: prodData){
            for (LatLongRepoDTO impData: latLongData){
                if(productionEntity.getYear()!= null && Objects.equals(impData.getYear(), productionEntity.getYear())&&
                        impData.getCountry().equalsIgnoreCase(productionEntity.getCountry())) {
                    map.computeIfAbsent(impData.getYear(),key -> new ArrayList<>())
                            .add(    new RenewableAndImportInternalDTO(impData.getCountry(),Double.parseDouble(productionEntity.getValue()),
                                    Double.parseDouble(impData.getValue()),impData.getLatitude(),impData.getLongitude()));
                }
            }
        }
        map.forEach((key,value) ->{
            RenewableAndImportExternalDTO temp = new RenewableAndImportExternalDTO();
            temp.setYear(key);
            temp.setImportInternalDTO(value);
            listToBeSent.add(temp);
        });
        return listToBeSent;
    }

    public List<SteamGraphDTO> getDataForSteamGraphBasedOnCountry(String country){
        return  productionRepository.getDataForSteamGraphBasedOnCountry(country);
    }

    public List<String> getCountryListForSteamGraph(){
        return productionRepository.getCountryListForSteamGraph();
    }




}
