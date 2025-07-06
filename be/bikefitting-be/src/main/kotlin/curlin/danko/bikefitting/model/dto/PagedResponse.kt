package curlin.danko.bikefitting.model.dto

data class PagedResponse<T>(
    val data: List<T>,
    val nextPage: Int?,
    val hasMore: Boolean,
)