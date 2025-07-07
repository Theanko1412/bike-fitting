package curlin.danko.bikefitting.config

import curlin.danko.bikefitting.filter.JwtAuthenticationFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfigurationSource

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
class SecurityConfig(
    private val jwtAuthenticationFilter: JwtAuthenticationFilter,
    private val corsConfigurationSource: CorsConfigurationSource,
) {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http.csrf { it.disable() }
            .cors { it.configurationSource(corsConfigurationSource) }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests { authz ->
                authz
                    // Allow authentication endpoints
                    .requestMatchers("/api/auth/**").permitAll()
                    // Allow all GET requests to general users
                    .requestMatchers(HttpMethod.GET, "/api/records/**").authenticated()
                    // Allow POST to form submission for all authenticated users
                    .requestMatchers(HttpMethod.POST, "/api/form").authenticated()
                    // Restrict PDF regeneration to ADMIN only
                    .requestMatchers(HttpMethod.POST, "/api/records/*/pdf/regenerate").hasRole("ADMIN")
                    // All other requests need authentication
                    .anyRequest().authenticated()
            }
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter::class.java)

        return http.build()
    }
} 
