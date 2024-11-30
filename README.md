# AyurGuru Backend 🌱

### Introduction 🌿  
AyurGuru is a web-based chatbot designed to provide personalized ayurvedic remedies and health solutions. This backend is built to handle user authentication, manage conversations, upload medical reports or images and store them securely. It integrates MongoDB and PostgreSQL to ensure seamless and efficient data management.  

### Tech Stack 🛠️  
- **Node.js**: Backend runtime environment.  
- **Express.js**: Framework for building RESTful APIs.  
- **MongoDB**: Database for managing user data and conversations.  
- **PostgreSQL**: Database for storing file uploads.  
- **Multer**: Middleware for handling file uploads.  
- **JWT**: Secure user authentication.  
- **Google Sheets API**: Storing contact form details securely.  
- **dotenv**: Manage environment variables.  
- **bcryptjs**: Password hashing for secure storage.  
- **cors**: Handle cross-origin requests.

### Features 🚀  
1. **User Authentication**: Secure signup/sign-in with JWT tokens.  
2. **Conversations**: Real-time personalized chatbot conversations.  
3. **File Uploads**: Upload medical reports or images (stored in PostgreSQL).  
4. **File Retrieval**: Download uploaded files by filename.  
5. **File Deletion**: Delete uploaded files and their references from databases.  
6. **Contact Form**: Submits data securely to Google Sheets.  
7. **Personalized Chats**: Manage and retrieve chat history.  

### Installation and Setup ⚙️  
Follow these steps to set up and run the backend locally:  

1. **Clone the Repository**  
   ```bash  
   git clone https://github.com/Khagesh2409/Ayurguru-backend.git
   cd Ayurguru-backend
   ```  

2. **Install Dependencies**  
   ```bash  
   npm install  
   ```
3. **PostgreSQL query to be writen while deploying Postgre db**
   ```sql
     CREATE TABLE user_files (
     id SERIAL PRIMARY KEY,                -- Auto-incrementing primary key
     user_id VARCHAR(255) NOT NULL,        -- User identifier (foreign key reference, if needed)
     filename VARCHAR(255) NOT NULL,       -- Name of the uploaded file
     file_data BYTEA NOT NULL,             -- Binary data of the file
     file_type VARCHAR(50) NOT NULL,       -- Type of the file (image/pdf)
     uploaded_at TIMESTAMP DEFAULT NOW(),  -- Timestamp of file upload (defaults to current time)
     mongodb_id VARCHAR(255) NOT NULL      -- MongoDB ID reference
     );
   ```

5. **Environment Variables**  
   Create a `.env` file and add the following:  
   ```plaintext  
    MONGO_URI=<MONGO_URI>
    JWT_SECRET=<SECRET>
    AUTH_MESSAGE=<AUTH_MESSAGE>
    PG_URI2=<URL>
    PG_URI=<URL>
    SPREADSHEET_ID=<SPREADSHEET_ID>
    TYPE=<TYPE_OF_ACCOUNT>
    PROJECT_ID=<PROJECT_ID>
    PRIVATE_KEY_ID=<GOOGLE_PRIVATE_KEY_ID>
    PRIVATE_KEY=<PRIVATE_KEY_VALUE>
    CLIENT_ID=<CLIENT_ID>
    AUTH_URI=<AUTHENTICATION_URL>
    TOKEN_URI=<TOKEN_URI>
    AUTH_PROVIDER_X509_CERT_URL=<CERT_URL>
    CLIENT_X509_CERT_URL=<CERT_URL>
    UNIVERSE_DOMAIN=<URL> 
   ```  

6. **Run the Application**  
   ```bash  
   node app.js
   ```  
   The server will start on `http://localhost:5000`.  


### API Routes 📄

#### **Authentication**  
1. **POST /api/auth/signup**: User registration.  
   - **Body**: `{ "email": "...", "username": "...", "password": "..." }`  

2. **POST /api/auth/signin**: User login.  
   - **Body**: `{ "email": "...", "password": "..." }`  

3. **POST /api/auth/is-auth**: Verify user authentication.  
   - **Body**: `{ "token": "..." }`  


#### **Conversations**  
1. **POST /api/conversations**: Retrieve all user conversations.  
2. **POST /api/conversations/new**: Start a new conversation.  
3. **POST /api/conversations/:conversationId**: Add a new chat message to a conversation.  
4. **GET /api/conversations/:conversationId**: Retrieve chats of a specific conversation.  
5. **DELETE /api/conversations/:conversationId**: Delete a conversation.  


#### **File Management**  
1. **POST /upload**: Upload a medical report or image.  
   - **Form Data**: `file`, `userId`, `mongodb_id`.  
2. **GET /userfiles/:userId**: Get uploaded filenames by user ID.  
3. **GET /pdf/:filename**: Download a file by its name.  
4. **DELETE /delete/:userId/:filename**: Delete a file from both MongoDB and PostgreSQL.  


#### **Contact Form**  
1. **POST /api/contact/submit**: Submit contact details to Google Sheets.  
   - **Body**: `{ "name": "...", "email": "...", "message": "..." }`  


#### **Personalized Chats**  
1. **POST /api/personalizedChats/checkPersonalizedChats**: Check if personalized chats exist for a user.  
2. **POST /api/personalizedChats/getPersonalizedChats**: Retrieve personalized chats.  
3. **POST /api/personalizedChats/addPersonalizedChat**: Add a new personalized chat.  


### Folder Structure 📂  
```
├── config/          # Configuration files
├── middleware/      # Middleware functions
├── models/          # MongoDB models  
├── routes/          # API route handlers  
├── uploads/         # Temporary file storage  
├── app.js           # Entry point  
├── .env             # Environment variables  
```  

### How It Works 💡  
- **Conversations and User Data**: Managed with MongoDB.  
- **File Storage**: Uploaded files are stored in PostgreSQL for security and flexibility.  
- **Chat Personalization**: Enables real-time responses tailored to users.  
- **Contact Management**: Stores details in Google Sheets using API.  

## Contribute to Ayurguru! 🌟
Feel free to contribute or raise issues. Happy coding! 🚀
