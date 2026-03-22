package curlin.danko.bikefitting.repository

import curlin.danko.bikefitting.model.dao.BikeFittingExportDAO
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository

interface IBikeFittingExportRepository : JpaRepository<BikeFittingExportDAO, String> {
    fun findAllByOrderByStartedAtDesc(pageable: Pageable): Page<BikeFittingExportDAO>
}
