package curlin.danko.bikefitting.model.dao

import curlin.danko.bikefitting.model.dto.BikeFittingRecord
import curlin.danko.bikefitting.model.dto.InputForm
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDate
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes

@Entity
@Table(name = "bike_fitting")
data class BikeFittingDAO(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    @Column(name = "full_name", nullable = false)
    val fullName: String,
    @Column(name = "fitter_full_name", nullable = false)
    val fitterFullName: String,
    @Column(name = "date", nullable = false)
    val date: LocalDate,
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "json_form", columnDefinition = "jsonb")
    val jsonForm: InputForm,
    @Column(name = "pdf_file")
    val pdfFile: String? = null,
)

fun BikeFittingDAO.toRecord(): BikeFittingRecord {
    return BikeFittingRecord(
        id = this.id ?: throw RuntimeException("Entity ID cannot be null"),
        fullName = this.fullName,
        date = this.date,
        hasFile = this.pdfFile != null,
    )
}