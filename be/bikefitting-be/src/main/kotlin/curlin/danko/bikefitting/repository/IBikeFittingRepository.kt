package curlin.danko.bikefitting.repository

import curlin.danko.bikefitting.model.dao.BikeFittingDAO
import curlin.danko.bikefitting.model.dto.BikeFittingRecord
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.time.LocalDate

interface IBikeFittingRepository : JpaRepository<BikeFittingDAO, String> {
    fun findBySubmissionDateBetween(
        from: LocalDate,
        to: LocalDate,
        pageable: Pageable,
    ): Page<BikeFittingDAO>

    fun findBySubmissionDateBetweenAndFitterFullNameIn(
        from: LocalDate,
        to: LocalDate,
        fitterFullNames: Collection<String>,
        pageable: Pageable,
    ): Page<BikeFittingDAO>

    @Query(
        """
        SELECT DISTINCT b.fitterFullName FROM BikeFittingDAO b
        WHERE b.fitterFullName IS NOT NULL AND TRIM(b.fitterFullName) <> ''
        ORDER BY b.fitterFullName
        """,
    )
    fun findDistinctFitterFullNames(): List<String>

    /**
     * List/search without loading json_form (avoids JSON deserialization errors on legacy rows).
     */
    @Query(
        value = """
            SELECT new curlin.danko.bikefitting.model.dto.BikeFittingRecord(
                b.id,
                b.fullName,
                b.date,
                CASE WHEN b.pdfFile IS NOT NULL THEN true ELSE false END
            )
            FROM BikeFittingDAO b
        """,
        countQuery = "SELECT COUNT(b) FROM BikeFittingDAO b",
    )
    fun findAllRecordsPage(pageable: Pageable): Page<BikeFittingRecord>

    @Query(
        value = """
            SELECT new curlin.danko.bikefitting.model.dto.BikeFittingRecord(
                b.id,
                b.fullName,
                b.date,
                CASE WHEN b.pdfFile IS NOT NULL THEN true ELSE false END
            )
            FROM BikeFittingDAO b
            WHERE LOWER(b.fullName) LIKE LOWER(CONCAT('%', :search, '%'))
        """,
        countQuery = """
            SELECT COUNT(b)
            FROM BikeFittingDAO b
            WHERE LOWER(b.fullName) LIKE LOWER(CONCAT('%', :search, '%'))
        """,
    )
    fun searchRecordsPage(@Param("search") search: String, pageable: Pageable): Page<BikeFittingRecord>
}
