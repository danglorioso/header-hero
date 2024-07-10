# header-hero README




## Features

The **header-hero** extension provides a number of different features to improve 
your code's readability and maintainability with just a click.

- Insert header into single file in active edtior or every file in open directory
- Auto-populated date and filename information in header blocks
- Select header template from a variety of predefined templates or define your own custom template (see Extension Settings).
- Automatically skips files that already have a header block at top
- Will not add header templates to system files (like .DS_Store or .gitattributes)

## Requirements

Requires VSCode version 1.73.0 or greater.

## Extension Settings

Header Hero provides the following settings to customize the header templates:

<ins>Header Hero: Header Template (headerHero.headerTemplate)</ins><br>
Select the header template to be added to for your files. You can choose from a
variety of predefined templates or define your own custom template.

~~~~
- Standard: Standard header template with basic details.
- Academic Project: Academic project header template with course and project details.
- Personal Project: Personal project header template with project information.
- Professional Code: Professional code header template with detailed project information.
- Open Source Contribution: Open source contribution header template with repository information.
- Minimal: Minimal header template with essential information only.
- Detailed Change Log: Detailed change log header template with version and change log.
- Machine Learning Project: Machine learning project header template with dataset and algorithm details.
- Script File: Script file header template with usage instructions.
- Test File: Test file header template with test cases.
- Web Development Project: Web development project header template with technologies used.
- Custom: Custom header template defined by the user.
~~~~

<ins>Header Hero: Custom Template (headerHero.customTemplate)</ins><br>
Define your custom header template. Use \${fileName} for the file name and \${date} for the current date.

With these settings, you can easily select or create the header template that best fits your needs.

## Known Issues

No known issues at this time.

## Release Notes

### 1.0.0

Initial release of header-hero VSCode Extension.

---

**Enjoy!**
