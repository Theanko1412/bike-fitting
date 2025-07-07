package curlin.danko.bikefitting.controller

import curlin.danko.bikefitting.model.dto.ApiError
import jakarta.servlet.http.HttpServletRequest
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class ExceptionHandler {

    private val logger = LoggerFactory.getLogger(ExceptionHandler::class.java)

    @ExceptionHandler(HttpMessageNotReadableException::class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    fun handleHttpMessageNotReadableException(
        ex: HttpMessageNotReadableException,
        request: HttpServletRequest,
    ): ApiError {
        logger.warn("JSON parse error at ${request.requestURI}: ${ex.javaClass.simpleName}")

        var cause = ex.cause
        while (cause != null) {
            if (cause is IllegalArgumentException) {
                return ApiError(
                    message = cause.message ?: "Invalid input provided",
                    timestamp = java.time.LocalDateTime.now().toString(),
                    route = request.requestURI,
                )
            }
            cause = cause.cause
        }

        return ApiError(
            message = "Invalid request format",
            timestamp = java.time.LocalDateTime.now().toString(),
            route = request.requestURI,
        )
    }

    @ExceptionHandler(IllegalArgumentException::class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    fun handleIllegalArgumentException(
        ex: IllegalArgumentException,
        request: HttpServletRequest,
    ): ApiError {
        logger.warn("Validation error at ${request.requestURI}: ${ex.message}")
        return ApiError(
            message = ex.message ?: "Invalid input provided",
            timestamp = java.time.LocalDateTime.now().toString(),
            route = request.requestURI,
        )
    }

    @ExceptionHandler(Exception::class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    fun handleException(ex: Exception, request: HttpServletRequest): ApiError {
        logger.error("Unexpected error at ${request.requestURI}", ex)
        return ApiError(
            message = "An internal error occurred. Please try again later.",
            timestamp = java.time.LocalDateTime.now().toString(),
            route = request.requestURI,
        )
    }
}
