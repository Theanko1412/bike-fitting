package curlin.danko.bikefitting.service

import curlin.danko.bikefitting.model.dao.BikeFittingDAO
import curlin.danko.bikefitting.model.dao.toRecord
import curlin.danko.bikefitting.model.dto.BikeFittingRecord
import curlin.danko.bikefitting.model.dto.InputForm
import curlin.danko.bikefitting.model.dto.PagedResponse
import curlin.danko.bikefitting.model.dto.PdfDownloadData
import curlin.danko.bikefitting.model.dto.toDAO
import curlin.danko.bikefitting.repository.IBikeFittingRepository
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service

@Service
class BikeFittingService(
    private val bikeFittingRepository: IBikeFittingRepository,
    private val pdfService: PdfService
) {
    
    private val logger = LoggerFactory.getLogger(BikeFittingService::class.java)

    fun searchRecords(
        page: Int,
        size: Int,
        search: String?
    ): PagedResponse<BikeFittingRecord> {

        // Create pageable with DESC sort by date (latest first)
        val pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date"))

        // Fetch data based on search term
        val records = if (search.isNullOrBlank()) {
            bikeFittingRepository.findAll(pageable)
        } else {
            bikeFittingRepository.findByFullNameContainingIgnoreCase(search, pageable)
        }

        // Convert to DTOs
        val recordDtos = records.content.map { entity ->
            entity.toRecord()
        }

        return PagedResponse(
            data = recordDtos,
            nextPage = if (records.hasNext()) page + 1 else null,
            hasMore = records.hasNext()
        )
    }

    fun getRecordById(id: Long): BikeFittingDAO {
        return bikeFittingRepository.findById(id)
            .orElseThrow { RuntimeException("Record not found with id: $id") }
    }

    fun saveRecord(inputForm: InputForm): BikeFittingRecord {
        // First save the record without PDF
        var savedEntity = bikeFittingRepository.save(inputForm.toDAO())
        
        // Try to generate PDF
        try {
            logger.info("Attempting to generate PDF for record ID: ${savedEntity.id}")
            val pdfBytes = pdfService.generateBikeFittingReport(inputForm, savedEntity.id!!)
            
            // Update the entity with PDF data
            savedEntity = savedEntity.copy(pdfFile = pdfBytes)
            savedEntity = bikeFittingRepository.save(savedEntity)
            logger.info("PDF generated successfully for record ID: ${savedEntity.id}")
            
        } catch (e: Exception) {
            logger.warn("Failed to generate PDF for record ID: ${savedEntity.id}. Saving record without PDF.", e)
            // Record is already saved without PDF, so we continue
        }
        
        return savedEntity.toRecord()
    }
    
    fun getPdfDownloadData(id: Long): PdfDownloadData {
        val record = bikeFittingRepository.findById(id)
            .orElseThrow { RuntimeException("Record not found with id: $id") }
        
        return PdfDownloadData(
            fullName = record.fullName,
            date = record.date,
            pdfFile = record.pdfFile
        )
    }
    
    fun regeneratePdf(id: Long): PdfDownloadData {
        logger.info("Starting PDF regeneration for record ID: $id")
        
        // Get the existing record
        val existingRecord = bikeFittingRepository.findById(id)
            .orElseThrow { RuntimeException("Record not found with id: $id") }
        
        try {
            // Extract the InputForm from the stored jsonForm
            val inputForm = existingRecord.jsonForm
            logger.info("Extracted form data for record ID: $id")
            
            // Generate new PDF
            logger.info("Generating new PDF for record ID: $id")
            val newPdfBytes = pdfService.generateBikeFittingReport(inputForm, id)
            
            // Update the record with new PDF
            val updatedRecord = existingRecord.copy(pdfFile = newPdfBytes)
            bikeFittingRepository.save(updatedRecord)
            logger.info("PDF regenerated and saved successfully for record ID: $id")
            
            // Return the new PDF data
            return PdfDownloadData(
                fullName = updatedRecord.fullName,
                date = updatedRecord.date,
                pdfFile = newPdfBytes
            )
            
        } catch (e: Exception) {
            logger.error("Failed to regenerate PDF for record ID: $id", e)
            throw RuntimeException("Failed to regenerate PDF for record ID: $id", e)
        }
    }
}