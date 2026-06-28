# StyleHub - Multi-Tenant Salon Booking & Management Platform

StyleHub is a premium, enterprise-grade multi-tenant salon discovery, booking, and management application. It features a modern microservices backend built on Spring Cloud and a responsive, high-fidelity Single Page Application (SPA) frontend built on React, Vite, Tailwind CSS, and Material-UI.

---

## 🏗️ Architecture Blueprint

StyleHub is decomposed into 10 Java microservices orchestrating business flows and 3 core infrastructure components:

```mermaid
graph TD
    User([Customer / Partner Browser]) --> Gateway[Gateway Service :8081]
    Gateway --> Eureka[Eureka Discovery Server :8070]
    Gateway --> Keycloak[Keycloak IAM :8080]
    Gateway --> UserSrv[User Service :5001]
    Gateway --> SalonSrv[Salon Service :5002]
    Gateway --> CatSrv[Category Service :5003]
    Gateway --> OfferSrv[Offering Service :5004]
    Gateway --> BookSrv[Booking Service :5005]
    Gateway --> PaySrv[Payment Service :5006]
    Gateway --> RevSrv[Review Service :5007]
    Gateway --> NotificationSrv[Notification Service :5008]

    UserSrv & SalonSrv & CatSrv & OfferSrv & BookSrv & PaySrv & RevSrv & NotificationSrv --> MySQL[(MySQL DB :3306)]
    BookSrv & NotificationSrv --> RabbitMQ[RabbitMQ Message Broker :5672]
```

### Downstream Business Services
* **User Service** (`:5001`): Customer & Salon Owner account profiles.
* **Salon Service** (`:5002`): Salon tenant registry and metadata.
* **Category Service** (`:5003`): Category taxonomy for styling and wellness treatments.
* **Service Offering Service** (`:5004`): Treatment catalog, pricing, and durations.
* **Booking Service** (`:5005`): Slot allocation, reservations, and state machines.
* **Payment Service** (`:5006`): Gateway integrations and payouts.
* **Review Service** (`:5007`): Customer ratings and review processing.
* **Notification Service** (`:5008`): WebSocket-based real-time alerts.

---

## 🎨 Interactive Showcase Features

1. **Dual-Persona Auth Gateway**: Switch between **Customer** and **Partner** portals with an integrated **Demo Autofill ⚡** login utility.
2. **Proximity Location Filter**: A Swiggy/Zomato-style tabbed location filter listing active cities (London, Manchester, Hyderabad) and live-filtering cards.
3. **Amenities Grid**: Beautiful preview of service-specific facilities (WiFi, A/C, welcome drinks, certified stylists) on the details view.
4. **Dynamic Ratings**: Star rating badges generated dynamically per salon card.

---

## 📐 Low-Level Design (LLD) & Software Engineering Patterns

This section details the technical architecture of StyleHub, outlining the architectural/design patterns and Object-Oriented Programming (OOP) principles implemented across the microservices and SPA frontend.

### 🏛️ Software Design Patterns Used

