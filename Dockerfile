# Start from an official OpenJDK image
FROM openjdk:21-jdk

# Set working directory inside container
WORKDIR /app

# Copy the built jar into the container
COPY target/*.jar app.jar

# Expose port 8080
EXPOSE 8011

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
