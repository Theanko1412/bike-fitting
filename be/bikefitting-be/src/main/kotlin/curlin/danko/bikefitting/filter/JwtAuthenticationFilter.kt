package curlin.danko.bikefitting.filter

import curlin.danko.bikefitting.service.AuthService
import curlin.danko.bikefitting.util.JwtUtil
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthenticationFilter(
    private val jwtUtil: JwtUtil,
    private val authService: AuthService,
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val authorizationHeader = request.getHeader("Authorization")

        var username: String? = null
        var jwtToken: String? = null

        // Extract JWT token from Authorization header
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwtToken = authorizationHeader.substring(7)
            try {
                username = jwtUtil.extractUsername(jwtToken)
            } catch (e: Exception) {
                logger.warn("Unable to extract username from JWT token", e)
            }
        }

        // Validate token and set authentication
        if (username != null && SecurityContextHolder.getContext().authentication == null) {
            val user = authService.findUserByUsername(username)

            if (user != null && jwtUtil.validateToken(jwtToken!!, username)) {
                val role = jwtUtil.extractRole(jwtToken)
                val authorities = listOf(SimpleGrantedAuthority("ROLE_$role"))

                val authenticationToken = UsernamePasswordAuthenticationToken(
                    username,
                    null,
                    authorities,
                )
                authenticationToken.details = WebAuthenticationDetailsSource().buildDetails(request)
                SecurityContextHolder.getContext().authentication = authenticationToken
            }
        }

        filterChain.doFilter(request, response)
    }
} 
