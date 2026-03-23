FROM amazoncorretto:21-alpine-jdk

COPY be/bikefitting-be/*.jar /app.jar

ENTRYPOINT ["java", "-jar", "/app.jar"]

EXPOSE 8080