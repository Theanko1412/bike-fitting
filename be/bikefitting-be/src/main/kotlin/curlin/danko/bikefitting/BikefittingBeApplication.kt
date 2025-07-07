package curlin.danko.bikefitting

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication

@SpringBootApplication
@ConfigurationPropertiesScan
class BikefittingBeApplication

fun main(args: Array<String>) {
    runApplication<BikefittingBeApplication>(*args)
}
