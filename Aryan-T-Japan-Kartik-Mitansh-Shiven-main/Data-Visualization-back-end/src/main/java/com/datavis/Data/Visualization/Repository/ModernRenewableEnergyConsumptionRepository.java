package com.datavis.Data.Visualization.Repository;

import com.datavis.Data.Visualization.Entity.ModernRenewableEnergyConsumptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModernRenewableEnergyConsumptionRepository extends
        JpaRepository<ModernRenewableEnergyConsumptionEntity,Integer> {
}
