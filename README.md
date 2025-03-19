## 🏡 Egypt Homes  

Egypt Homes is a full-stack real estate platform that allows users to search, post, and explore property listings with ease. It integrates modern technologies to provide a seamless user experience for both property seekers and owners.  

---

## **🚀 Key Features**  

- **Full-Featured Property Listings** – Browse properties with detailed info like price, location, size, and amenities.  
- **Advanced Search Filters** – Filter by governorate, city, property type (house, office), price range, and amenities.  
- **User Authentication** – Supports sign-in via local credentials or OAuth2 with Google (NextAuth).  
- **JWT Authentication** – Secure authentication and session management with JSON Web Tokens (JWT).  
- **Bookmarking & Contacting** – Save properties and contact owners via phone, email, or WhatsApp.  
- **Paginated Results** – Smooth performance with large datasets.  
- **Responsive UI** – Built with Next.js, TailwindCSS, and DaisyUI for a modern experience.  
- **Multiple Backend Support** – Available in both **ASP.NET Core** and **Spring Boot (Java)** versions.  

---

## **🛠 Tech Stack**  

### **Backend**  
Ther are two backend implementations:  

✅ **Option 1: ASP.NET Core Backend**  
- ASP.NET Core  
- Entity Framework Core  
- PostgreSQL (Remote database)  
- JWT Authentication  

✅ **Option 2: Java (Spring Boot) Backend**  
- Java (Spring Boot)  
- Spring Security (JWT-based authentication)  
- PostgreSQL  
- JPA/Hibernate  

### **Frontend**  
- Next.js (React Framework)  
- TailwindCSS (for modern UI components)  
- DaisyUI (for pre-built UI elements)  

### **Authentication**  
- NextAuth.js for OAuth2 (Google Sign-in)  

### **Additional Features**  
- Image upload support for property listings  
- REST API for frontend-backend communication  

---

## **📸 Screenshots**  

### **Login Page**  
![Login Page](/.github/images/login.png)  
Sign in with Google to access your account.  

### **Home Page**  
![Home Page](/.github/images/home.png)  
Browse recent properties with price and key details.  

### **Property Search**  
![Search Page](/.github/images/search.png)  
Filter properties by location, price, and type.  

### **Property Details**  
![Property Details](/.github/images/preview.png)  
View property details and contact owners directly.  

### **Create New Property**  
![Create New Property](/.github/images/add.png)  
Create a new property listing.  

---

## **💻 How to Run the Project**  

### **Prerequisites**  
- [PostgreSQL](https://www.postgresql.org/download/) (Database)  
- [Node.js](https://nodejs.org/) (Frontend)  
- **Choose a backend option:**  
  - **For .NET Backend:** [.NET 8.0 SDK](https://dotnet.microsoft.com/download)  
  - **For Java Backend:** [Java 17+](https://adoptium.net/) & [Maven](https://maven.apache.org/)  

---

### **🔹 Option 1: Setup ASP.NET Core Backend**  

1️⃣ **Clone the repository:**  
```bash
git clone https://github.com/EzzatEsam/EgyptHomes.git
cd EgyptHomes
```

2️⃣ **Setup the Backend:**  
- Navigate to the backend folder  
- Configure `appsettings.json` with database credentials  
- Run database migrations:  
  ```bash
  dotnet ef migrations add InitialCreate
  dotnet ef database update
  ```
- Start the backend:  
  ```bash
  dotnet run
  ```

---

### **🔹 Option 2: Setup Java (Spring Boot) Backend**  

1️⃣ **Clone the repository:**  
```bash
git clone https://github.com/EzzatEsam/EgyptHomes.git
cd EgyptHomes
```

2️⃣ **Configure Database in `application.properties`:**  
```properties
spring.datasource.url=jdbc:postgresql://your-database-url:5432/your-db
spring.datasource.username=your-username
spring.datasource.password=your-password
```

3️⃣ **Run the backend:**  
```bash
mvn spring-boot:run
```

---

### **🔹 Frontend Setup (For All Backends)**  

1️⃣ **Navigate to the frontend directory:**  
```bash
cd frontend
npm install
npm run dev
```

2️⃣ **Configure Environment Variables (`.env.local`):**  
```ini
NEXT_PUBLIC_SERVER_ADDR=http://localhost:8080  # Java Backend
# OR
NEXT_PUBLIC_SERVER_ADDR=http://localhost:5000  # .NET Backend

NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## **📌 API Configuration**  

### **Backend Environment Variables**  

| Variable | Description |
|----------|------------|
| `JWT_SECRET` | Secret key for JWT authentication |
| `DATABASE_URL` | Connection string for PostgreSQL |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |

---

## **🚀 Usage**  

- **Sign up**: Create an account using email/password or Google.  
- **Post a property**: Add property details like price, location, and images.  
- **Search**: Find properties based on filters.  
- **Bookmark**: Save properties for later.  
- **Contact**: Reach owners via phone, email, or WhatsApp.  

---

## **🤝 Contributing**  

Feel free to submit pull requests! Follow standard best practices for clean and tested code.  

---

## **📜 License**  

This project is licensed under the **MIT License**.  
