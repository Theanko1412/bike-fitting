package curlin.danko.bikefitting.model.dao

import curlin.danko.bikefitting.model.dto.BikeFittingRecord
import curlin.danko.bikefitting.model.dto.InputForm
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Lob
import jakarta.persistence.Table
import java.time.LocalDate
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes

@Entity
@Table(name = "bike_fitting")
data class BikeFittingDAO(
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
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
    @Lob
    @Column(name = "pdf_file")
    val pdfFile: ByteArray? = null,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as BikeFittingDAO

        if (id != other.id) return false
        if (fullName != other.fullName) return false
        if (fitterFullName != other.fitterFullName) return false
        if (date != other.date) return false
        if (jsonForm != other.jsonForm) return false
        if (pdfFile != null) {
            if (other.pdfFile == null) return false
            if (!pdfFile.contentEquals(other.pdfFile)) return false
        } else if (other.pdfFile != null) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id?.hashCode() ?: 0
        result = 31 * result + fullName.hashCode()
        result = 31 * result + fitterFullName.hashCode()
        result = 31 * result + date.hashCode()
        result = 31 * result + jsonForm.hashCode()
        result = 31 * result + (pdfFile?.contentHashCode() ?: 0)
        return result
    }
}

fun BikeFittingDAO.toRecord(): BikeFittingRecord {
    return BikeFittingRecord(
        id = this.id ?: throw RuntimeException("Entity ID cannot be null"),
        fullName = this.fullName,
        date = this.date,
        hasFile = this.pdfFile != null,
    )
}