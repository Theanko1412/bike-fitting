package curlin.danko.bikefitting.model.dto

import java.time.LocalDate

data class PdfDownloadData(
    val fullName: String,
    val date: LocalDate,
    val pdfFile: ByteArray?,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as PdfDownloadData

        if (fullName != other.fullName) return false
        if (date != other.date) return false
        if (pdfFile != null) {
            if (other.pdfFile == null) return false
            if (!pdfFile.contentEquals(other.pdfFile)) return false
        } else if (other.pdfFile != null) return false

        return true
    }

    override fun hashCode(): Int {
        var result = fullName.hashCode()
        result = 31 * result + date.hashCode()
        result = 31 * result + (pdfFile?.contentHashCode() ?: 0)
        return result
    }
} 
