# Roxiler Backend API

#### Table of Contents

- [Introduction](#introduction)
- [Directory Structure](#directory-structure)
- [Environment Variable](#environment-variable)
- [API References](#api-reference)
- [Run Locally](#run-locally)

## Introduction

This backend API is designed to manage transaction data, offering functionalities such as listing transactions with search and pagination, generating statistics, and providing data for bar and pie charts. It utilizes PostgreSQL for data storage and is built with Node.js and Express.

## Features

- **List Transactions**: Supports filtering by month, search by title/description/price, and pagination.
- **Generate Statistics**: Calculates total sales amount, and counts of sold and not sold items for a selected month.
- **Bar Chart Data**: Generates data for displaying the number of transactions within predefined price ranges for a selected month.
- **Pie Chart Data**: Provides counts of transactions by category for a selected month.
- **Initialize Database**: An API endpoint to initialize the database with predefined JSON data.

## Directory Structure

```bash
  ├── server
  │   ├── controllers
  │   │     ├── chart.controller.js
  │   │     └── transactions.controller.js
  │   ├── routes
  │   │     ├── index.js
  │   │     ├── chart.routes.js
  │   ├── config
  │   │     └── postgresql.js
  │   └── index.js
  ├── package.json
  └── README.md
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file on root directory.

`DATABASE_URL = "<your postgresql connection string>"`

You can use https://dashboard.render.com/new/database to host postgresql database


## API Reference

API is hosted on render.com and can be accessed using base url: https://roxiler-backend-gr7z.onrender.com


Use base url as prefix for all the below mentioned endpoints.

e.g. https://roxiler-backend-gr7z.onrender.com/transactions

GET /initialize: Initializes the database with predefined data.
GET /transactions: Lists transactions with support for, search, and pagination.
GET /chart/statistics: Generates statistics for a selected month.
GET /chart/bar-chart: Provides data for the bar chart based on price ranges for a selected month.
GET /chart/pie-chart: Delivers data for the pie chart showing transaction counts by category for a selected month.

## Run Locally

Clone the project

```bash
  git clone https://github.com/RaghavendraPatel/Roxiler-Backend.git
```

Go to the project directory

```bash
  cd Roxiler-Backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```
