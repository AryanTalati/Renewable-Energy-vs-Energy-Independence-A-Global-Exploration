package com.datavis.Data.Visualization.Repository;

import com.datavis.Data.Visualization.Entity.ModernRenewableProductionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModernRenewableProductionRepository extends JpaRepository<ModernRenewableProductionEntity,Integer> {
}
