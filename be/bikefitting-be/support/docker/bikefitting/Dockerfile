FROM openjdk:21-jdk-slim

COPY be/bikefitting-be/*.jar app.jar

ENTRYPOINT ["java", "-jar", "/app.jar"]

EXPOSE 8080