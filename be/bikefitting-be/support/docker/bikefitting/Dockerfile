FROM eclipse-temurin:21-jdk-jammy

COPY be/bikefitting-be/build/libs/*.jar /app.jar

ENTRYPOINT ["java", "-jar", "/app.jar"]

EXPOSE 8080