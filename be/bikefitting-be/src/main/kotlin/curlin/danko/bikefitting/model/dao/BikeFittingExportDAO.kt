package curlin.danko.bikefitting.model.dao

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.time.LocalDate

@Entity
@Table(name = "bike_fitting_export")
data class BikeFittingExportDAO(
    @Id
    @Column(name = "id", nullable = false)
    val id: String,
    @Column(name = "requested_by_username")
    val requestedByUsername: String? = null,
    @Column(name = "filter_from", nullable = false)
    val filterFrom: LocalDate,
    @Column(name = "filter_to", nullable = false)
    val filterTo: LocalDate,
    /** JSON array of selected fitter names; empty array means all fitters. */
    @Column(name = "filter_fitters_json", nullable = false, columnDefinition = "TEXT")
    val filterFittersJson: String,
    @Column(name = "started_at", nullable = false)
    val startedAt: Instant,
    @Column(name = "completed_at")
    var completedAt: Instant? = null,
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    var status: ExportStatus = ExportStatus.RUNNING,
    @Column(name = "row_count")
    var rowCount: Int? = null,
    @Column(name = "error_message", length = 2000)
    var errorMessage: String? = null,
    @Column(name = "suggested_filename")
    val suggestedFilename: String? = null,
)
