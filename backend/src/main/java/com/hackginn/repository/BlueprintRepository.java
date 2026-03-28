package com.hackginn.repository;

import com.hackginn.entity.Blueprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BlueprintRepository extends JpaRepository<Blueprint, Long> {
    List<Blueprint> findByUserIdOrderByCreatedAtDesc(String userId);
}
