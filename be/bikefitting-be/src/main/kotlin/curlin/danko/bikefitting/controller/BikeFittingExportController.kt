package curlin.danko.bikefitting.controller

import curlin.danko.bikefitting.model.dto.BikeFittingExportSummary
import curlin.danko.bikefitting.model.dto.ExportCsvRequest
import curlin.danko.bikefitting.model.dto.PagedResponse
import curlin.danko.bikefitting.service.BikeFittingCsvExportService
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class BikeFittingExportController(
    private val csvExportService: BikeFittingCsvExportService,
) {

    @GetMapping("/fitters")
    @PreAuthorize("hasRole('ADMIN')")
    fun getFitters(): List<String> = csvExportService.getDistinctFitters()

    @GetMapping("/exports")
    @PreAuthorize("hasRole('ADMIN')")
    fun listExports(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int,
    ): ResponseEntity<PagedResponse<BikeFittingExportSummary>> {
        return ResponseEntity.ok(csvExportService.listExports(page, size))
    }

    @PostMapping(
        "/exports",
        consumes = [MediaType.APPLICATION_JSON_VALUE],
        produces = ["text/csv; charset=UTF-8"],
    )
    @PreAuthorize("hasRole('ADMIN')")
    fun exportCsv(@RequestBody request: ExportCsvRequest, response: HttpServletResponse) {
        csvExportService.writeMassExportCsv(request, response)
    }
}
