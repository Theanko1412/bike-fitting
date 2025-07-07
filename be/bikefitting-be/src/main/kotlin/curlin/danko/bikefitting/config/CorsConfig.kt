package curlin.danko.bikefitting.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@ConfigurationProperties(prefix = "auth.cors")
data class CorsConfig(
    var allowedOrigins: List<String> = listOf("http://localhost:3000"),
    var allowedMethods: List<String> = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS"),
    var allowedHeaders: String = "*",
    var allowCredentials: Boolean = true,
    var exposedHeaders: List<String> = listOf("Content-Disposition"),
) {

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOriginPatterns = allowedOrigins
        configuration.allowedMethods = allowedMethods
        configuration.addAllowedHeader(allowedHeaders)
        configuration.allowCredentials = allowCredentials
        configuration.exposedHeaders = exposedHeaders

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }
} 
