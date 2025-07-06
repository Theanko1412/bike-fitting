package curlin.danko.bikefitting.controller

import curlin.danko.bikefitting.model.dao.BikeFittingDAO
import curlin.danko.bikefitting.model.dto.BikeFittingRecord
import curlin.danko.bikefitting.model.dto.InputForm
import curlin.danko.bikefitting.model.dto.PagedResponse
import curlin.danko.bikefitting.service.BikeFittingService
import org.springframework.http.HttpStatus
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
])
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