# URL Status Checker

This is a simple URL status checker built with Node.js, Express, and EJS that checks the availability of a list of URLs and tracks their uptime over time. It provides a simple web interface and an API to check the status and uptime of the URLs.

## Features

- **URL Status Checking**: The server fetches the status of URLs from a JSON file (`urls.json`) and checks their availability.
- **Uptime Tracking**: Tracks uptime percentages for each URL with the last 20 checks stored.
- **API Access**: Provides a RESTful API to get the status and uptime of each URL.
- **Web Interface**: A basic web page displaying the status of all monitored URLs.
- **Automatic Status Updates**: The server checks the status of URLs every minute and updates the uptime data.

## Prerequisites

To run this project locally, you need the following:

- Node.js installed on your machine.
- `urls.json` file containing the list of URLs to monitor. See below for the file structure.
