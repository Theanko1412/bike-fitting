package curlin.danko.bikefitting.controller

import curlin.danko.bikefitting.model.dto.ApiError
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class ExceptionHandler {

    @ExceptionHandler(HttpMessageNotReadableException::class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    fun handleHttpMessageNotReadableException(
        ex: HttpMessageNotReadableException, 
        request: HttpServletRequest
    ): ApiError {
        println("JSON parse error: $ex")

        var cause = ex.cause
        while (cause != null) {
            if (cause is IllegalArgumentException) {
                return ApiError(
                    message = cause.message ?: "Invalid input provided",
                    timestamp = java.time.LocalDateTime.now().toString(),
                    route = request.requestURI
                )
            }
            cause = cause.cause
        }
        
        return ApiError(
            message = "Invalid JSON format",
            timestamp = java.time.LocalDateTime.now().toString(),
            route = request.requestURI
        )
    }

    @ExceptionHandler(IllegalArgumentException::class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    fun handleIllegalArgumentException(
        ex: IllegalArgumentException, 
        request: HttpServletRequest
    ): ApiError {
        println("Illegal argument error: $ex")
        return ApiError(
            message = ex.message ?: "Invalid input provided",
            timestamp = java.time.LocalDateTime.now().toString(),
            route = request.requestURI
        )
    }

    @ExceptionHandler(Exception::class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    fun handleException(ex: Exception, request: HttpServletRequest): ApiError {
        println("An error occurred: $ex")
        return ApiError(
            message = ex.message ?: "An unexpected error occurred",
            timestamp = java.time.LocalDateTime.now().toString(),
            route = request.requestURI
        )
    }
}