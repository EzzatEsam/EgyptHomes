# Egypt Homes

Egypt Homes is a full-stack real estate platform designed to allow users to search, post, and explore property listings with ease. It integrates modern technologies to offer a seamless user experience for both property seekers and owners.

## Key Features

- **Full-Featured Property Listings**: Users can browse a wide range of properties, complete with detailed information like price, location, size, and amenities.
- **Advanced Search Filters**: The search functionality includes filtering by governorate, city, property type (house, office), price range, and amenities, making it easier to find relevant properties.
- **User Authentication**: Sign-in and registration are supported via standard local credentials or through OAuth2 with Google using NextAuth.
- **JWT Authentication**: Secure authentication and session management using JSON Web Tokens (JWT) for the backend API.
- **Bookmarking & Contacting**: Users can bookmark properties and directly contact property owners via phone, email, or WhatsApp.
- **Paginated Results**: The platform supports paginated results, ensuring a smooth experience even with large data sets.
- **Responsive UI**: The front-end is built with Next.js and styled using TailwindCSS and DaisyUI, offering a modern and responsive user interface.

## Tech Stack

- **Backend**:
  - ASP.NET Core
  - Entity Framework Core
  - PostgreSQL (Remote database)
  - JWT Authentication
- **Frontend**:

  - Next.js (React Framework)
  - TailwindCSS (for modern UI components)
  - DaisyUI (for pre-built UI elements)

- **Authentication**:
  - NextAuth.js for OAuth2 (Google Sign-in)
- **Additional Technologies**:
  - Image upload support for property listings
  - REST API design for communication between the frontend and backend

## Screenshots

### Login Page

![Login Page](/.github/images/login.png)  
Sign in with Google to access your account.

### Home Page

![Home Page](/.github/images/home.png)  
Browse recent properties with price and key details such as size, number of rooms, and location.

### Property Search

![Search Page](/.github/images/search.png)  
Utilize filters to narrow down properties by location, price, and type.

### Property Details

![Property Details](/.github/images/preview.png)  
View property details and contact owners directly.

### Create New Property

![Create New Property](/.github/images/add.png)  
Create a new property listing.

## How to Use

### Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/)
- A running [PostgreSQL](https://www.postgresql.org/download/) database

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/EzzatEsam/EgyptHomes.git
   cd EgyptHomes
   ```

2. **Backend Setup:**

   - Navigate to the backend directory and set up the database connection string in `appsettings.json`.
   - Migrate the database:
     ```bash
     dotnet ef migrations add InitialCreate
     dotnet ef database update
     ```
   - Run the backend:
     ```bash
     dotnet run
     ```

3. **Frontend Setup:**

   - Navigate to the frontend directory:
     ```bash
     cd frontend
     npm install
     npm run dev
     ```

4. **Environment Variables:**

#### Backend

- `JwtAuth:`: JWT authentication configuration.
- `database:default`: Connection string for your postgres database.
- `Google:cid`: Google client ID.

#### Frontend

- `SERVER_ADDR`: Backend server address.
- `AUTH_SECRET`: Secret key for NextAuth.
- `GOOGLE_CLIENT_ID`: Google client ID.
- `GOOGLE_CLIENT_SECRET`: Google client secret.

### Usage

- **Sign up**: Users can sign up using local credentials or Google.
- **Post a property**: Authenticated users can post a property with details like price, location, and images.
- **Search**: Filter properties based on your preferences and contact property owners directly.
- **Bookmark**: Save properties for later.
- **Contact**: Directly contact property owners via phone, email, or WhatsApp.

## Contributing

Feel free to submit pull requests if you'd like to contribute to the project. Make sure to follow standard best practices for code quality and testing.

## License

This project is licensed under the MIT License.
