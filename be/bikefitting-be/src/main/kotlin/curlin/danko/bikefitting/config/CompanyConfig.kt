package curlin.danko.bikefitting.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "company")
data class CompanyConfig(
    var name: String = "Your Company Name",
    var tagline: String = "Professional Bike Fitting Services",
    var address: String = "Your Address",
    var phone: String = "Your Phone",
    var email: String = "your-email@domain.com",
    var website: String = "www.yourwebsite.com",
) 
