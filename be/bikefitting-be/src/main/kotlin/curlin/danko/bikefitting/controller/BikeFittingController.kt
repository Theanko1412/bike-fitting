package curlin.danko.bikefitting.controller

import curlin.danko.bikefitting.model.dao.BikeFittingDAO
import curlin.danko.bikefitting.model.dto.BikeFittingRecord
import curlin.danko.bikefitting.model.dto.InputForm
import curlin.danko.bikefitting.model.dto.PagedResponse
import curlin.danko.bikefitting.service.BikeFittingService
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = [
    "http://localhost:3000",           // Local development
    "http://192.168.1.11:3000",       // Your PC IP
    "http://192.168.1.*:3000"         // Allow any device on your network
], exposedHeaders = ["Content-Disposition"])
class BikeFittingController(
    private val bikeFittingService: BikeFittingService
) {

    @GetMapping("/records")
    fun getRecords(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "50") size: Int,
        @RequestParam(required = false) search: String?
    ): ResponseEntity<PagedResponse<BikeFittingRecord>> {

        return try {
            val response = bikeFittingService.searchRecords(page, size, search)
            ResponseEntity.ok(response)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }

    @GetMapping("/records/{id}")
    fun getRecordById(@PathVariable id: Long): ResponseEntity<BikeFittingDAO> {
        return try {
            val record = bikeFittingService.getRecordById(id)
            ResponseEntity.ok(record)
        } catch (e: Exception) {
            ResponseEntity.notFound().build()
        }
    }
    
    @GetMapping("/records/{id}/pdf")
    fun getRecordPdf(@PathVariable id: Long): ResponseEntity<ByteArray> {
        return try {
            val pdfData = bikeFittingService.getPdfDownloadData(id)
            
            if (pdfData.pdfFile == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build()
            }
            
            // Create filename: fullName-date-bike-fitting-report.pdf
            val cleanFullName = pdfData.fullName.replace(" ", "")
            val dateString = pdfData.date.toString() // yyyy-mm-dd format
            val filename = "$cleanFullName-$dateString-bike-fitting-report.pdf"
            
            val headers = HttpHeaders()
            headers.contentType = MediaType.APPLICATION_PDF
            headers.setContentDispositionFormData("attachment", filename)
            headers.contentLength = pdfData.pdfFile.size.toLong()
            
            ResponseEntity.ok()
                .headers(headers)
                .body(pdfData.pdfFile)
                
        } catch (e: RuntimeException) {
            when {
                e.message?.contains("not found") == true -> ResponseEntity.notFound().build()
                else -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
            }
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }
    
    @PostMapping("/records/{id}/pdf/regenerate")
    fun regenerateRecordPdf(@PathVariable id: Long): ResponseEntity<ByteArray> {
        return try {
            val pdfData = bikeFittingService.regeneratePdf(id)
            
            // Create filename: fullName-date-bike-fitting-report.pdf
            val cleanFullName = pdfData.fullName.replace(" ", "")
            val dateString = pdfData.date.toString() // yyyy-mm-dd format
            val filename = "$cleanFullName-$dateString-bike-fitting-report-regenerated.pdf"
            
            val headers = HttpHeaders()
            headers.contentType = MediaType.APPLICATION_PDF
            headers.setContentDispositionFormData("attachment", filename)
            headers.contentLength = pdfData.pdfFile!!.size.toLong()
            
            ResponseEntity.ok()
                .headers(headers)
                .body(pdfData.pdfFile)
                
        } catch (e: RuntimeException) {
            when {
                e.message?.contains("not found") == true -> ResponseEntity.notFound().build()
                e.message?.contains("Failed to regenerate") == true -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
                else -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
            }
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }

    @PostMapping("/form")
    fun submitForm(@RequestBody inputForm: InputForm): ResponseEntity<BikeFittingRecord> {
        return try {
            val savedRecord = bikeFittingService.saveRecord(inputForm)
            ResponseEntity.status(HttpStatus.CREATED).body(savedRecord)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }
}