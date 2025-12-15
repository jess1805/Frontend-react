## Frontend – User Management Assignment

This frontend was built **as part of an assignment** to demonstrate:

- **React Native (Expo – Web)**
- **REST API integration**
- **Basic frontend validation**
- **Error handling**

The primary focus was on:
- Implementing the **required screens**
- Correctly **connecting the frontend to the backend APIs**
- Ensuring **clean data flow and user feedback** on API success/failure

---

### Platform
- Runs on **Web using Expo**

---

### Installation

**Install dependencies:**
npm install

---

### Running the Frontend

**Start the Expo development server:**
- npx expo start
- Press **`w`** to run the application on **web**

The app runs at:
**http://localhost:8081**

---

### Screens Implemented

#### Add User Screen
- Takes **name**, **email**, and **phone number** as input  
- Sends data to the backend using a **POST** request  
- Displays **validation errors** and **backend error messages** directly on the screen  
- Shows **success feedback** after a user is added  

#### User List Screen
- Fetches users from the backend using a **GET** request  
- Displays users in a **simple list/card layout**  
- Allows **deleting a user** using a **DELETE** request  
- Includes **basic search** by **name or email**

---

### API Usage

The frontend interacts with the following backend endpoints:

- **POST `/api/users/add`**  
  Used to add a new user.

- **GET `/api/users`**  
  Used to fetch all users.

- **DELETE `/api/users/:id`**  
  Used to delete a user.

---

### Backend Configuration

The backend is expected to be running on:

**http://localhost:5050**

---

### Validation and Error Handling

- **Basic input validation** is performed on the frontend to improve user experience  
- **Strict validation** and **uniqueness checks** are handled by the backend  
- **Backend error messages** are cleaned and displayed clearly on the frontend


