package curlin.danko.bikefitting.controller

import curlin.danko.bikefitting.model.dto.LoginRequest
import curlin.danko.bikefitting.service.AuthService
import curlin.danko.bikefitting.service.RateLimitService
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService,
    private val rateLimitService: RateLimitService,
) {

    @PostMapping("/login")
    fun login(@RequestBody loginRequest: LoginRequest, request: HttpServletRequest): ResponseEntity<Any> {
        return try {
            val clientIp = getClientIpAddress(request)
            val identifier = "$clientIp-${loginRequest.username}"

            // Check rate limit
            if (!rateLimitService.isAllowed(identifier)) {
                rateLimitService.recordAttempt(identifier)
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(
                        mapOf(
                            "error" to "Too many login attempts",
                            "message" to "Please wait 15 minutes before trying again",
                        ),
                    )
            }

            val authResponse = authService.authenticate(loginRequest)
            if (authResponse != null) {
                ResponseEntity.ok(authResponse)
            } else {
                rateLimitService.recordAttempt(identifier)
                ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(
                        mapOf(
                            "error" to "Invalid credentials",
                            "remaining_attempts" to rateLimitService.getRemainingAttempts(identifier),
                        ),
                    )
            }
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }

    private fun getClientIpAddress(request: HttpServletRequest): String {
        return request.getHeader("X-Forwarded-For")?.split(",")?.firstOrNull()?.trim()
            ?: request.getHeader("X-Real-IP")
            ?: request.remoteAddr
    }
} 