1. **3-Tier Layered Architecture Pattern (MVC Variant)**
   * **Controller Layer**: Decouples incoming requests and routing from business computations. E.g., [BookingController](file:///c:/Users/radhi/Desktop/Radhika/Stylehub/StyleHub_Backend-main/booking-service/src/main/java/com/badam/bookingservice/controller/BookingController.java) receives REST actions, processes authenticated headers (`X-User-Email`), and delegates to downstream services.
   * **Service Layer**: Contains core business logic and transaction limits (such as duration summing, price calculations, and slot schedules).
   * **Repository Layer**: Abstracts database manipulation operations behind structured JPA data access models.

2. **Data Transfer Object (DTO) Pattern**
   * Decouples persistent database entities from the network-level APIs. Specific payload definitions (such as `UserDTO`, `SalonDTO`, and `BookingRequest`) are used to serialize, filter, and structure the data transferred over HTTP.

3. **Mapper Pattern (Data Transformer)**
   * Implements utility data mapping classes like [BookingMapper](file:///c:/Users/radhi/Desktop/Radhika/Stylehub/StyleHub_Backend-main/booking-service/src/main/java/com/badam/bookingservice/mapper/BookingMapper.java) to isolate conversions between persistent entity objects (e.g., `Booking`) and their client-facing representation records (`BookingDTO`).

4. **Proxy Pattern (Declarative REST Clients)**
   * Leverages Spring Cloud OpenFeign clients (such as `UserFeignClient` and `SalonFeignClient`). These are interface contracts annotated with `@FeignClient`. Spring generates concrete HTTP-based proxy logic dynamically at runtime, concealing the complexity of inter-service REST endpoints.

5. **Dependency Injection & Inversion of Control (DI/IoC)**
   * Managed via the Spring IOC container. Component classes are marked with `@Service` or `@RestController`, and their dependencies (repositories, clients) are injected via constructor-based DI (aided by Lombok's `@RequiredArgsConstructor` annotation on final fields), allowing loose coupling and mockability during testing.

6. **Observer (Pub-Sub) Pattern**
   * **Async Event Broker**: Implemented via RabbitMQ exchanges. Operations (like successfully booking a service) dispatch async messages. A downstream `NotificationEventConsumer` observes and handles notifications out-of-band.
   * **Frontend State**: Controlled via Redux Toolkit (configured in [store.js](file:///c:/Users/radhi/Desktop/Radhika/Stylehub/StyleHub_Frontend-main/src/Redux/store.js)), where single-source-of-truth stores update React state dynamically, prompting visual updates on subscriber pages.

7. **API Gateway & Service Registry Patterns**
   * The `gateway-service` functions as a single entry point reverse proxy routing client requests, while the `eureka-server` registry records dynamic addresses and balances requests between microservice instances.

---

### 🧩 Application of Object-Oriented Programming (OOP) Concepts

#### 1. Abstraction (Hiding Internal Complexity)
* **Service Interfaces**: Separation of contract and concrete implementation is maintained through interfaces such as [BookingService](file:///c:/Users/radhi/Desktop/Radhika/Stylehub/StyleHub_Backend-main/booking-service/src/main/java/com/badam/bookingservice/service/BookingService.java).
* **Database Abstraction**: `BookingRepository` inherits from standard `JpaRepository` interface, hiding the complex JDBC connections, SQL executions, and transaction pools behind boilerplate method invocations.

#### 2. Encapsulation (Restricting Direct Access)
* **Access Modifiers & Accessors**: Internal data structures of entities like [Booking](file:///c:/Users/radhi/Desktop/Radhika/Stylehub/StyleHub_Backend-main/booking-service/src/main/java/com/badam/bookingservice/entity/Booking.java) are protected using `private` field visibility. Access is granted via getter/setter methods auto-generated by Lombok.
* **Process Hiding**: Critical scheduling checks and double-booking validations are encapsulated inside service helper routines (like [isTimeSlotAvailable](file:///c:/Users/radhi/Desktop/Radhika/Stylehub/StyleHub_Backend-main/booking-service/src/main/java/com/badam/bookingservice/service/impl/BookingServiceImpl.java#L72-L104)) keeping REST controllers clean and lightweight.

#### 3. Inheritance (Reusability & Hierarchy)
* **Spring Repository Framework**: Custom database components extend the standard Spring Repository hierarchy to reuse CRUD capabilities.
* **Custom Exceptions Hierarchy**: Exceptional application flows inherit from the core JVM exception class (e.g. `UserException` and `ReviewException` extending `Exception` or `RuntimeException`), defining custom specialized structures.

#### 4. Polymorphism (Contextual Behavior)
* **Service overrides**: Service implementation classes override abstract declarations (annotated with `@Override` in [BookingServiceImpl.java](file:///c:/Users/radhi/Desktop/Radhika/Stylehub/StyleHub_Backend-main/booking-service/src/main/java/com/badam/bookingservice/service/impl/BookingServiceImpl.java)) to provide microservice-specific logic.
* **Polymorphic Exception Handlers**: The global exception router catches parent exception types polymorphic-ally to map custom HTTP response codes depending on the specific subclass type thrown during execution.
* **React Props-Based Styling**: Frontend pages accept styling configurations and callback props polymorphically to adjust rendering behavior (e.g. showing active/inactive badges or altering layout states dynamically).

---

## 🚀 Quick Start Guide

### 1. Prerequisites
* **Docker Desktop** installed and running
* **Node.js** (v18+)
* **Java 17+** & **Maven** (only if compiling backend from source)

### 2. Start the Backend Microservices
Open a PowerShell terminal in `StyleHub_Backend-main` and spin up containers sequentially:
```powershell
# 1. Start core infrastructure
docker compose up -d stylehub-mysql rabbitmq

# 2. Start Keycloak IAM
cd keycloak; docker compose up -d; cd ..

# 3. Start Eureka Discovery Server
docker compose up -d eureka-server

# 4. Start Gateways & Core API routing
docker compose up -d user-service gateway-service

# 5. Start Catalog Services
docker compose up -d salon-service category-service service-offering-service

# 6. Start Booking & Transaction Services
docker compose up -d booking-service payment-service review-service notification-service
```

### 3. Populate Demo Dataset (London, Manchester, Hyderabad)
While the containers are running, execute the populate script to set up mock salons, categories, offerings, and bookings:
```powershell
powershell -ExecutionPolicy Bypass -File .\populate-demo-data.ps1
```

### 4. Start the Frontend Server
Open a separate terminal in `StyleHub_Frontend-main` and run:
```bash
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🎭 Demo Credentials
Use these static accounts to log in instantly via the autofill buttons:

* **Salon Owner (London)**: `jane.stylist_demo@example.com` (Password: `DemoOwnerPass1!`)
* **Salon Owner (Manchester)**: `sergei.spa_demo@example.com` (Password: `DemoOwnerPass1!`)
* **Customer**: `alice.smith_demo@example.com` (Password: `DemoCustPass1!`)
