package curlin.danko.bikefitting.service

import curlin.danko.bikefitting.model.dto.InputForm
import org.springframework.stereotype.Service
import org.thymeleaf.TemplateEngine
import org.thymeleaf.context.Context
import org.xhtmlrenderer.pdf.ITextRenderer
import java.io.ByteArrayOutputStream
import java.time.format.DateTimeFormatter
import java.util.*

@Service
class PdfService(
    private val templateEngine: TemplateEngine
) {
    
    fun generateBikeFittingReport(inputForm: InputForm, recordId: Long): ByteArray {
        try {
            // Create template context with data
            val context = Context(Locale.ENGLISH)
            context.setVariable("form", inputForm)
            context.setVariable("recordId", recordId)
            context.setVariable("dateFormatted", formatDate(inputForm.date))
            
            // Extract and prepare images
            val images = extractImages(inputForm)
            context.setVariable("images", images)
            
            // Process the template
            val htmlContent = templateEngine.process("bike-fitting-report", context)
            
            // Convert HTML to PDF
            return convertHtmlToPdf(htmlContent)
            
        } catch (e: Exception) {
            throw RuntimeException("Failed to generate PDF report", e)
        }
    }
    
    private fun extractImages(inputForm: InputForm): Map<String, String> {
        val images = mutableMapOf<String, String>()
        
        // Extract base64 images and ensure they have proper data URI format
        if (inputForm.initialRiderPhoto.isNotBlank()) {
            images["initialRiderPhoto"] = formatBase64Image(inputForm.initialRiderPhoto)
        }
        
        if (inputForm.finalRiderPhoto.isNotBlank()) {
            images["finalRiderPhoto"] = formatBase64Image(inputForm.finalRiderPhoto)
        }
        
        if (inputForm.forwardSpinalFlexionPhoto.isNotBlank()) {
            images["forwardSpinalFlexionPhoto"] = formatBase64Image(inputForm.forwardSpinalFlexionPhoto)
        }
        
        return images
    }
    
    private fun formatBase64Image(base64String: String): String {
        // If it already starts with data:image, return as is
        if (base64String.startsWith("data:image/")) {
            return base64String
        }
        
        // Otherwise, assume it's a PNG and add the data URI prefix
        return "data:image/png;base64,$base64String"
    }
    
    private fun formatDate(date: java.time.LocalDate): String {
        val formatter = DateTimeFormatter.ofPattern("MMMM d'${getOrdinal(date.dayOfMonth)}', yyyy", Locale.ENGLISH)
        return date.format(formatter)
    }
    
    private fun getOrdinal(day: Int): String {
        return when {
            day in 11..13 -> "th"
            day % 10 == 1 -> "st"
            day % 10 == 2 -> "nd"
            day % 10 == 3 -> "rd"
            else -> "th"
        }
    }
    
    private fun convertHtmlToPdf(htmlContent: String): ByteArray {
        val outputStream = ByteArrayOutputStream()
        
        val renderer = ITextRenderer()
        renderer.setDocumentFromString(htmlContent)
        renderer.layout()
        renderer.createPDF(outputStream)
        
        return outputStream.toByteArray()
    }
} 