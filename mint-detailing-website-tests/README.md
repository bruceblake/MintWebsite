# Mint Detailing Website - Test Suite

This repository contains end-to-end tests for the Mint Detailing website using Playwright.

## Overview

The test suite covers:

- Core navigation and page accessibility
- "Get a Free Quote" form functionality
- Visual elements and placeholder images
- Responsive design and mobile menu behavior

## Prerequisites

### Standard Installation
- Node.js (v14 or newer)
- npm or yarn

### Docker Installation (Recommended)
- Docker installed and running on your system

## Installation

### Standard Installation

1. Clone this repository or navigate to the test directory
2. Install dependencies:

```bash
cd mint-detailing-website-tests
npm install
```

### Docker Installation

1. Clone this repository or navigate to the test directory
2. Build the Docker image:

```bash
cd mint-detailing-website-tests
docker build -t mint-detailing-tests .
```

## Configuration

The tests are now configured with the following defaults:

- By default, tests will run against the live Netlify site: `https://mintdetailing.netlify.app`
- You can override the URL using the `BASE_URL` environment variable

### Overriding the Base URL

To test against a different URL:

```bash
# Standard installation
BASE_URL=http://localhost:3000 npm test

# Docker installation
docker run --rm -e BASE_URL=http://localhost:3000 mint-detailing-tests
```

### Testing with a Local Development Server

When running tests against a local server:

#### On Linux with Docker:
```bash
docker run --rm --network="host" -e BASE_URL=http://localhost:3000 mint-detailing-tests
```

#### On Mac/Windows with Docker:
```bash
docker run --rm -e BASE_URL=http://host.docker.internal:3000 mint-detailing-tests
```

## Running Tests

### Standard Installation

#### Run all tests

```bash
npm test
```

#### Run tests in headed mode (with browser visible)

```bash
npm run test:headed
```

#### Run tests with UI mode for debugging

```bash
npm run test:ui
```

#### Run tests in specific browsers

```bash
# Chrome/Chromium only
npm run test:chrome

# Firefox only
npm run test:firefox

# Safari/WebKit only
npm run test:webkit
```

#### Run specific test files

```bash
# Run navigation tests only
npx playwright test navigation.spec.js

# Run form tests only
npx playwright test quoteForm.spec.js
```

### Docker Installation

#### Run all tests

```bash
docker run --rm mint-detailing-tests
```

#### Run tests in specific browsers

```bash
# Chrome/Chromium only
docker run --rm mint-detailing-tests npx playwright test --project=chromium

# Firefox only 
docker run --rm mint-detailing-tests npx playwright test --project=firefox

# Safari/WebKit only
docker run --rm mint-detailing-tests npx playwright test --project=webkit
```

#### Run specific test files

```bash
# Run navigation tests only
docker run --rm mint-detailing-tests npx playwright test tests/navigation.spec.js

# Run form tests only
docker run --rm mint-detailing-tests npx playwright test tests/quoteForm.spec.js
```

## Test Structure

The tests are organized in the following files:

- `navigation.spec.js`: Tests for core navigation, links, and page accessibility
- `quoteForm.spec.js`: Tests for the "Get a Free Quote" form functionality
- `visualElements.spec.js`: Tests for visual elements like logo, images, etc.
- `responsiveness.spec.js`: Tests for responsive design behavior

## Test Reports

### Standard Installation

After running tests, HTML reports are generated in the `playwright-report` directory. You can view them by opening `playwright-report/index.html` in your browser.

To explicitly generate and open the report:

```bash
npx playwright show-report
```

### Docker Installation

When running tests in Docker, reports are generated inside the container. You have two options to access them:

#### Option 1: Using Docker Volumes to Map Reports

This method maps the report directory to your host machine:

```bash
docker run --rm -v $(pwd)/playwright-report:/usr/src/app/playwright-report mint-detailing-tests
```

After the tests complete, you can view the reports in the `playwright-report` directory on your host machine.

#### Option 2: Copying Reports from Container

After running tests, you can copy the reports from the container:

```bash
# First, run the tests and get the container ID
CONTAINER_ID=$(docker run -d mint-detailing-tests)

# Wait for tests to complete
docker wait $CONTAINER_ID

# Copy the reports from the container
docker cp $CONTAINER_ID:/usr/src/app/playwright-report ./playwright-report-from-docker

# Remove the container
docker rm $CONTAINER_ID
```

You can then view the reports in the `playwright-report-from-docker` directory.

## Debugging Failed Tests

### Standard Installation

When tests fail, screenshots and traces are captured automatically. You can view them in the HTML report or use Playwright's UI mode:

```bash
npx playwright test --ui
```

### Docker Installation

Debugging with Docker is slightly different since you're working in a containerized environment:

#### Viewing Logs in Real-Time

To see test output in real-time:

```bash
docker run --rm mint-detailing-tests
```

All console output from the tests will be displayed in your terminal.

#### Accessing Traces and Screenshots

Test artifacts like traces and screenshots are captured inside the container. Use the volume mapping or container copying approaches described in the "Test Reports" section to access them:

```bash
# Using volumes
docker run --rm -v $(pwd)/test-results:/usr/src/app/test-results mint-detailing-tests
```

#### Debugging with a Shell Inside the Container

For more advanced debugging, you can get a shell inside the Docker container:

```bash
# Start an interactive shell session in the container
docker run -it --rm mint-detailing-tests /bin/bash

# Inside the container, you can run tests manually
npm test
# or
npx playwright test --debug # This won't work well in Docker, but you can inspect state
```

## Notes on Test Data

- The form tests fill out the quote form with test data but don't actually submit it to the Netlify backend.
- Visual tests verify that placeholder images are not using random URLs.
- Responsive tests verify the mobile menu behavior and horizontal scroll issues.

## Added Data-testid Attributes

Several HTML elements have been enhanced with `data-testid` attributes to make test selectors more robust:

- `logo`: The Mint logo text in the header
- `nav-menu`: The main navigation menu
- `nav-home`, `nav-about`, etc.: Individual navigation links
- `mobile-menu-toggle`: The mobile menu toggle button
- `form-title`: The title of the quote form
- `quote-form`: The quote request form
- `input-name`, `input-email`, etc.: Form input fields
- `submit-button`: The form submit button
- `thank-you-heading`: The heading on the thank-you page
- ...and more

These attributes make the tests more reliable and resistant to CSS/layout changes.

## Docker Notes

### Benefits of Using Docker

- **Consistent Environment**: Docker ensures the same test environment across different machines and CI/CD systems.
- **No System Dependencies**: All browser binaries and system dependencies are pre-installed in the container.
- **Isolation**: Tests run in an isolated environment, preventing conflicts with other applications.
- **No Local Installation Required**: No need to install Node.js, npm, or Playwright dependencies on your host machine.

### Docker Image Details

The Docker image is based on the official Microsoft Playwright image (`mcr.microsoft.com/playwright:v1.40.0-focal`) which includes:

- Ubuntu 20.04 (Focal) as the base OS
- Node.js
- All necessary browser binaries (Chromium, Firefox, WebKit)
- Required system dependencies

### CI/CD Integration

This Docker setup is ideal for CI/CD pipelines. For example, in GitHub Actions:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and run tests in Docker
        run: |
          cd mint-detailing-website-tests
          docker build -t mint-detailing-tests .
          docker run --rm -v $(pwd)/playwright-report:/usr/src/app/playwright-report mint-detailing-tests
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```