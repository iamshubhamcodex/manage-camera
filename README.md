# Manage Camera Project Documentation

## 1. Installation & Setup

Follow the steps below to set up the project locally on your machine.

---

### 1.1 Fork the Repository (Optional)

If you intend to make changes or contribute to this project:

- Navigate to the GitHub repository.
- Click on the **Fork** button (top-right corner).
- This will create a personal copy under your GitHub account.

---

### 1.2 Clone the Repository

Clone the project repository to your local system using the following command:

```bash
git clone https://github.com/iamshubhamcodex/manage-camera.git
```

OR

```bash
git clone <your-forked-repository.git>
```

Navigate into the project directory

```bash
cd manage-camera
```

---

### 1.3 Installation Steps

Install vite, react packages and tailwindcss

```bash
npm install
```

### 1.4 Running in local

To run the setup enter following command:

```bash
npm run dev
```

## Project Overview

This projects shows the list of all Camera(s) that are being used (or installed). This does not only displays list of camera(s) available but also details like health, status, location, recorder, tasks( AI Assigned Task to that Camera). Thus this simple module provides the full overview of all installed / used across the system.

This project also provides a simple way to update the status of camera(s).

## Folder Structure

```
public
  |- logo.svg
src
  |- apiService
      |- camera.ts (Contains all api logic of camera module)
  |- assets
      |- All Icons that are used in the project
  |- components
      |- common
           |- SVGWrapper.tsx (SVG wrapper common component)
      |- Components related to Camera Manage
  |- css
      |- common
           |- datatable.css ( common css file for dataTable used in this project)
      |- manageCamera.css
  |- types
      |- common
           |- datatabl.d.ts (common types related to states defined here)
  |- utils
      |- utility.ts (common utility function for filtering the data)
  |- App.tsx
  |- index.css (Global CSS related to project)
  |- main.tsx
index.html
package.json
README.md
vite.config.ts
```

## Logic behind Implementation

Accessing the list of all available camera(s) from the GET API. And then storing them in Zustand store (useCameraStore). Then rendering the all camera(s) in `CameraTable.tsx` component using custom datatable component `DataTable.tsx`. This common cum custom DataTable component has minimal code just for rendering the basic table and simple formatting, pagination and sorting.

Camera Table has following fields:

- Name
- Health (health of device & cloud)
- Locations
- Recorder
- Tasks
- Status
- Action (Deletes from the current data)

To Update the status of Each Camera user can click on existing status, It will trigger the API and then udpate the table with opposite status (like Active => Inactive and vice-versa).

Deleting the camera row will temporary remove it from the state stored (refreshing the page will again show the same camera)

## Dependencies (Kept minimal)

- React.js
- Typescript
- TailwindCSS
- Vite
- Zustand
