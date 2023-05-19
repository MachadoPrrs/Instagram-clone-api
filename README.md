# Instagram-clone-api
Instagram API with node js and express

### Introduction
This exciting API project is an Instagram clone, a popular social media platform focused on sharing photos and videos. 
I have drawn inspiration from Instagram's functionality to create a similar application with node.js and mongodb.

### Features
- Authentication and Authorization: The API creates a JWT that allows the user to access the resources they have permission for.
- User Account Creation: Users can create an account by providing basic information such as username, email, and password.
- User Profiles: Users can create, view, and edit their own user profiles.
- Photo and Video Posting: Users can post photos and videos, add descriptions, and tag other users in the posts.
- News Feed: Users can view a news feed that displays posts from the users they follow.
- Comments: Users can comment on other users' posts.
- Likes: Users can like posts.
- Search: Users can search for users and hashtags.
- Direct Messaging: Users can send direct messages to other users.

### Setup the dependencies
To install all the dependencies use:
```
npm install
```

### Setup the environment variables
```
PORT: 3000, 
NODE_ENV: development, 
MONGO_LOCAL_URL: the local url of mongodb, 
JWT_SECRET: secret key to verify the token, 
JWT_EXPIRES_IN: token expiration time, 
EMAIL_HOST: email host from nodemailer, 
EMAIL_USERNAME: email user from nodemailer, 
EMAIL_PASSWORD: email password from nodemailer
```

### Setup postman
In the Postman folder, there is a file that contains the JSON-formatted configuration of the workspace for this project.

