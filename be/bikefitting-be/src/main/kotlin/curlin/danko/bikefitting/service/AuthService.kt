package curlin.danko.bikefitting.service

import curlin.danko.bikefitting.model.dto.AuthResponse
import curlin.danko.bikefitting.model.dto.LoginRequest
import curlin.danko.bikefitting.model.dto.User
import curlin.danko.bikefitting.util.JwtUtil
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val jwtUtil: JwtUtil,
) {

    @Value("\${auth.users.user.username}")
    private lateinit var userUsername: String

    @Value("\${auth.users.user.password}")
    private lateinit var userPassword: String

    @Value("\${auth.users.user.role}")
    private lateinit var userRole: String

    @Value("\${auth.users.admin.username}")
    private lateinit var adminUsername: String

    @Value("\${auth.users.admin.password}")
    private lateinit var adminPassword: String

    @Value("\${auth.users.admin.role}")
    private lateinit var adminRole: String

    private val users: List<User> by lazy {
        listOf(
            User(userUsername, userPassword, userRole),
            User(adminUsername, adminPassword, adminRole),
        )
    }

    fun authenticate(loginRequest: LoginRequest): AuthResponse? {
        val user = users.find {
            it.username == loginRequest.username && it.password == loginRequest.password
        }

        return if (user != null) {
            val token = jwtUtil.generateToken(user.username, user.role)
            AuthResponse(
                token = token,
                username = user.username,
                role = user.role,
                expiresIn = jwtUtil.getExpirationTime(),
            )
        } else {
            null
        }
    }

    fun findUserByUsername(username: String): User? {
        return users.find { it.username == username }
    }
} 
