package curlin.danko.bikefitting.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.time.Duration
import java.time.LocalDateTime
import java.util.concurrent.ConcurrentHashMap

@Service
class RateLimitService {

    @Value("\${auth.rate-limit.max-attempts:5}")
    private var maxAttempts: Int = 5

    @Value("\${auth.rate-limit.window-minutes:15}")
    private var windowMinutes: Long = 15L

    @Value("\${auth.rate-limit.enabled:true}")
    private var enabled: Boolean = true

    private val attempts = ConcurrentHashMap<String, MutableList<LocalDateTime>>()

    fun isAllowed(identifier: String): Boolean {
        if (!enabled) return true

        val now = LocalDateTime.now()
        val cutoff = now.minus(Duration.ofMinutes(windowMinutes))

        // Clean old attempts and get current attempts
        val currentAttempts = attempts.computeIfAbsent(identifier) { mutableListOf() }
        currentAttempts.removeIf { it.isBefore(cutoff) }

        return currentAttempts.size < maxAttempts
    }

    fun recordAttempt(identifier: String) {
        val now = LocalDateTime.now()
        attempts.computeIfAbsent(identifier) { mutableListOf() }.add(now)
    }

    fun getRemainingAttempts(identifier: String): Int {
        val now = LocalDateTime.now()
        val cutoff = now.minus(Duration.ofMinutes(windowMinutes))

        val currentAttempts = attempts[identifier] ?: return maxAttempts
        currentAttempts.removeIf { it.isBefore(cutoff) }

        return maxOf(0, maxAttempts - currentAttempts.size)
    }
} 
