package curlin.danko.bikefitting.model.dto

data class ApiError(
    val message: String,
    val timestamp: String = java.time.LocalDateTime.now().toString(),
    val route: String? = null,
)
