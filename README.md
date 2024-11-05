# Image Processing API

Welcome to the Image Processing API! This API allows you to upload, process, and download images with a variety of functionalities, including resizing, cropping, and applying filters like grayscale, blur, and watermarking. 

This project is built with **TypeScript** and **Express**, following the MVC pattern. It includes unit tests, CI/CD with GitHub Actions, and is deployed to [Render](https://alaa-yahia-typescript.onrender.com/).


## Features

- **Image Upload**: Upload images for processing.
- **Image Resizing**: Resize images to specified dimensions.
- **Image Cropping**: Crop images based on given coordinates.
- **Filters**: Apply filters to images:
  - Grayscale
  - Blur
  - Watermarking
- **Image Download**: Download processed images.

## Technologies

- **Backend**: Node.js, Express
- **Languages**: TypeScript
- **Image Processing**: [Sharp](https://www.npmjs.com/package/sharp)
- **Upload Handling**: [Multer](https://www.npmjs.com/package/multer)
- **Validation**: [Express-Validator](https://www.npmjs.com/package/express-validator)
- **Error Handling**: Custom Middleware
- **Testing and CI/CD**: GitHub Actions
- **Deployment**: [Render](https://render.com/)

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js (>= 14.x)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/username/repo-name.git
   cd Alaa-Yahia-typescript
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the API

To start the development server with nodemon:
```bash
npm run build
npm start
```


## Error Handling

Each endpoint includes validation using **express-validator** to ensure input integrity.

The API has custom error-handling middleware, which ensures consistent and readable error responses.

## Testing

Unit tests are included to cover core functionality, ensuring reliability in all processing features. The testing pipeline is automated with **GitHub Actions** to maintain CI integrity.

To run tests:
```bash
npm test
```

## Deployment

The application is automatically deployed to [Render](https://render.com) on merge to the main branch via GitHub Actions.

Live deployment: [https://alaa-yahia-typescript.onrender.com/](https://alaa-yahia-typescript.onrender.com/)


---

