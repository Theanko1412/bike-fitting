package curlin.danko.bikefitting.model.dto

data class AuthResponse(
    val token: String,
    val username: String,
    val role: String,
    val expiresIn: Long,
) 
