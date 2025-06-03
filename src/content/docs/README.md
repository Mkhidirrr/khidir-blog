---
title: "Content Structure Guidelines"
date: 2023-12-15
---

# Content Structure Guidelines

This document provides guidelines for organizing the content structure of the project. Proper organization ensures that the project is maintainable, and scalable, and that the content is easily accessible.

## 1. Directory Structure

The project follows a specific directory structure to organize content effectively. Here is the recommended structure:

```
/project-root
  /src
    /content
      /docs
        README.md
      /posts
      /images
  /public
  /styles
```

- **/src/content/docs**: This directory is for documentation files, including the README.md.
- **/src/content/posts**: This is where all the blog posts or articles will be stored.
- **/src/content/images**: This directory is for images used in the content.

## 2. Moving README.md

The README.md file should be moved to the `/src/content/docs` directory. This keeps all documentation files together and separates them from the content files like posts and images.

## 3. Updating Content Config

After moving the README.md file, update the content configuration to include the new docs collection. This ensures that the documentation is properly recognized and processed by the system.

## Conclusion

Following these guidelines will help maintain a clean and organized project structure. It is important to keep the content well-organized as the project grows to ensure easy maintenance and scalability.