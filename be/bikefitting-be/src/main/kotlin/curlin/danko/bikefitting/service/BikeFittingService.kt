package curlin.danko.bikefitting.service

import curlin.danko.bikefitting.model.dao.BikeFittingDAO
import curlin.danko.bikefitting.model.dao.toRecord
import curlin.danko.bikefitting.model.dto.BikeFittingRecord
import curlin.danko.bikefitting.model.dto.InputForm
import curlin.danko.bikefitting.model.dto.PagedResponse
import curlin.danko.bikefitting.model.dto.toDAO
import curlin.danko.bikefitting.repository.IBikeFittingRepository
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service

@Service
class BikeFittingService(
    private val bikeFittingRepository: IBikeFittingRepository
) {

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
        val savedEntity = bikeFittingRepository.save(inputForm.toDAO())
        return savedEntity.toRecord()
    }
}