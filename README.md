# Artisan Vault

## Description

Artisan Vault is a digital platform where artists can showcase their artwork. Artists can upload their pieces along with details such as name, description, image, and price in ETH. Users can view a wide array of art, and future functionality will include the ability to purchase art directly through the platform with blockchain integration.


## Key Features

- Artist authentication and profile management
- Artwork upload with details (name, description, image, price in ETH)
- Artwork visibility management (enable/disable)
- Profile information updates for artists


## Technologies Used

- Frontend: React with TypeScript
- Backend: Firebase with Cloud Functions
- Authentication: Firebase Authentication
- Database: Firestore
- Hosting: Firebase Hosting
- Storage: Firebase Storage


### Prerequisites
- Node.js (LTS version)
- npm or Yarn (latest version)
- Firebase CLI (Install with `npm install -g firebase-tools`)


## Getting Started

To get started with the Artisan Vault app, follow these steps:

1. Clone the repository to your local machine:
git clone [https://github.com/yourusername/artisan-vault.git](https://github.com/Hadiaaanvd/artisan-vault.git)
cd artisan-vault

2. Install the necessary dependencies:
yarn or npm install 

3. Start the development server:
yarn start or npm start

4. Visit (http://localhost:3000) in your browser to view the app.


## Scripts

- `npm start` - Starts the development server.
- `npm test` - Runs tests in interactive watch mode.
- `npm run build` - Compiles and bundles the React app for production deployment.
- `npm run eject` - **Note: This is irreversible.** Ejects the app from the create-react-app build script.


## Deployment

To deploy the app, after building it using `npm run build` or `yarn build`, follow the instructions provided by your hosting service. For Firebase Hosting, the Firebase CLI can be used to deploy the app.

To deploy specific services, such as Firestore rules, functions, or hosting, you can use the following command: firebase deploy --only firestore:rules, functions, hosting



## Future Enhancements

- Blockchain integration for secure and transparent transactions
- Wallet integration for processing payments and managing art ownership


## Contact

For any inquiries or contributions, please contact:

Hadia Naveed
- **Email**: hadiaaanvd@gmail.com


## Contributing

Contributions are welcome! Please feel free to submit a pull request or create an issue for bugs, questions, or new features.


## License

This project is open source and available under the [MIT License](https://opensource.org/license/mit/).


