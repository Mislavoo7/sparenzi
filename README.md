# Sparenzi
This is an example mobile app, a showcase project. It is a React Native (Expo) application that enables users to track their daily expenses while shopping for groceries. 

## Backend
Sparenzi uses [Sparenzi Web](https://sparenzi.eu/) ([Repository](https://github.com/Mislavoo7/sparenziweb)) as its backend.  
Sparenzi Web handles user authentication and registration, saving and presenting lists and products, storing user preferences such as language, currency, and theme, and providing access to legal pages.  

The Sparenzi mobile app serves as a simpler and more user-friendly interface for using Sparenzi Web.

## Features 

### Registration and Login
Users can register or log in by entering their email and password. If Sparenzi Web determines that the login is valid, it returns a token for further usage.

### Adding Products and Lists
Users can add products without being signed in, but to save them in a list, logging in is required. Once authenticated, users can create, delete, or update lists and manage products within them. All lists and products are stored one the Sparenzi Web platform.

### Settings 
For a better user experience, the mobile app allows users to:  
- Choose from three languages: Croatian, English, or German.  
- Select a preferred currency (€ or $). Lists also have their own currency field, so for example, if the user’s default is Euros but they shop in the USA, that specific list can be stored in Dollars.  
- Switch between a light or dark theme.  

### Legal Pages and Web
The mobile app includes a legal page section where users can read legal documents in Croatian, English, or German without changing their settings. A link to Sparenzi Web is also provided for direct access.

## Live
Sparenzi is not available on the Google Play Store yet. The publishing rules on Google Play are currently a challenge, for example: one requirement is to *"have at least 12 testers opted into your closed test"*. Finding 12 testers has proven to be quite difficult.  

However, upon request, I can provide access to the app via Expo Go for anyone interested in testing it.

<img width="271" height="603" alt="Screenshot_20250913-223416" src="https://github.com/user-attachments/assets/864b2e80-59c6-4a9a-88fc-ad1d635f7617" />
<img width="271" height="603" alt="Screenshot_20250913-223526" src="https://github.com/user-attachments/assets/ff9f9d2a-772b-46b8-bad6-e0091b82fd2f" />
<img width="271" height="603" alt="Screenshot_20250913-223535" src="https://github.com/user-attachments/assets/076e381e-b88b-4f91-bab3-e7bd23c72c0f" />

