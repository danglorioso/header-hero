# header-hero README

**Header Hero** is a Microsoft Visual Studio Code extension designed to streamline and enhance your coding workflow by automatically inserting customizable header templates into your files. This extension helps improve the readability and maintainability of your code by adding consistent documentation headers with just a click. Whether you are working on academic projects, professional code, open source contributions, or personal projects, Header Hero ensures that your files are well-documented and easy to navigate.

This extension was developed to provide a simple yet powerful way to maintain consistent documentation across various types of projects and coding standards.

## Features

The **header-hero** extension provides a number of different features to improve 
your code's readability and maintainability with just a click.

- Insert Header: Add a header template to the current file in the active editor or to every file in an open directory.
- Auto-Populated Information: Automatically fills in date and filename information in header blocks.
- Template Selection: Choose from a variety of predefined header templates or define your own custom template (see Extension Settings).
- Header Detection: Automatically skips files that already have a header block at the top.
- File Exclusion: Will not add header templates to system files (e.g., .DS_Store, .gitattributes).

## Usage
Inserting Header into a Single File
- Use the command headerHero.insertHeader to insert a header template into a single file.


Inserting Header into a Directory
- Use the command headerHero.insertHeader to insert a header template into all files within a directory.


Editing the Template Selected in Settings
- Modify the selected header template in the settings to fit your specific needs.


## Header Templates
Here are examples of each header template available:

## Requirements

Requires VSCode version 1.73.0 or greater.

## Extension Settings

Header Hero provides the following settings to customize the header templates:

<ins>Header Hero: Header Template (headerHero.headerTemplate)</ins><br>
Select the header template to be added to for your files. You can choose from a
variety of predefined templates or define your own custom template.

~~~~
- Standard: Standard header template with basic details including file name, author, date, and summary.
- Assignment: Assignment header template with assignment-specific information, including assignment name, author, date, and summary.
- Academic Project: Academic project header template with course and project details including course name, instructor, project title, and description.
- Personal Project: Personal project header template with project information including project name, creation date, author, and description.
- Professional Code: Professional code header template with detailed project information including project name, module, author, date, last update, version, and summary.
- Open Source Contribution: Open source contribution header template with repository information including project name, repository URL, contributor, date, and description.
- Minimal: Minimal header template with essential information only, including file name, author, and date.
- Detailed Change Log: Detailed change log header template with version and change log information including project name, module, author, date, version, description, and change log entries.
- Machine Learning Project: Machine learning project header template with dataset and algorithm details including project name, author, date, dataset used, algorithm name, and description.
- Script File: Script file header template with usage instructions including script name, author, date, description, and usage instructions.
- Test File: Test file header template with test cases including test suite name, module, author, date, description, and test cases.
- Web Development Project: Web development project header template with technologies used including project name, module, author, date, last update, technologies used, and description.
- Custom: Custom header template defined by the user.
~~~~

<ins>Header Hero: Custom Template (headerHero.customTemplate)</ins><br>
Define your custom header template. Use \${fileName} for the file name and \${date} for the current date.

With these settings, you can easily select or create the header template that best fits your needs.

## Known Issues

No known issues at this time.

## Release Notes

### 1.0.0

Initial release of Header Hero VSCode Extension.

---

**Enjoy!**
