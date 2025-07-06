package curlin.danko.bikefitting.repository

import curlin.danko.bikefitting.model.dao.BikeFittingDAO
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository

interface IBikeFittingRepository: JpaRepository<BikeFittingDAO, Long> {
    fun findByFullNameContainingIgnoreCase(fullName: String, pageable: Pageable): Page<BikeFittingDAO>
}