let _topicCounter = 1;
let _quizCounter = 1;

function insertCourse(db, title, slug, description, icon, color, order_no, price, language) {
  return db.prepare(
    `INSERT INTO courses (title, slug, description, icon, color, order_no, price, language, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`
  ).run(title, slug, description, icon, color, order_no, price || 0, language || 'en');
}

function insertTopic(db, courseId, title, order_no) {
  const r = db.prepare(
    `INSERT INTO topics (course_id, title, order_no) VALUES (?, ?, ?)`
  ).run(courseId, title, order_no);
  return _topicCounter++;
}

function insertLesson(db, topicId, title, content, code, video_url, order_no, challenge) {
  return db.prepare(
    `INSERT INTO lessons (topic_id, title, content, code, video_url, order_no, challenge) VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(topicId, title, content, code || '', video_url || '', order_no, challenge || '');
}

function insertQuiz(db, topicId, title, order_no) {
  const r = db.prepare(
    `INSERT INTO quizzes (topic_id, title, order_no) VALUES (?, ?, ?)`
  ).run(topicId, title, order_no);
  return _quizCounter++;
}

function insertQuestion(db, quizId, question, options, correct_index, explanation) {
  return db.prepare(
    `INSERT INTO questions (quiz_id, question, options, correct_index, explanation) VALUES (?, ?, ?, ?, ?)`
  ).run(quizId, question, options, correct_index, explanation || '');
}

function seedAllCourses(db) {

  // ============================================================
  // 1. LEARN HTML
  // ============================================================
  insertCourse(db, 'Learn HTML', 'html', 'Master the building blocks of the web. Learn HTML from scratch with hands-on examples and real-world projects.', 'code', '#04aa6d', 1, 0, 'en');

  // --- Topic: HTML Basics ---
  insertTopic(db, 1, 'HTML Basics', 1);

  insertLesson(db, 1, 'HTML Introduction', `## What is HTML?

HTML stands for **HyperText Markup Language**. It is the standard language used to create and structure content on the web. Every web page you visit is built using HTML as its foundation. HTML uses a system of **tags** to define different elements on a page such as headings, paragraphs, images, links, and more.

## HTML Document Structure

Every HTML document follows a specific structure. At the top, you declare the document type with \`<!DOCTYPE html>\`, followed by the \`<html>\` root element. Inside the root, you have two main sections:

- **\`<head>\`** — Contains metadata, the page title, links to stylesheets, and other non-visible information.
- **\`<body>\`** — Contains all the visible content that users see and interact with.

Here is the basic skeleton of an HTML document:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my first HTML page.</p>
</body>
</html>
\`\`\`

## Your First HTML Page

When you open an HTML file in a browser, the browser reads the markup and renders the content visually. The \`<h1>\` tag creates a large heading, and the \`<p>\` tag creates a paragraph of text. These are two of the most fundamental HTML elements you will use on every page.

## Key Concepts

- HTML is a **markup language**, not a programming language — it structures content, it does not perform logic.
- Tags come in pairs: an **opening tag** (\`<p>\`) and a **closing tag** (\`</p>\`). Some tags are **self-closing** like \`<img>\` and \`<br>\`.
- HTML elements can be **nested** inside other elements to create a hierarchical document tree known as the **DOM (Document Object Model)**.

## Setting Up Your Environment

To start writing HTML, you only need a text editor (like VS Code) and a web browser. Save your file with a \`.html\` extension and double-click it to open it in your browser. That is literally all it takes to begin building for the web.`, `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Web Page</title>
</head>
<body>
    <h1>Welcome to LearnHub!</h1>
    <p>This is my very first HTML page.</p>
    <p>HTML is the foundation of every website.</p>
</body>
</html>`, 'https://www.youtube.com/embed/UB1O30fR-EE', 1, null);

  insertLesson(db, 1, 'HTML Elements', `## Headings in HTML

HTML provides six levels of headings, from \`<h1>\` (the most important) to \`<h6>\` (the least important). Search engines use headings to understand the structure and hierarchy of your content. You should always start with \`<h1>\` for the main title and use subsequent heading levels for sub-sections.

\`\`\`html
<h1>Main Heading</h1>
<h2>Sub Heading</h2>
<h3>Sub-sub Heading</h3>
<h4>Deeper Heading</h4>
<h5>Even Deeper</h5>
<h6>Deepest Heading</h6>
\`\`\`

## Paragraphs

The \`<p>\` tag defines a paragraph of text. Browsers automatically add spacing before and after each paragraph. You can write multiple sentences inside a single \`<p>\` element, and the browser will render them as a single block of text.

\`\`\`html
<p>This is the first paragraph. It contains several sentences that flow together as one unit of content.</p>
<p>This is a second paragraph. Notice the spacing between paragraphs.</p>
\`\`\`

## Line Breaks

The \`<br>\` tag inserts a single line break without starting a new paragraph. It is a **self-closing** tag, meaning it does not need a closing tag. This is useful for things like poems or addresses where you need a line break without extra paragraph spacing.

\`\`\`html
<p>
    123 Web Developer Lane<br>
    Code City, ST 12345<br>
    United States
</p>
\`\`\`

## Horizontal Rules

The \`<hr>\` tag creates a horizontal line that acts as a thematic break between content sections. It is commonly used to visually separate different sections of a page.

## Preformatted Text

The \`<pre>\` tag preserves both spaces and line breaks exactly as they appear in the HTML source. This is useful for displaying code snippets or ASCII art where formatting matters.

\`\`\`html
<pre>
function hello() {
    console.log("Hello!");
}
</pre>
\`\`\`

## Block vs Inline Elements

Understanding the difference between block and inline elements is crucial. **Block elements** like \`<h1>\`, \`<p>\`, and \`<div>\` start on a new line and take up the full width available. **Inline elements** like \`<span>\`, \`<a>\`, and \`<strong>\` flow within the text without breaking to a new line.`, `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>HTML Elements</title>
</head>
<body>
    <h1>Main Page Title (h1)</h1>
    <h2>Section Heading (h2)</h2>
    <h3>Sub-section (h3)</h3>

    <p>This is a paragraph of text. HTML elements are the building blocks of web pages.</p>
    <p>Each paragraph is separated by automatic spacing by the browser.</p>

    <p>
        Line one<br>
        Line two<br>
        Line three (uses br tag)
    </p>

    <hr>

    <pre>
        This text preserves
        spaces and
        line breaks.
    </pre>
</body>
</html>`, 'https://www.youtube.com/embed/UB1O30fR-EE', 2, null);

  insertLesson(db, 1, 'HTML Attributes', `## What Are Attributes?

HTML attributes provide **additional information** about elements. They are always placed inside the opening tag and usually come in name/value pairs. Attributes help define the behavior, appearance, or identification of an element.

## Common Attributes

### href Attribute

The \`href\` attribute is used with the \`<a>\` (anchor) tag to specify the destination URL of a link.

\`\`\`html
<a href="https://www.example.com">Visit Example</a>
\`\`\`

### src Attribute

The \`src\` attribute specifies the path to an image, video, audio file, or script. It is required for \`<img>\`, \`<video>\`, \`<audio>\`, and \`<script>\` elements.

\`\`\`html
<img src="photo.jpg" alt="A beautiful landscape">
\`\`\`

### alt Attribute

The \`alt\` attribute provides alternative text for images. It is displayed when the image cannot load and is essential for **accessibility** — screen readers read this text aloud to visually impaired users.

### class and id Attributes

The \`class\` attribute assigns one or more class names to an element, which can be targeted by CSS and JavaScript. The \`id\` attribute assigns a **unique** identifier to a single element on the page. An id must be unique — it cannot be reused.

\`\`\`html
<div class="card" id="main-card">
    <h2 class="card-title">My Card</h2>
    <p class="card-text">Card content goes here.</p>
</div>
\`\`\`

### style Attribute

The \`style\` attribute allows you to apply inline CSS directly to an element. While not recommended for large projects, it is useful for quick styling.

\`\`\`html
<p style="color: blue; font-size: 18px;">This text is blue and 18px.</p>
\`\`\`

## Attribute Best Practices

- Always use **double quotes** around attribute values.
- Always include the \`alt\` attribute on images for accessibility.
- Use **lowercase** attribute names as a convention.
- Prefer \`class\` over \`id\` for styling, as classes are reusable.
- Use \`id\` primarily for JavaScript targeting and anchor links.`, `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>HTML Attributes</title>
</head>
<body>
    <h1>HTML Attributes Demo</h1>

    <a href="https://www.example.com" target="_blank" title="Visit Example">
        Click here to visit Example.com
    </a>

    <br><br>

    <img src="https://via.placeholder.com/300x200"
         alt="A placeholder image demonstrating the alt attribute"
         width="300"
         height="200">

    <br><br>

    <div class="container" id="main-content">
        <p class="highlight" style="color: green; font-weight: bold;">
            This paragraph has class, id, and inline styles.
        </p>
    </div>

    <ul>
        <li><strong>href</strong> — sets the link URL</li>
        <li><strong>src</strong> — sets the media source</li>
        <li><strong>alt</strong> — provides alternative text</li>
        <li><strong>class</strong> — assigns CSS class names</li>
        <li><strong>id</strong> — unique element identifier</li>
    </ul>
</body>
</html>`, 'https://www.youtube.com/embed/UB1O30fR-EE', 3, null);

  insertQuiz(db, 1, 'HTML Basics Quiz', 1);

  insertQuestion(db, 1, 'What does HTML stand for?', JSON.stringify(['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language']), 0, 'HTML stands for HyperText Markup Language. It is the standard markup language for creating web pages.');
  insertQuestion(db, 1, 'Which tag is used to create the largest heading?', JSON.stringify(['<h6>', '<heading>', '<h1>', '<head>']), 2, '<h1> creates the largest heading. HTML provides six heading levels from h1 to h6.');
  insertQuestion(db, 1, 'Which attribute provides alternative text for images?', JSON.stringify(['title', 'src', 'alt', 'href']), 2, 'The alt attribute provides alternative text for images, which is essential for accessibility.');
  insertQuestion(db, 1, 'What is the correct HTML element for a paragraph?', JSON.stringify(['<paragraph>', '<p>', '<text>', '<para>']), 1, 'The <p> tag defines a paragraph. Browsers add automatic spacing before and after paragraphs.');

  // --- Topic: HTML Text ---
  insertTopic(db, 1, 'HTML Text', 2);

  insertLesson(db, 2, 'HTML Formatting', `## Text Formatting Tags

HTML provides several tags to format and emphasize text. These tags go beyond basic bold and italic — they carry **semantic meaning** that helps browsers and assistive technologies understand your content.

## Bold and Strong

The \`<b>\` tag makes text bold visually, while \`<strong>\` also bolds text but adds **strong importance** to it. Screen readers may emphasize strongly-tagged text differently. Always prefer \`<strong>\` for important content and \`<b>\` purely for visual styling.

\`\`\`html
<p>This is <b>bold text</b> using the b tag.</p>
<p>This is <strong>important text</strong> using the strong tag.</p>
\`\`\`

## Italic and Emphasis

The \`<i>\` tag italicizes text for stylistic purposes, while \`<em>\` adds **emphatic stress**. Use \`<em>\` when you want to convey emphasis in meaning (like stressing a word in a sentence), and \`<i>\` for things like foreign words or technical terms.

\`\`\`html
<p>This is <i>italic text</i> using the i tag.</p>
<p>This is <em>emphasized text</em> using the em tag.</p>
\`\`\`

## Other Formatting Tags

| Tag | Purpose | Example |
|-----|---------|---------|
| \`<mark>\` | Highlighted/marked text | \`<mark>highlighted</mark>\` |
| \`<small>\` | Smaller secondary text | \`<small>fine print</small>\` |
| \`<del>\` | Deleted/strikethrough text | \`<del>old price</del>\` |
| \`<ins>\` | Inserted/underlined text | \`<ins>new price</ins>\` |
| \`<sub>\` | Subscript | \`H<sub>2</sub>O\` |
| \`<sup>\` | Superscript | \`E=mc<sup>2</sup>\` |

## Putting It Together

These formatting tags are essential for creating well-structured, accessible content. By using semantic tags instead of relying solely on CSS, you make your content more meaningful to search engines and screen readers alike.`, `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>HTML Formatting</title>
</head>
<body>
    <h1>HTML Text Formatting</h1>

    <p><b>Bold text</b> using &lt;b&gt; tag</p>
    <p><strong>Strong/important text</strong> using &lt;strong&gt; tag</p>

    <p><i>Italic text</i> using &lt;i&gt; tag</p>
    <p><em>Emphasized text</em> using &lt;em&gt; tag</p>

    <p><mark>Highlighted text</mark> using &lt;mark&gt; tag</p>
    <p><small>Small text</small> using &lt;small&gt; tag</p>

    <p><del>$49.99</del> <ins>$29.99</ins> — Sale price</p>

    <p>Water is H<sub>2</sub>O and E=mc<sup>2</sup> is famous.</p>

    <blockquote>
        "The only way to do great work is to love what you do."
        <cite>— Steve Jobs</cite>
    </blockquote>
</body>
</html>`, 'https://www.youtube.com/embed/UB1O30fR-EE', 1, null);

  insertLesson(db, 2, 'HTML Links & Images', `## The Anchor Tag

The \`<a>\` tag creates hyperlinks that connect web pages together. The \`href\` attribute specifies the destination URL. Links are the backbone of the web — they connect documents and resources across the internet.

\`\`\`html
<a href="https://www.example.com">Visit Example</a>
\`\`\`

## Link Targets

The \`target\` attribute controls where the linked page opens:

- **\`_self\`** — Opens in the same tab (default behavior)
- **\`_blank\`** — Opens in a new tab or window
- **\`_parent\`** — Opens in the parent frame
- **\`_top\`** — Opens in the full body of the window

\`\`\`html
<a href="https://www.example.com" target="_blank" rel="noopener noreferrer">
    Open in new tab
</a>
\`\`\`

**Important:** When using \`target="_blank"\`, always add \`rel="noopener noreferrer"\` to prevent security vulnerabilities where the new page can access your \`window\` object.

## Link Types

Links can point to external websites, internal pages, email addresses, phone numbers, or specific sections within the same page:

\`\`\`html
<!-- External link -->
<a href="https://www.google.com">Google</a>

<!-- Internal link -->
<a href="about.html">About Us</a>

<!-- Email link -->
<a href="mailto:info@example.com">Email Us</a>

<!-- Phone link -->
<a href="tel:+1234567890">Call Us</a>

<!-- Section link -->
<a href="#section2">Jump to Section 2</a>

<!-- Download link -->
<a href="file.pdf" download>Download PDF</a>
\`\`\`

## The Image Tag

The \`<img>\` tag embeds images into your page. It is a **self-closing** tag that requires the \`src\` and \`alt\` attributes.

\`\`\`html
<img src="photo.jpg" alt="A descriptive caption" width="600" height="400">
\`\`\`

## Image Formats

| Format | Best For | Supports Transparency |
|--------|----------|----------------------|
| **JPEG** | Photographs | No |
| **PNG** | Graphics, screenshots | Yes |
| **SVG** | Icons, logos, illustrations | Yes |
| **WebP** | Modern web (smaller files) | Yes |
| **GIF** | Animations | Yes |

## Title Attribute

Both links and images support the \`title\` attribute, which displays a tooltip on hover:

\`\`\`html
<a href="https://example.com" title="Go to Example.com">Example</a>
<img src="photo.jpg" alt="Photo" title="Click to enlarge">
\`\`\`

The \`title\` attribute should supplement, not replace, the \`alt\` attribute for images.`, `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Links and Images</title>
</head>
<body>
    <h1>HTML Links & Images</h1>

    <h2>Types of Links</h2>
    <ul>
        <li><a href="https://www.example.com" target="_blank" rel="noopener noreferrer">External link (new tab)</a></li>
        <li><a href="mailto:hello@learnhub.com">Email link</a></li>
        <li><a href="tel:+1234567890">Phone link</a></li>
        <li><a href="#section-images" title="Jump to images section">Anchor link to section below</a></li>
    </ul>

    <h2>Images</h2>
    <img src="https://via.placeholder.com/400x250/04aa6d/ffffff?text=HTML+Course"
         alt="HTML Course banner image"
         width="400"
         height="250"
         title="HTML Course Banner">

    <h2 id="section-images">Image Formats</h2>
    <table border="1" cellpadding="8">
        <tr><th>Format</th><th>Best For</th><th>Transparency</th></tr>
        <tr><td>JPEG</td><td>Photographs</td><td>No</td></tr>
        <tr><td>PNG</td><td>Screenshots</td><td>Yes</td></tr>
        <tr><td>SVG</td><td>Logos & icons</td><td>Yes</td></tr>
        <tr><td>WebP</td><td>Modern web</td><td>Yes</td></tr>
    </table>
</body>
</html>`, 'https://www.youtube.com/embed/UB1O30fR-EE', 2, null);

  insertLesson(db, 2, 'HTML Lists', `## Unordered Lists

An unordered list uses the \`<ul>\` tag and displays items with bullet points by default. Each list item is wrapped in an \`<li>\` tag. Unordered lists are perfect for collections of items where the order does not matter, like features, requirements, or steps in a process.

\`\`\`html
<ul>
    <li>HTML — Structure</li>
    <li>CSS — Styling</li>
    <li>JavaScript — Behavior</li>
</ul>
\`\`\`

## Ordered Lists

An ordered list uses the \`<ol>\` tag and numbers items sequentially. You can customize the numbering with attributes:

- **\`type\`** — Sets the numbering style: \`1\` (numbers, default), \`A\` (uppercase), \`a\` (lowercase), \`I\` (uppercase Roman), \`i\` (lowercase Roman)
- **\`start\`** — Sets the starting number
- **\`reversed\`** — Reverses the numbering order

\`\`\`html
<ol type="A">
    <li>First item</li>
    <li>Second item</li>
    <li>Third item</li>
</ol>

<ol start="5">
    <li>Fifth item</li>
    <li>Sixth item</li>
</ol>
\`\`\`

## Description Lists

Description lists use \`<dl>\`, \`<dt>\` (term), and \`<dd>\` (description) tags. They are ideal for glossaries, metadata displays, and key-value pairs.

\`\`\`html
<dl>
    <dt>HTML</dt>
    <dd>HyperText Markup Language — the structure of web pages</dd>

    <dt>CSS</dt>
    <dd>Cascading Style Sheets — the presentation of web pages</dd>

    <dt>JavaScript</dt>
    <dd>A programming language for interactive web pages</dd>
</dl>
\`\`\`

## Nested Lists

Lists can be nested inside other lists to create hierarchical structures. Simply place a new \`<ul>\` or \`<ol>\` inside an \`<li>\` element. This is useful for creating menus, outlines, and categorized content.

\`\`\`html
<ul>
    <li>Frontend Development
        <ul>
            <li>HTML</li>
            <li>CSS</li>
            <li>JavaScript</li>
        </ul>
    </li>
    <li>Backend Development
        <ul>
            <li>Node.js</li>
            <li>Python</li>
        </ul>
    </li>
</ul>
\`\`\`

## Styling Lists

You can control list appearance with CSS properties like \`list-style-type\` (changes bullet style), \`list-style-position\` (inside/outside), and \`list-style-image\` (custom bullet images). Remove default styling with \`list-style: none\`.`, `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>HTML Lists</title>
</head>
<body>
    <h1>HTML Lists</h1>

    <h2>Unordered List</h2>
    <ul>
        <li>Learn HTML</li>
        <li>Learn CSS</li>
        <li>Learn JavaScript</li>
        <li>Learn a backend language</li>
    </ul>

    <h2>Ordered List</h2>
    <ol>
        <li>Plan your project</li>
        <li>Design the layout</li>
        <li>Write the HTML</li>
        <li>Style with CSS</li>
        <li>Add interactivity with JavaScript</li>
    </ol>

    <h2>Description List</h2>
    <dl>
        <dt><strong>API</strong></dt>
        <dd>Application Programming Interface — a way for software to communicate</dd>

        <dt><strong>DOM</strong></dt>
        <dd>Document Object Model — the tree structure of an HTML document</dd>

        <dt><strong>CRUD</strong></dt>
        <dd>Create, Read, Update, Delete — basic database operations</dd>
    </dl>

    <h2>Nested List</h2>
    <ul>
        <li>Frontend
            <ul>
                <li>HTML</li>
                <li>CSS</li>
                <li>JavaScript</li>
            </ul>
        </li>
        <li>Backend
            <ol>
                <li>Node.js</li>
                <li>Python</li>
                <li>Java</li>
            </ol>
        </li>
    </ul>
</body>
</html>`, 'https://www.youtube.com/embed/UB1O30fR-EE', 3, JSON.stringify({
    description: "Create a recipe page with a nested list showing ingredients organized by category (Produce, Dairy, Pantry) and a numbered step-by-step cooking instructions list.",
    hints: ["Use <ul> for categories and <ol> for numbered steps", "Nest lists inside <li> elements for hierarchy"],
    starterCode: "<!-- Create a recipe page -->\n<!-- Step 1: Add a recipe title -->\n<!-- Step 2: Add ingredient categories with nested lists -->\n<!-- Step 3: Add numbered cooking instructions -->"
  }));

  insertQuiz(db, 2, 'HTML Text Quiz', 2);

  insertQuestion(db, 2, 'Which tag adds strong importance to text (screen readers emphasize it)?', JSON.stringify(['<b>', '<strong>', '<i>', '<em>']), 1, '<strong> adds strong importance semantically. While <b> also bolds text, <strong> conveys meaning to assistive technologies.');
  insertQuestion(db, 2, 'Which tag creates a highlighted text effect?', JSON.stringify(['<highlight>', '<mark>', '<em>', '<ins>']), 1, 'The <mark> tag highlights text, typically displayed with a yellow background by default.');
  insertQuestion(db, 2, 'What does the download attribute do on an anchor tag?', JSON.stringify(['Opens the link in a new tab', 'Downloads the linked file instead of navigating', 'Compresses the file', 'Saves the page as PDF']), 1, 'The download attribute tells the browser to download the linked file rather than navigating to it.');
  insertQuestion(db, 2, 'What is the correct way to create a subscript?', JSON.stringify(['<sub>H2O</sub>', 'H<sub>2</sub>O', '<sup>H2O</sup>', 'H2O']), 1, 'The <sub> tag wraps only the text that should be subscript. So H<sub>2</sub>O renders the 2 as a subscript.');

  // --- Topic: HTML Tables ---
  insertTopic(db, 1, 'HTML Tables', 3);

  insertLesson(db, 3, 'HTML Tables', `## Table Structure

HTML tables organize data into rows and columns using a set of dedicated tags. A table consists of \`<table>\`, \`<tr>\` (table row), \`<th>\` (table header), and \`<td>\` (table data/cell).

\`\`\`html
<table>
    <tr>
        <th>Name</th>
        <th>Age</th>
        <th>City</th>
    </tr>
    <tr>
        <td>Alice</td>
        <td>28</td>
        <td>New York</td>
    </tr>
    <tr>
        <td>Bob</td>
        <td>35</td>
        <td>London</td>
    </tr>
</table>
\`\`\`

## Table Sections

Tables can be divided into three semantic sections: \`<thead>\` (header), \`<tbody>\` (body), and \`<tfoot>\` (footer). This improves accessibility and makes it easier to style different sections independently.

\`\`\`html
<table>
    <thead>
        <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Stock</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Laptop</td>
            <td>$999</td>
            <td>15</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td colspan="2">Total Products</td>
            <td>15</td>
        </tr>
    </tfoot>
</table>
\`\`\`

## colspan and rowspan

These attributes allow cells to span multiple columns or rows:

- **\`colspan\`** — Spans a cell across multiple columns
- **\`rowspan\`** — Spans a cell across multiple rows

\`\`\`html
<table border="1">
    <tr>
        <th colspan="2">Name</th>
        <th>Age</th>
    </tr>
    <tr>
        <td>First</td>
        <td>Last</td>
        <td rowspan="2">25</td>
    </tr>
    <tr>
        <td>John</td>
        <td>Doe</td>
    </tr>
</table>
\`\`\`

## Caption

The \`<caption>\` tag adds a title to your table that is read by screen readers and displayed visually above or below the table.

## Accessibility Tips

- Always use \`<th>\` for header cells and add the \`scope\` attribute (\`col\` or \`row\`) to help screen readers associate data cells with headers.
- Use \`<caption>\` to describe the table's purpose.
- Avoid using tables for layout — use CSS Grid or Flexbox instead.`, `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>HTML Tables</title>
    <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: #04aa6d; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>HTML Tables</h1>

    <table>
        <caption>Employee Directory</caption>
        <thead>
            <tr>
                <th scope="col">Name</th>
                <th scope="col">Department</th>
                <th scope="col">Salary</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Alice Johnson</td>
                <td>Engineering</td>
                <td>$95,000</td>
            </tr>
            <tr>
                <td>Bob Smith</td>
                <td>Marketing</td>
                <td>$72,000</td>
            </tr>
            <tr>
                <td>Carol White</td>
                <td>Engineering</td>
                <td>$98,000</td>
            </tr>
        </tbody>
    </table>

    <h2>Table with colspan</h2>
    <table border="1" cellpadding="8">
        <tr>
            <th colspan="2">Course</th>
            <th>Price</th>
        </tr>
        <tr>
            <td colspan="2">Learn HTML</td>
            <td>Free</td>
        </tr>
        <tr>
            <td colspan="2">Learn JavaScript</td>
            <td>$15</td>
        </tr>
    </table>
</body>
</html>`, 'https://www.youtube.com/embed/UB1O30fR-EE', 1, null);

  insertLesson(db, 3, 'HTML Table Styling', `## Table Styling with Attributes

HTML tables come with built-in attributes for quick styling, though modern CSS is the preferred approach for production websites.

## Border Attribute

The \`border\` attribute adds a border to the table and its cells. Setting it to \`0\` removes borders entirely.

\`\`\`html
<table border="1">
    <tr><th>Name</th><th>Score</th></tr>
    <tr><td>Alice</td><td>95</td></tr>
</table>
\`\`\`

## cellpadding and cellspacing

- **\`cellpadding\`** — Adds space between the cell content and cell border
- **\`cellspacing\`** — Adds space between individual cells

\`\`\`html
<table border="1" cellpadding="10" cellspacing="5">
    <tr><th>Item</th><th>Price</th></tr>
    <tr><td>Coffee</td><td>$3.50</td></tr>
</table>
\`\`\`

## CSS Table Styling

For production, CSS gives you complete control over table appearance:

\`\`\`css
table {
    border-collapse: collapse;
    width: 100%;
    font-family: Arial, sans-serif;
}

th, td {
    border: 1px solid #ddd;
    padding: 12px 15px;
    text-align: left;
}

th {
    background-color: #04aa6d;
    color: white;
}

tr:nth-child(even) {
    background-color: #f2f2f2;
}

tr:hover {
    background-color: #ddd;
}

caption {
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 10px;
}
\`\`\`

## Responsive Tables

On small screens, wide tables can break your layout. Common solutions include wrapping the table in a \`<div>\` with \`overflow-x: auto\` to enable horizontal scrolling, or using CSS to restructure the table as a card layout on mobile devices.

\`\`\`html
<div style="overflow-x: auto;">
    <table>...</table>
</div>
\`\`\`

## Display Properties

CSS can change how table elements render. Setting \`display: table\` on a non-table element makes it behave like a table, while \`display: none\` can hide rows or cells conditionally. The \`visibility: collapse\` property hides rows while preserving the table layout.`, `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Table Styling</title>
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
            font-family: 'Segoe UI', sans-serif;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px 15px;
            text-align: left;
        }
        th {
            background-color: #04aa6d;
            color: white;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        tr:hover {
            background-color: #e8f5e9;
        }
        .price-high { color: #e74c3c; font-weight: bold; }
        .price-low { color: #27ae60; }
    </style>
</head>
<body>
    <h1>Styled HTML Table</h1>

    <div style="overflow-x: auto;">
        <table>
            <caption>Course Catalog — Styled with CSS</caption>
            <thead>
                <tr>
                    <th>Course</th>
                    <th>Difficulty</th>
                    <th>Lessons</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>HTML</td>
                    <td>Beginner</td>
                    <td>12</td>
                    <td class="price-low">Free</td>
                </tr>
                <tr>
                    <td>CSS</td>
                    <td>Beginner</td>
                    <td>11</td>
                    <td>$9</td>
                </tr>
                <tr>
                    <td>JavaScript</td>
                    <td>Intermediate</td>
                    <td>13</td>
                    <td class="price-high">$15</td>
                </tr>
                <tr>
                    <td>React</td>
                    <td>Advanced</td>
                    <td>9</td>
                    <td class="price-high">$18</td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>`, 'https://www.youtube.com/embed/UB1O30fR-EE', 2, null);

  insertLesson(db, 3, 'HTML Forms Basics', `## The Form Element

Forms are one of the most important HTML elements — they allow users to input data and submit it to a server. The \`<form>\` element wraps all form controls and defines how and where the data is sent.

\`\`\`html
<form action="/submit" method="POST">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name">
    <button type="submit">Submit</button>
</form>
\`\`\`

## Form Attributes

- **\`action\`** — The URL where form data is sent
- **\`method\`** — The HTTP method: \`GET\` (data in URL) or \`POST\` (data in request body)
- **\`enctype\`** — Encoding type; use \`multipart/form-data\` for file uploads
- **\`novalidate\`** — Disables browser validation

## Input Types

The \`<input>\` element is incredibly versatile. Its \`type\` attribute changes its purpose and behavior:

| Type | Purpose | Example |
|------|---------|---------|
| \`text\` | Single-line text | Names, titles |
| \`password\` | Masked text | Passwords |
| \`email\` | Email with validation | user@email.com |
| \`number\` | Numeric input | Age, quantity |
| \`tel\` | Telephone number | Phone numbers |
| \`url\` | URL with validation | Website addresses |
| \`date\` | Date picker | Birthday |
| \`time\` | Time picker | Meeting time |
| \`checkbox\` | Multiple choice | Preferences |
| \`radio\` | Single choice | Gender, options |
| \`file\` | File upload | Documents, images |
| \`range\` | Slider | Volume, brightness |
| \`color\` | Color picker | Theme colors |

## The Label Element

Always pair labels with inputs using the \`for\` attribute matching the input's \`id\`. This improves accessibility by allowing users to click the label to focus the input, and screen readers will announce the label when the input is focused.

## Textarea and Button

The \`<textarea>\` element creates a multi-line text input for longer content. The \`<button>\` element creates clickable buttons that can submit or reset forms.

\`\`\`html
<textarea name="message" rows="5" cols="40" placeholder="Write your message..."></textarea>
<button type="submit">Send</button>
<button type="reset">Clear</button>
\`\`\`

## Input Attributes

- **\`placeholder\`** — Hint text shown when input is empty
- **\`required\`** — Makes the field mandatory
- **\`min\` / \`max\`** — Sets minimum and maximum values for numbers and dates
- **\`minlength\` / \`maxlength\`** — Sets text length constraints
- **\`pattern\`** — Regex pattern for validation
- **\`value\`** — Default value
- **\`disabled\`** — Prevents interaction
- **\`readonly\`** — Prevents editing but allows focus`, `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>HTML Forms</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 500px; margin: 40px auto; }
        label { display: block; margin-top: 15px; font-weight: bold; }
        input, textarea, select {
            width: 100%; padding: 10px; margin-top: 5px;
            border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;
        }
        button {
            margin-top: 20px; padding: 12px 24px;
            background: #04aa6d; color: white; border: none;
            border-radius: 4px; cursor: pointer; font-size: 16px;
        }
        button:hover { background: #059862; }
    </style>
</head>
<body>
    <h1>Contact Form</h1>
    <form action="/submit" method="POST">
        <label for="name">Full Name *</label>
        <input type="text" id="name" name="name" placeholder="John Doe" required>

        <label for="email">Email Address *</label>
        <input type="email" id="email" name="email" placeholder="john@example.com" required>

        <label for="phone">Phone Number</label>
        <input type="tel" id="phone" name="phone" placeholder="+1 (555) 123-4567">

        <label for="subject">Subject</label>
        <select id="subject" name="subject">
            <option value="general">General Inquiry</option>
            <option value="support">Technical Support</option>
            <option value="feedback">Feedback</option>
        </select>

        <label for="message">Message *</label>
        <textarea id="message" name="message" rows="5" placeholder="Write your message here..." required></textarea>

        <label>
            <input type="checkbox" name="newsletter" value="yes">
            Subscribe to our newsletter
        </label>

        <button type="submit">Send Message</button>
        <button type="reset">Clear Form</button>
    </form>
</body>
</html>`, 'https://www.youtube.com/embed/UB1O30fR-EE', 3, null);

  insertQuiz(db, 3, 'HTML Tables Quiz', 3);

  insertQuestion(db, 3, 'Which attribute makes a table cell span two columns?', JSON.stringify(['rowspan="2"', 'colspan="2"', 'span="2"', 'merge="col"']), 1, 'colspan="2" makes a cell span two columns. Use rowspan="2" to span two rows instead.');
  insertQuestion(db, 3, 'Which HTML tag defines a table header cell?', JSON.stringify(['<td>', '<th>', '<head>', '<caption>']), 1, '<th> defines a header cell, which is bold and centered by default and provides semantic meaning for accessibility.');
  insertQuestion(db, 3, 'What does the label for attribute do?', JSON.stringify(['Validates the input', 'Links the label to an input by its id', 'Sets a default value', 'Makes the input required']), 1, 'The for attribute links the label to the input with a matching id attribute, improving accessibility and allowing click-to-focus.');

  // --- Topic: HTML Advanced ---
  insertTopic(db, 1, 'HTML Advanced', 4);

  insertLesson(db, 4, 'HTML Div & Span', `## Block vs Inline Elements

Understanding the difference between block and inline elements is fundamental to HTML layout.

- **Block elements** start on a new line and take up the full width available. Examples: \`<div>\`, \`<p>\`, \`<h1>\`-\`<h6>\`, \`<ul>\`, \`<table>\`
- **Inline elements** do not start on a new line and only take up as much width as necessary. Examples: \`<span>\`, \`<a>\`, \`<strong>\`, \`<em>\`, \`<img>\`

## The div Element

The \`<div>\` is a **block-level** container with no visual effect on its own. It is the most commonly used HTML element for grouping and structuring content. You use \`<div>\` elements with CSS classes to create layouts, sections, and component structures.

\`\`\`html
<div class="card">
    <h2>Card Title</h2>
    <p>This is the card content inside a div.</p>
</div>

<div class="sidebar">
    <nav>
        <a href="#">Link 1</a>
        <a href="#">Link 2</a>
    </nav>
</div>
\`\`\`

## The span Element

The \`<span>\` is an **inline** container with no visual effect. It is used to wrap small pieces of content within a larger element for styling or JavaScript manipulation. Unlike \`<div>\`, it does not break to a new line.

\`\`\`html
<p>This is a paragraph with a <span class="highlight">highlighted word</span> in it.</p>
<p>The price is <span class="price">$29.99</span> per month.</p>
\`\`\`

## When to Use div vs span

| Use Case | Element | Reason |
|----------|---------|--------|
| Group a section of the page | \`<div>\` | Block element for layout |
| Wrap a card component | \`<div>\` | Block container |
| Style a single word | \`<span>\` | Inline, within text |
| Change color of text | \`<span>\` | Inline styling |
| Create a navigation bar | \`<div>\` | Block layout container |
| Mark a price in a sentence | \`<span>\` | Inline emphasis |

## Nesting and Structure

Proper nesting of elements creates a clear document hierarchy. Always close tags in the reverse order they were opened. Well-structured HTML makes your code easier to read, maintain, and debug. Use indentation to visually represent the nesting depth.`, `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Div and Span</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin: 15px 0;
            max-width: 400px;
        }
        .card h2 { margin-top: 0; color: #04aa6d; }
        .highlight { background-color: #fff3cd; padding: 2px 6px; border-radius: 3px; }
        .price { color: #e74c3c; font-weight: bold; font-size: 1.2em; }
        .sidebar {
            background: #f4f4f4;
            padding: 15px;
            border-left: 4px solid #04aa6d;
        }
    </style>
</head>
<body>
    <h1>HTML Div & Span Demo</h1>

    <div class="card">
        <h2>Course Card</h2>
        <p>Learn <span class="highlight">HTML</span> from scratch with hands-on projects and detailed lessons.</p>
        <p>Price: <span class="price">Free</span></p>
    </div>

    <div class="sidebar">
        <h3>Quick Links</h3>
        <p>Access your <span class="highlight">recently viewed</span> courses here.</p>
    </div>

    <p>
        The difference between div and span: a <strong>div</strong> is a block element
        that creates a new line, while a <strong>span</strong> is an inline element
        like <span class="highlight">this highlighted text</span> that flows within
        the surrounding content.
    </p>
</body>
</html>`, 'https://www.youtube.com/embed/UB1O30fR-EE', 1, null);

  insertLesson(db, 4, 'HTML Semantic Elements', `## Why Semantic HTML Matters

Before HTML5, developers used \`<div>\` elements for everything, with class names like \`<div class="header">\` and \`<div class="nav">\`. While this worked, it was terrible for accessibility and SEO. Semantic HTML elements describe their **meaning and purpose** to browsers, screen readers, and search engines.

## Key Semantic Elements

### \`<header>\`

Represents the introductory content or navigational aids of a page or section. Typically contains logos, navigation, and headings. You can have multiple \`<header>\` elements — one for the page and one for each section.

\`\`\`html
<header>
    <h1>LearnHub</h1>
    <nav>
        <a href="/courses">Courses</a>
        <a href="/pricing">Pricing</a>
    </nav>
</header>
\`\`\`

### \`<nav>\`

Represents a section containing navigation links. Not all links need to be in a \`<nav>\` — it is for major navigation blocks.

### \`<main>\`

Represents the dominant content of the \`<body>\`. There should only be **one** \`<main>\` element per page. It helps screen readers skip directly to the primary content.

### \`<section>\`

Represents a generic thematic grouping of content, typically with a heading. Use \`<section>\` when the content would logically appear in an outline or table of contents.

### \`<article>\`

Represents self-contained content that could be independently distributed or reused — like blog posts, news articles, forum posts, or user comments. The key test is: if you removed the article from the page, would it still make sense on its own?

### \`<aside>\`

Represents content tangentially related to the content around it. Commonly used for sidebars, pull quotes, and advertising.

### \`<footer>\`

Represents the footer of a page or section. Typically contains copyright information, related links, and author details.

## Semantic Document Structure

\`\`\`html
<body>
    <header>
        <nav>...</nav>
    </header>
    <main>
        <article>
            <section>
                <h2>Introduction</h2>
                <p>...</p>
            </section>
            <section>
                <h2>Main Content</h2>
                <p>...</p>
            </section>
        </article>
        <aside>
            <h3>Related Articles</h3>
        </aside>
    </main>
    <footer>...</footer>
</body>
\`\`\`

Using semantic elements improves **SEO** (search engines understand your content better), **accessibility** (screen readers navigate by landmark regions), and **code readability** (other developers understand the structure at a glance).`, `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Semantic HTML</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; color: #333; }
        header { background: #04aa6d; color: white; padding: 20px; text-align: center; }
        nav a { color: white; margin: 0 10px; text-decoration: none; }
        nav a:hover { text-decoration: underline; }
        main { max-width: 900px; margin: 20px auto; padding: 0 20px; }
        article { margin-bottom: 30px; }
        section { margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px; }
        aside { background: #e8f5e9; padding: 15px; border-left: 4px solid #04aa6d; margin: 20px 0; }
        footer { background: #333; color: white; text-align: center; padding: 15px; }
    </style>
</head>
<body>
    <header>
        <h1>LearnHub</h1>
        <nav>
            <a href="#courses">Courses</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
        </nav>
    </header>

    <main>
        <article>
            <section>
                <h2>Introduction to Web Development</h2>
                <p>Web development is the process of building and maintaining websites. It involves HTML, CSS, and JavaScript working together to create interactive and beautiful web experiences.</p>
            </section>
            <section>
                <h2>Why Learn Web Development?</h2>
                <p>Web development skills are in high demand. Whether you want to start a career, build a side project, or just understand how the web works, learning to code is a valuable investment.</p>
            </section>
        </article>

        <aside>
            <h3>Did you know?</h3>
            <p>The first website ever created is still online at info.cern.ch. It was made by Tim Berners-Lee in 1991.</p>
        </aside>
    </main>

    <footer>
        <p>&copy; 2026 LearnHub. All rights reserved.</p>
    </footer>
</body>
</html>`, 'https://www.youtube.com/embed/UB1O30fR-EE', 2, null);

  insertLesson(db, 4, 'HTML Media', `## Embedding Audio

The \`<audio>\` element embeds sound content. Use the \`src\` attribute or nested \`<source>\` elements for multiple formats (always provide multiple formats for browser compatibility).

\`\`\`html
<audio controls>
    <source src="audio.mp3" type="audio/mpeg">
    <source src="audio.ogg" type="audio/ogg">
    Your browser does not support the audio element.
</audio>
\`\`\`

**Key attributes:** \`controls\` (shows play/pause UI), \`autoplay\` (plays automatically — use cautiously), \`loop\` (replays), \`muted\` (starts muted), \`preload\` (metadata/auto/none).

## Embedding Video

The \`<video>\` element embeds video content with similar syntax to audio. It adds \`width\`, \`height\`, and \`poster\` attributes.

\`\`\`html
<video width="640" height="360" controls poster="thumbnail.jpg">
    <source src="video.mp4" type="video/mp4">
    <source src="video.webm" type="video/webm">
    Your browser does not support the video element.
</video>
\`\`\`

**Key attributes:** \`controls\`, \`autoplay\`, \`loop\`, \`muted\`, \`poster\` (thumbnail image shown before play), \`preload\`.

## The iframe Element

The \`<iframe>\` embeds external content like other web pages, maps, videos, or interactive widgets. It creates an **inline frame** that loads content from another URL.

\`\`\`html
<!-- YouTube Video Embed -->
<iframe width="560" height="315"
    src="https://www.youtube.com/embed/UB1O30fR-EE"
    title="Learn HTML"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media"
    allowfullscreen>
</iframe>
\`\`\`

**Security note:** Always consider adding the \`sandbox\` attribute to restrict iframe capabilities and prevent potential security issues.

## The embed and object Elements

These older elements embed external content like plugins. They are largely superseded by \`<iframe>\` but still supported:

\`\`\`html
<embed src="file.swf" type="application/x-shockwave-flash" width="300" height="200">

<object data="file.pdf" type="application/pdf" width="100%" height="500px">
    <p>Your browser cannot display PDFs. <a href="file.pdf">Download the PDF</a>.</p>
</object>
\`\`\`

## The picture Element

The \`<picture>\` element provides art direction by serving different images based on device characteristics like screen size:

\`\`\`html
<picture>
    <source media="(min-width: 800px)" srcset="large.jpg">
    <source media="(min-width: 400px)" srcset="medium.jpg">
    <img src="small.jpg" alt="Responsive image">
</picture>
\`\`\`

## Best Practices

- Always include fallback content inside media elements for browsers that do not support them.
- Use \`preload="metadata"\` instead of \`preload="auto"\` to save bandwidth.
- Never use \`autoplay\` with sound — it creates a terrible user experience.
- Use \`loading="lazy"\` on iframes to improve page load performance.`, `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>HTML Media</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .media-section { margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        video, audio { width: 100%; margin: 10px 0; }
        iframe { width: 100%; margin: 10px 0; border: 1px solid #ccc; }
    </style>
</head>
<body>
    <h1>HTML Media Elements</h1>

    <div class="media-section">
        <h2>Video Player</h2>
        <video width="100%" controls poster="https://via.placeholder.com/800x450?text=Video+Thumbnail">
            <source src="sample-video.mp4" type="video/mp4">
            Your browser does not support HTML5 video.
        </video>
    </div>

    <div class="media-section">
        <h2>Audio Player</h2>
        <audio controls>
            <source src="sample-audio.mp3" type="audio/mpeg">
            <source src="sample-audio.ogg" type="audio/ogg">
            Your browser does not support HTML5 audio.
        </audio>
    </div>

    <div class="media-section">
        <h2>Embedded Content (iframe)</h2>
        <iframe width="100%" height="315"
            src="https://www.youtube.com/embed/UB1O30fR-EE"
            title="Learn HTML Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media"
            allowfullscreen>
        </iframe>
    </div>
</body>
</html>`, 'https://www.youtube.com/embed/UB1O30fR-EE', 3, JSON.stringify({
    description: "Create a personal portfolio page using semantic HTML elements (header, nav, main, article, section, aside, footer). Include an embedded YouTube video and an image using the picture element for responsiveness.",
    hints: ["Use semantic elements for structure", "Use <iframe> for the YouTube embed", "Use <picture> with <source> elements for responsive images"],
    starterCode: "<!-- Create a semantic portfolio page -->\n<!-- 1. Add a header with nav -->\n<!-- 2. Add main with article sections -->\n<!-- 3. Embed a video with iframe -->\n<!-- 4. Add a responsive image with <picture> -->\n<!-- 5. Add a footer -->"
  }));

  insertQuiz(db, 4, 'HTML Advanced Quiz', 4);

  insertQuestion(db, 4, 'What is the difference between <div> and <span>?', JSON.stringify(['div is inline, span is block', 'div is block, span is inline', 'There is no difference', 'div is for text, span is for images']), 1, 'A <div> is a block-level element that starts on a new line, while <span> is an inline element that flows within text.');
  insertQuestion(db, 4, 'Which semantic element represents the main content area of a page?', JSON.stringify(['<section>', '<article>', '<main>', '<div>']), 2, 'The <main> element represents the dominant content of the page body. There should only be one <main> element per page.');
  insertQuestion(db, 4, 'What does the poster attribute do on a <video> element?', JSON.stringify(['Plays the video automatically', 'Shows an image before the video plays', 'Sets the video quality', 'Adds a watermark']), 1, 'The poster attribute specifies an image to display before the video starts playing, acting as a thumbnail.');

  // ============================================================
  // 2. LEARN CSS
  // ============================================================
  insertCourse(db, 'Learn CSS', 'css', 'Style beautiful, responsive websites with CSS. Master selectors, layouts, Flexbox, Grid, and modern design techniques.', 'palette', '#ff9800', 2, 9, 'en');

  // --- Topic: CSS Basics ---
  insertTopic(db, 2, 'CSS Basics', 1);

  insertLesson(db, 5, 'CSS Introduction', `## What is CSS?

CSS stands for **Cascading Style Sheets**. While HTML provides the structure and content of a web page, CSS controls the **visual presentation** — colors, fonts, spacing, layout, and responsive design. CSS separates content from presentation, making it easy to maintain consistent styles across an entire website.

## Three Ways to Add CSS

### Inline CSS

Applied directly to an element using the \`style\` attribute. Best for quick, one-off styles.

\`\`\`html
<p style="color: blue; font-size: 18px;">This is blue text.</p>
\`\`\`

### Internal CSS

Defined inside a \`<style>\` tag in the \`<head>\` section. Good for single-page styling.

\`\`\`html
<head>
    <style>
        p { color: blue; font-size: 18px; }
    </style>
</head>
\`\`\`

### External CSS

Linked from a separate \`.css\` file using the \`<link>\` tag. **This is the recommended approach** for any real project because it separates concerns and allows caching.

\`\`\`html
<link rel="stylesheet" href="styles.css">
\`\`\`

## CSS Syntax

Every CSS rule consists of a **selector** and a **declaration block**. The selector targets the HTML element(s) to style, and the declarations inside curly braces define the styles.

\`\`\`css
selector {
    property: value;
    property: value;
}
\`\`\`

## The Cascade

The "C" in CSS stands for "Cascading." When multiple rules target the same element, styles are applied in this order of specificity:

1. **Inline styles** (highest priority)
2. **ID selectors** (\`#id\`)
3. **Class selectors** and attribute selectors
4. **Element selectors** (\`p\`, \`div\`, etc.)
5. **Inherited styles** (from parent elements)

## CSS Comments

Use \`/* comment */\` syntax for CSS comments. Comments are essential for documenting complex style rules.

\`\`\`css
/* Main heading styles */
h1 {
    color: #333;
    font-size: 2rem;
}
\`\`\`

CSS is the key to making your HTML pages look professional and responsive. Throughout this course, you will master everything from basic selectors to advanced layout techniques like Flexbox and Grid.`, `/* styles.css - External CSS File */

/* Reset default browser styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Body and typography */
body {
    font-family: 'Segoe UI', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
}

/* Heading styles */
h1 {
    color: #ff9800;
    font-size: 2.5rem;
    text-align: center;
    margin: 20px 0;
}

/* Paragraph styles */
p {
    font-size: 16px;
    max-width: 800px;
    margin: 10px auto;
    padding: 0 20px;
}

/* Class-based styling */
.highlight {
    background-color: #fff3cd;
    padding: 2px 8px;
    border-radius: 4px;
}

/* ID-based styling */
#main-content {
    max-width: 960px;
    margin: 0 auto;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}`, 'https://www.youtube.com/embed/yfoY53QXEnI', 1, null);

  insertLesson(db, 5, 'CSS Selectors', `## Element Selectors

The most basic selectors target HTML elements directly by their tag name.

\`\`\`css
p {
    color: #333;
    line-height: 1.6;
}

h1 {
    color: #ff9800;
}
\`\`\`

## Class Selectors

Class selectors target elements with a specific \`class\` attribute. They start with a **dot** (\`.\`). Classes are **reusable** — the same class can be applied to multiple elements.

\`\`\`css
.card {
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 8px;
}

.btn-primary {
    background-color: #ff9800;
    color: white;
}
\`\`\`

\`\`\`html
<div class="card">Card 1</div>
<div class="card">Card 2</div>
<button class="btn-primary">Click Me</button>
\`\`\`

## ID Selectors

ID selectors target a **single, unique** element. They start with a **hash** (\`#\`). An ID can only be used once per page.

\`\`\`css
#main-header {
    background-color: #333;
    color: white;
    padding: 15px;
}
\`\`\`

## Combinators

| Combinator | Name | Example | Description |
|-----------|------|---------|-------------|
| (space) | Descendant | \`div p\` | All \`<p>\` inside \`<div>\` |
| \`>\` | Child | \`div > p\` | Direct child \`<p>\` of \`<div>\` |
| \`+\` | Adjacent sibling | \`h1 + p\` | First \`<p>\` after \`<h1>\` |
| \`~\` | General sibling | \`h1 ~ p\` | All \`<p>\` after \`<h1>\` |

## Pseudo-Classes

Pseudo-classes select elements based on their state or position. They start with a **colon** (\`:\`).

\`\`\`css
/* State pseudo-classes */
a:hover {
    color: #ff9800;
    text-decoration: underline;
}

input:focus {
    border-color: #ff9800;
    outline: none;
}

/* Position pseudo-classes */
li:first-child {
    font-weight: bold;
}

tr:nth-child(even) {
    background-color: #f9f9f9;
}
\`\`\`

## Attribute Selectors

\`\`\`css
a[target="_blank"] {
    color: red;
}

input[type="email"] {
    border-color: #ff9800;
}

[class^="btn-"] {
    padding: 10px 20px;
}
\`\`\`

## Pseudo-Elements

Pseudo-elements style specific parts of an element. They use double colons (\`::\`).

\`\`\`css
p::first-line {
    font-weight: bold;
}

p::before {
    content: ">> ";
    color: #ff9800;
}
\`\`\`

Understanding selectors is fundamental to CSS. The more precise your selectors, the more maintainable your stylesheets will be.`, `/* Selectors Demo */

/* Element selector */
p {
    color: #555;
    line-height: 1.8;
}

/* Class selector */
.card {
    border: 1px solid #ddd;
    padding: 20px;
    margin: 10px 0;
    border-radius: 8px;
}

.card.featured {
    border-color: #ff9800;
    box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
}

/* ID selector */
#main-title {
    color: #ff9800;
    font-size: 2.5rem;
    text-align: center;
}

/* Pseudo-class selectors */
.nav-link:hover {
    color: #ff9800;
    text-decoration: underline;
}

input:focus {
    border: 2px solid #ff9800;
    outline: none;
}

li:first-child {
    font-weight: bold;
    color: #ff9800;
}

/* Attribute selectors */
a[target="_blank"]::after {
    content: " \\2197";
    font-size: 0.8em;
}

input[type="email"] {
    border: 2px solid #ff9800;
}`, 'https://www.youtube.com/embed/yfoY53QXEnI', 2, null);

  insertLesson(db, 5, 'CSS Colors & Units', `## Color Formats

CSS provides multiple ways to specify colors:

### Named Colors

Over 140 predefined color names: \`red\`, \`blue\`, \`coral\`, \`tomato\`, etc.

### Hexadecimal Colors

Six-digit hex codes (plus optional two-digit alpha) prefixed with \`#\`. Each pair of digits represents red, green, and blue (00-FF).

\`\`\`css
h1 { color: #ff9800; }    /* Orange */
p { color: #333; }         /* Short form: #333333 */
a { color: #ff980080; }    /* With 50% transparency */
\`\`\`

### RGB and RGBA

Specify colors using \`rgb(red, green, blue)\` values (0-255). Add an alpha channel for transparency with \`rgba()\`.

\`\`\`css
h1 { color: rgb(255, 152, 0); }
.overlay {
    background-color: rgba(0, 0, 0, 0.7);  /* 70% opaque black */
}
\`\`\`

### HSL and HSLA

Hue, Saturation, Lightness — a more intuitive color model. Hue is 0-360 degrees on the color wheel, saturation is 0-100%, lightness is 0-100%.

\`\`\`css
h1 { color: hsl(36, 100%, 50%); }
button {
    background: hsl(36, 100%, 50%);
    color: hsl(0, 0%, 100%);
}
\`\`\`

## CSS Units

### Absolute Units

| Unit | Description |
|------|-------------|
| \`px\` | Pixels — most common, fixed size |
| \`pt\` | Points — print media |
| \`cm\` | Centimeters |
| \`in\` | Inches |

### Relative Units

| Unit | Description |
|------|-------------|
| \`em\` | Relative to parent element's font size |
| \`rem\` | Relative to root (\`<html>\`) font size |
| \`%\` | Relative to parent element |
| \`vw\` | 1% of viewport width |
| \`vh\` | 1% of viewport height |
| \`vmin\` | 1% of smaller viewport dimension |
| \`vmax\` | 1% of larger viewport dimension |

## Best Practices

- Use **\`rem\`** for font sizes — it creates a predictable scaling system.
- Use **\`em\`** for padding and margins inside components.
- Use **\`%\`** and **\`vw/vh\`** for responsive layouts.
- Set \`font-size: 62.5%\` on \`<html>\` so that \`1rem = 10px\` for easy calculations.
- Prefer **HSL** for colors when you need programmatic adjustments.`, `/* Colors & Units Demo */

:root {
    --primary: #ff9800;
    --primary-light: hsl(36, 100%, 60%);
    --primary-dark: hsl(36, 100%, 40%);
    --text: #333;
    --bg: #f5f5f5;
    --white: #fff;
}

body {
    font-family: Arial, sans-serif;
    color: var(--text);
    background-color: var(--bg);
    line-height: 1.6;
}

/* rem-based font sizes */
h1 { font-size: 2.5rem; color: var(--primary); }
h2 { font-size: 2rem; color: var(--primary-dark); }
p  { font-size: 1rem; }

/* em-based spacing */
.card {
    padding: 1.5em;
    margin-bottom: 1em;
    border: 1px solid #ddd;
    border-radius: 0.5em;
}

/* Percentage-based widths */
.container {
    width: 80%;
    max-width: 1200px;
    margin: 0 auto;
}

/* Viewport units */
.hero {
    height: 60vh;
    background-color: var(--primary);
    color: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3vw;
}

/* RGBA transparency */
.overlay {
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 2rem;
}`, 'https://www.youtube.com/embed/yfoY53QXEnI', 3, null);

  insertQuiz(db, 5, 'CSS Basics Quiz', 1);

  insertQuestion(db, 5, 'Which symbol is used to select an element by its ID?', JSON.stringify(['.', '#', '@', '&']), 1, 'The hash symbol (#) is used to select elements by their ID in CSS.');
  insertQuestion(db, 5, 'What is the recommended way to include CSS in a project?', JSON.stringify(['Inline styles', 'Internal style tag', 'External CSS file with link', 'JavaScript']), 2, 'External CSS files are recommended because they separate concerns, enable caching, and keep HTML clean.');
  insertQuestion(db, 5, 'Which pseudo-class selects an element when a user hovers over it?', JSON.stringify([':focus', ':active', ':hover', ':visited']), 2, 'The :hover pseudo-class applies styles when the user positions their cursor over an element.');
  insertQuestion(db, 5, 'What does the rem unit stand for?', JSON.stringify(['Relative em (parent)', 'Root em (root element)', 'Relative margin', 'Root margin']), 1, 'rem stands for "root em" and is relative to the font size of the root (<html>) element, not the parent.');

  // --- Topic: CSS Layout ---
  insertTopic(db, 2, 'CSS Layout', 2);

  insertLesson(db, 6, 'CSS Box Model', `## The Box Model

Every HTML element is a rectangular box. The CSS box model describes how these boxes are sized and spaced. It consists of four layers, from inside out:

1. **Content** — The actual content area (text, images, etc.)
2. **Padding** — Space between the content and the border
3. **Border** — A line surrounding the padding
4. **Margin** — Space outside the border, separating elements from each other

## Content Box vs Border Box

By default, CSS uses \`content-box\` sizing, where \`width\` and \`height\` only apply to the content area. Padding and border are **added on top**, making the actual rendered size larger.

The \`box-sizing: border-box\` property changes this behavior so that \`width\` and \`height\` **include** padding and border. This makes layout calculations much more predictable.

\`\`\`css
/* Recommended: Apply border-box globally */
*, *::before, *::after {
    box-sizing: border-box;
}
\`\`\`

## Padding

Padding creates space inside an element's border.

\`\`\`css
.card {
    padding: 20px;                    /* All sides */
    padding: 10px 20px;              /* top/bottom left/right */
    padding: 10px 20px 30px;        /* top left/right bottom */
    padding: 10px 20px 30px 40px;   /* top right bottom left */
    padding-left: 15px;             /* Individual side */
}
\`\`\`

## Margin

Margin creates space outside an element's border.

\`\`\`css
.element {
    margin: 20px;
    margin: 0 auto;     /* Center horizontally */
    margin-top: -10px;  /* Negative margins are valid! */
}
\`\`\`

## Margin Collapse

A unique behavior: when two vertical margins meet, they **collapse** (merge) into the larger value instead of adding together. This only happens with vertical margins, never horizontal.

\`\`\`css
.box1 { margin-bottom: 30px; }
.box2 { margin-top: 20px; }
/* Result: 30px gap (not 50px) */
\`\`\`

## Border

\`\`\`css
.card {
    border: 1px solid #ddd;           /* Shorthand */
    border-width: 1px;
    border-style: solid;
    border-color: #ddd;
    border-radius: 8px;              /* Rounded corners */
    border-top: 2px solid #ff9800;   /* Individual side */
}
\`\`\`

## Display

The \`display\` property controls how an element generates boxes:

- **\`block\`** — Takes full width, starts on new line
- **\`inline\`** — Only takes necessary width, flows with text
- **\`inline-block\`** — Flows inline but accepts width/height
- **\`none\`** — Removes element from layout entirely

Understanding the box model is essential for every CSS task — spacing, centering, responsive design, and debugging layout issues all depend on it.`, `/* Box Model Demo */

*, *::before, *::after {
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    padding: 20px;
    background: #f5f5f5;
}

/* Content box (default) */
.content-box {
    width: 300px;
    padding: 20px;
    border: 3px solid #e74c3c;
    margin-bottom: 20px;
    background: #ffeaea;
}

/* Border box (recommended) */
.border-box {
    width: 300px;
    padding: 20px;
    border: 3px solid #27ae60;
    margin-bottom: 20px;
    background: #eafff0;
    box-sizing: border-box;
}

.card {
    background: white;
    padding: 2rem;
    margin: 1rem auto;
    border: 1px solid #ddd;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 500px;
}

.centered {
    margin: 20px auto;
    width: 200px;
    text-align: center;
    padding: 15px;
    border: 2px dashed #ff9800;
}`, 'https://www.youtube.com/embed/yfoY53QXEnI', 1, null);

  insertLesson(db, 6, 'CSS Display & Position', `## Display Property

The \`display\` property is the most important CSS property for controlling layout:

### display: block

Elements stack vertically, taking full available width. Examples: \`<div>\`, \`<p>\`, \`<h1>\`, \`<section>\`

### display: inline

Elements flow horizontally within text. They don't accept \`width\`, \`height\`, or vertical margin/padding. Examples: \`<span>\`, \`<a>\`, \`<strong>\`

### display: inline-block

Combines inline flow with block-level sizing. Accepts \`width\`, \`height\`, and all margin/padding values while flowing inline.

## Position Property

### position: static (default)

Elements follow the normal document flow. \`top\`, \`right\`, \`bottom\`, \`left\` have no effect.

### position: relative

Elements are positioned relative to their **normal position**. The element stays in the flow but can be visually offset.

### position: absolute

Elements are removed from normal flow and positioned relative to the **nearest positioned ancestor** (any ancestor with position other than static). If no positioned ancestor exists, it positions relative to the \`<html>\` element.

\`\`\`css
.parent { position: relative; }
.child {
    position: absolute;
    top: 0;
    right: 0;
}
\`\`\`

### position: fixed

Removed from flow, positioned relative to the **viewport**. Stays in place even when scrolling. Perfect for sticky headers and back-to-top buttons.

### position: sticky

Hybrid between relative and fixed. The element is relative until it reaches a specified scroll position, then becomes fixed.

\`\`\`css
.sticky-header {
    position: sticky;
    top: 0;
    background: white;
    z-index: 100;
}
\`\`\`

## z-index

Controls stacking order of positioned elements. Higher \`z-index\` values appear in front of lower values. Only works on positioned elements (not static).

## Overflow

Controls what happens when content exceeds an element's bounds:

- **\`visible\`** — Content overflows (default)
- **\`hidden\`** — Content is clipped
- **\`scroll\`** — Always shows scrollbars
- **\`auto\`** — Shows scrollbars only when needed`, `/* Display & Position Demo */

body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
}

.display-demo {
    padding: 20px;
    background: #f5f5f5;
    margin: 10px;
}

.demo-block {
    display: block;
    background: #3498db;
    color: white;
    padding: 10px;
    margin: 5px 0;
}

.demo-inline {
    display: inline;
    background: #e74c3c;
    color: white;
    padding: 10px;
}

.demo-inline-block {
    display: inline-block;
    background: #27ae60;
    color: white;
    padding: 10px 20px;
    margin: 5px;
    width: 150px;
    text-align: center;
}

/* Position demo */
.position-container {
    position: relative;
    height: 300px;
    border: 2px solid #333;
    margin: 20px;
    padding: 10px;
}

.position-absolute {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #e74c3c;
    color: white;
    padding: 10px 20px;
}

.position-relative {
    position: relative;
    top: 20px;
    left: 30px;
    background: #3498db;
    color: white;
    padding: 10px 20px;
    display: inline-block;
}

/* Sticky header */
.section-header {
    position: sticky;
    top: 0;
    background: #ff9800;
    color: white;
    padding: 10px 20px;
    z-index: 100;
}

/* Fixed element */
.back-to-top {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #ff9800;
    color: white;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 24px;
}`, 'https://www.youtube.com/embed/yfoY53QXEnI', 2, null);

  insertLesson(db, 6, 'CSS Flexbox', `## Introduction to Flexbox

Flexbox is a one-dimensional layout system that arranges items in a row or column. It provides powerful alignment, distribution, and ordering capabilities. Flexbox is perfect for navigation bars, card rows, centering content, and responsive layouts.

## Setting Up Flexbox

\`\`\`css
.container {
    display: flex;
}
\`\`\`

This makes the container a **flex container** and its direct children become **flex items**.

## Flex Direction

The \`flex-direction\` property sets the main axis direction:

- **\`row\`** (default) — Items arranged horizontally left-to-right
- **\`row-reverse\`** — Items arranged horizontally right-to-left
- **\`column\`** — Items arranged vertically top-to-bottom
- **\`column-reverse\`** — Items arranged vertically bottom-to-top

## Main Axis Alignment

\`justify-content\` aligns items along the main axis:

| Value | Description |
|-------|-------------|
| \`flex-start\` | Items pack toward the start |
| \`flex-end\` | Items pack toward the end |
| \`center\` | Items are centered |
| \`space-between\` | Equal space between items |
| \`space-around\` | Equal space around items |
| \`space-evenly\` | Equal space everywhere |

## Cross Axis Alignment

\`align-items\` aligns items along the cross axis:

| Value | Description |
|-------|-------------|
| \`stretch\` | Items stretch to fill container height |
| \`flex-start\` | Items align to top |
| \`flex-end\` | Items align to bottom |
| \`center\` | Items are vertically centered |
| \`baseline\` | Items align to text baseline |

## Centering with Flexbox

The most common use — perfectly centering an element:

\`\`\`css
.center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
\`\`\`

## Flex Wrapping

By default, flex items try to fit on one line. Use \`flex-wrap: wrap\` to allow items to wrap to the next line.

## Flex Item Properties

- **\`flex-grow\`** — How much an item should grow relative to siblings
- **\`flex-shrink\`** — How much an item should shrink
- **\`flex-basis\`** — The initial size of an item
- **\`flex\`** — Shorthand: \`flex: grow shrink basis\`
- **\`order\`** — Changes the visual order
- **\`align-self\`** — Overrides \`align-items\` for a single item
- **\`flex: 1\`** — Equal distribution among flex items

## Gap

The \`gap\` property adds space between flex items without affecting margins. It is the modern, clean way to space flex items.`, `/* Flexbox Demo */

body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
}

/* Centering demo */
.center-demo {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    background: #f0f0f0;
    margin: 20px;
    border-radius: 8px;
}

.center-box {
    background: #ff9800;
    color: white;
    padding: 20px 40px;
    border-radius: 8px;
    font-size: 1.2rem;
}

/* Navbar with flexbox */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #333;
    color: white;
    padding: 15px 30px;
}

.nav-links {
    display: flex;
    gap: 20px;
    list-style: none;
}

.nav-links a {
    color: white;
    text-decoration: none;
}

/* Card grid with flexbox */
.card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
}

.card {
    flex: 1 1 300px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
}

/* Equal width columns */
.columns {
    display: flex;
    gap: 20px;
    padding: 20px;
}

.column {
    flex: 1;
    padding: 20px;
    background: #f5f5f5;
    border-radius: 8px;
}

/* Sidebar layout */
.layout {
    display: flex;
    min-height: 400px;
}

.sidebar {
    flex: 1;
    background: #333;
    color: white;
    padding: 20px;
}

.main {
    flex: 3;
    padding: 20px;
}

/* Order demo */
.order-demo {
    display: flex;
    gap: 10px;
    padding: 20px;
}

.order-item {
    padding: 15px 25px;
    background: #ff9800;
    color: white;
    border-radius: 4px;
}

.order-1 { order: 3; }
.order-2 { order: 1; }
.order-3 { order: 2; }`, 'https://www.youtube.com/embed/yfoY53QXEnI', 3, JSON.stringify({
    description: "Build a responsive navigation bar using Flexbox with a logo on the left, nav links in the center, and a CTA button on the right. On mobile, the nav should stack vertically.",
    hints: ["Use display: flex on the navbar container", "Use justify-content: space-between for spacing", "Use align-items: center for vertical centering"],
    starterCode: "/* Navbar Layout */\n.navbar {\n    /* Add flexbox properties */\n}\n\n.nav-links {\n    /* Add flex properties */\n}\n\n@media (max-width: 768px) {\n    /* Stack vertically on mobile */\n}"
  }));

  insertQuiz(db, 6, 'CSS Layout Quiz', 2);

  insertQuestion(db, 6, 'What does box-sizing: border-box do?', JSON.stringify(['Adds border to the box', 'Includes padding and border in the total width/height', 'Removes margin from calculation', 'Creates a border around content']), 1, 'With border-box, the width and height properties include padding and border, making layout calculations more predictable.');
  insertQuestion(db, 6, 'Which Flexbox property centers items along the main axis?', JSON.stringify(['align-items', 'justify-content', 'flex-direction', 'align-self']), 1, 'justify-content aligns items along the main axis (horizontal by default). Use align-items for the cross axis.');
  insertQuestion(db, 6, 'What is the difference between display: none and visibility: hidden?', JSON.stringify(['They are the same', 'none removes from layout, hidden preserves space', 'hidden removes from layout, none preserves space', 'none is for images, hidden is for text']), 1, 'display: none removes the element entirely (no space reserved), while visibility: hidden hides the element but keeps its space in the layout.');

  // --- Topic: CSS Styling ---
  insertTopic(db, 2, 'CSS Styling', 3);

  insertLesson(db, 7, 'CSS Typography', `## Font Family

The \`font-family\` property sets the typeface for text. Always provide a **font stack** — a comma-separated list of fallback fonts.

\`\`\`css
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

code, pre {
    font-family: 'Fira Code', 'Courier New', monospace;
}
\`\`\`

**Font categories:** serif, sans-serif, monospace, cursive, fantasy.

## Font Size

\`\`\`css
h1 { font-size: 2.5rem; }     /* Relative to root font size */
p  { font-size: 1rem; }       /* Base size */
small { font-size: 0.875rem; }
\`\`\`

## Font Weight

\`\`\`css
.light    { font-weight: 300; }
.normal   { font-weight: 400; }
.bold     { font-weight: 700; }
.heavy    { font-weight: 900; }
\`\`\`

## Line Height

\`line-height\` controls the vertical spacing between lines of text. A value of \`1.5\` or \`1.6\` is recommended for body text readability.

\`\`\`css
p {
    line-height: 1.6;
}
\`\`\`

## Text Alignment

\`\`\`css
h1 { text-align: center; }
p  { text-align: left; }
.mono { text-align: right; }
.justified { text-align: justify; }
\`\`\`

## Text Decoration and Transform

\`\`\`css
a { text-decoration: none; }
a:hover { text-decoration: underline; }
.uppercase { text-transform: uppercase; }
.capitalize { text-transform: capitalize; }
\`\`\`

## Letter Spacing and Word Spacing

\`\`\`css
h1 {
    letter-spacing: 2px;
}
\`\`\`

## Font Shorthand

\`\`\`css
body {
    font: 400 16px/1.6 'Segoe UI', sans-serif;
}
\`\`\`

## Google Fonts

Use Google Fonts to load custom fonts:

\`\`\`html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap" rel="stylesheet">
\`\`\`

Good typography is one of the most impactful elements of web design. Consistent font choices, proper sizing, and adequate line spacing dramatically improve readability.`, `/* Typography Demo */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap');

:root {
    --font-primary: 'Inter', 'Segoe UI', sans-serif;
    --font-mono: 'Fira Code', 'Courier New', monospace;
}

body {
    font-family: var(--font-primary);
    font-size: 16px;
    line-height: 1.6;
    color: #333;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    font-size: 2.5rem;
    font-weight: 900;
    letter-spacing: -1px;
    text-align: center;
    margin-bottom: 1rem;
}

h2 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #ff9800;
    margin-top: 2rem;
    border-bottom: 2px solid #ff9800;
    padding-bottom: 0.5rem;
}

p {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.8;
    margin-bottom: 1rem;
}

.lead {
    font-size: 1.25rem;
    font-weight: 300;
    color: #666;
}

code {
    font-family: var(--font-mono);
    background: #f0f0f0;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
}

blockquote {
    font-style: italic;
    font-size: 1.1rem;
    border-left: 4px solid #ff9800;
    padding-left: 1rem;
    margin: 1.5rem 0;
    color: #555;
}`, 'https://www.youtube.com/embed/yfoY53QXEnI', 1, null);

  insertLesson(db, 7, 'CSS Backgrounds', `## Background Color

The simplest background property sets a solid color:

\`\`\`css
body {
    background-color: #f5f5f5;
}
\`\`\`

## Background Image

\`\`\`css
.hero {
    background-image: url('hero-image.jpg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
}
\`\`\`

### Shorthand

\`\`\`css
.hero {
    background: url('hero.jpg') no-repeat center / cover;
}
\`\`\`

### Background Properties

| Property | Values | Description |
|----------|--------|-------------|
| \`background-size\` | \`cover\`, \`contain\`, \`auto\` | Controls image size |
| \`background-position\` | \`center\`, \`top\`, \`bottom\` | Controls image placement |
| \`background-repeat\` | \`no-repeat\`, \`repeat\`, \`repeat-x\` | Controls tiling |
| \`background-attachment\` | \`scroll\`, \`fixed\` | Controls scrolling behavior |

## CSS Gradients

### Linear Gradients

\`\`\`css
.gradient {
    background: linear-gradient(to right, #ff9800, #e74c3c);
}

.gradient-angled {
    background: linear-gradient(135deg, #667eea, #764ba2);
}
\`\`\`

### Radial Gradients

\`\`\`css
.radial {
    background: radial-gradient(circle, #ff9800, #e74c3c);
}
\`\`\`

## Background Overlay

A common pattern for hero sections:

\`\`\`css
.hero {
    position: relative;
    background: url('hero.jpg') center / cover;
}

.hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
}

.hero-content {
    position: relative;
    z-index: 1;
    color: white;
}
\`\`\`

## Background Clip

Controls how far the background extends:

\`\`\`css
.clip-text {
    background: linear-gradient(to right, #ff9800, #e74c3c);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
\`\`\`

Backgrounds are essential for creating visual hierarchy, drawing attention to important content, and adding depth to your designs.`, `/* Backgrounds Demo */

body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
}

/* Hero section with gradient overlay */
.hero {
    position: relative;
    height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
}

.hero-bg {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-content {
    position: relative;
    z-index: 1;
    padding: 20px;
}

/* Card backgrounds */
.card-gradient {
    background: linear-gradient(to bottom right, #ff9800, #ff5722);
    color: white;
    padding: 30px;
    border-radius: 12px;
    margin: 20px;
}

/* Gradient text */
.gradient-text {
    background: linear-gradient(to right, #ff9800, #e91e63);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 3rem;
    font-weight: bold;
    text-align: center;
}

/* Solid color backgrounds */
.bg-primary { background-color: #ff9800; color: white; padding: 20px; }
.bg-secondary { background-color: #333; color: white; padding: 20px; }

/* Radial gradient */
.radial-demo {
    background: radial-gradient(circle at 30% 30%, #ff9800, #e74c3c, #9b59b6);
    height: 300px;
    margin: 20px;
    border-radius: 12px;
}`, 'https://www.youtube.com/embed/yfoY53QXEnI', 2, null);

  insertLesson(db, 7, 'CSS Borders & Shadows', `## Border Radius

The \`border-radius\` property creates rounded corners:

\`\`\`css
.box {
    border-radius: 8px;               /* All corners */
    border-radius: 8px 16px;          /* TL/BR, TR/BL */
    border-radius: 8px 16px 24px 32px; /* TL, TR, BR, BL */
    border-radius: 50%;               /* Circle */
}
\`\`\`

## Box Shadow

The \`box-shadow\` property adds shadow effects around elements:

\`\`\`css
box-shadow: h-offset v-offset blur spread color;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);  /* Subtle shadow */
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); /* Deeper shadow */
\`\`\`

### Multiple Shadows

\`\`\`css
.card {
    box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.07),
        0 2px 4px rgba(0, 0, 0, 0.07),
        0 4px 8px rgba(0, 0, 0, 0.07),
        0 8px 16px rgba(0, 0, 0, 0.07);
}
\`\`\`

## Text Shadow

Adds shadow effects to text:

\`\`\`css
h1 {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.glow-text {
    text-shadow: 0 0 10px #ff9800, 0 0 20px #ff9800;
}
\`\`\`

## Border Styles

\`\`\`css
.dashed { border: 2px dashed #ff9800; }
.dotted { border: 3px dotted #333; }
.double { border: 4px double #ff9800; }
.underline { border-bottom: 2px solid #ff9800; }
\`\`\`

## Modern Shadow Techniques

### Card Hover Effect

\`\`\`css
.card {
    transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.card:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
}
\`\`\`

Borders and shadows add depth and dimension to flat designs, making elements feel tangible and interactive.`, `/* Borders & Shadows Demo */

body {
    font-family: Arial, sans-serif;
    padding: 30px;
    background: #f0f0f0;
}

/* Border variations */
.border-demo {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.border-box {
    padding: 20px;
    text-align: center;
    background: white;
}

.border-solid { border: 3px solid #ff9800; }
.border-dashed { border: 3px dashed #3498db; }
.border-dotted { border: 3px dotted #e74c3c; }
.border-double { border: 4px double #27ae60; }

/* Rounded corners */
.circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #ff9800;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

/* Box shadow examples */
.shadow-demo {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    margin-bottom: 30px;
}

.shadow-card {
    background: white;
    padding: 25px;
    border-radius: 12px;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.shadow-card:hover {
    transform: translateY(-5px);
}

.shadow-subtle {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.shadow-medium {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.shadow-heavy {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.shadow-neumorphic {
    background: #e0e0e0;
    border-radius: 20px;
    box-shadow: 8px 8px 16px #bebebe, -8px -8px 16px #ffffff;
}

/* Text shadows */
.text-shadow-demo {
    padding: 30px;
    text-align: center;
}

.shadow-glow {
    color: #ff9800;
    text-shadow: 0 0 10px #ff9800, 0 0 20px #ff9800;
}

.shadow-retro {
    text-shadow: 2px 2px 0 #ff9800, 4px 4px 0 #e74c3c;
}`, 'https://www.youtube.com/embed/yfoY53QXEnI', 3, null);

  insertQuiz(db, 7, 'CSS Styling Quiz', 3);

  insertQuestion(db, 7, 'Which shorthand property sets font weight, size, line-height, and family?', JSON.stringify(['text-style', 'font', 'font-face', 'typeface']), 1, 'The font shorthand: font: weight size/line-height family; sets all font properties in one declaration.');
  insertQuestion(db, 7, 'What does background-size: cover do?', JSON.stringify(['Scales the image to fill the container while maintaining aspect ratio', 'Stops the image from repeating', 'Makes the image half size', 'Adds a background color']), 0, 'cover scales the background image to fully cover the container while maintaining its aspect ratio.');
  insertQuestion(db, 7, 'Which CSS property adds a shadow to an element?', JSON.stringify(['shadow', 'box-shadow', 'element-shadow', 'drop-shadow']), 1, 'box-shadow adds a shadow effect around an element. Use filter: drop-shadow() for non-rectangular shadows.');

  // --- Topic: CSS Responsive ---
  insertTopic(db, 2, 'CSS Responsive', 4);

  insertLesson(db, 8, 'CSS Media Queries', `## What Are Media Queries?

Media queries are the backbone of responsive web design. They allow you to apply CSS rules **conditionally** based on device characteristics like screen width, height, orientation, and resolution.

## Basic Syntax

\`\`\`css
@media (condition) {
    /* CSS rules applied when condition is true */
}
\`\`\`

## Common Breakpoints

| Breakpoint | Width | Device |
|-----------|-------|--------|
| xs | < 576px | Mobile phones |
| sm | >= 576px | Large phones |
| md | >= 768px | Tablets |
| lg | >= 992px | Desktops |
| xl | >= 1200px | Large desktops |

## Mobile-First Approach

Always design for mobile first, then add styles for larger screens using \`min-width\`:

\`\`\`css
/* Mobile styles (base) */
.container {
    padding: 10px;
}

/* Tablet and up */
@media (min-width: 768px) {
    .container {
        padding: 20px;
        max-width: 720px;
        margin: 0 auto;
    }
}

/* Desktop and up */
@media (min-width: 992px) {
    .container {
        max-width: 960px;
    }
}
\`\`\`

## Common Responsive Patterns

### Responsive Navigation

\`\`\`css
.nav {
    display: flex;
    flex-direction: column;
}

@media (min-width: 768px) {
    .nav {
        flex-direction: row;
        justify-content: space-between;
    }
}
\`\`\`

### Responsive Grid

\`\`\`css
.grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}

@media (min-width: 768px) {
    .grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 992px) {
    .grid { grid-template-columns: repeat(3, 1fr); }
}
\`\`\`

## Other Media Features

\`\`\`css
@media (orientation: landscape) { ... }
@media (prefers-color-scheme: dark) { ... }
@media (prefers-reduced-motion: reduce) { ... }
@media print { ... }
\`\`\`

Media queries ensure your website looks great on every device.`, `/* Responsive Design Demo */

:root { --primary: #ff9800; }

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
}

.container { width: 100%; padding: 15px; }

.grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
    margin: 20px 0;
}

.card {
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
}

.navbar {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 15px;
    background: #333;
    color: white;
}

.nav-link { color: white; text-decoration: none; padding: 8px; }

h1 { font-size: 1.5rem; }
h2 { font-size: 1.25rem; }

@media (min-width: 768px) {
    .container { max-width: 720px; margin: 0 auto; }
    .grid { grid-template-columns: repeat(2, 1fr); }
    .navbar { flex-direction: row; justify-content: space-between; }
    h1 { font-size: 2rem; }
}

@media (min-width: 992px) {
    .container { max-width: 960px; }
    .grid { grid-template-columns: repeat(3, 1fr); }
    h1 { font-size: 2.5rem; }
}

@media (prefers-color-scheme: dark) {
    body { background: #1a1a1a; color: #e0e0e0; }
    .card { background: #2d2d2d; border-color: #444; }
}`, 'https://www.youtube.com/embed/yfoY53QXEnI', 1, null);

  insertLesson(db, 8, 'CSS Grid', `## Introduction to CSS Grid

CSS Grid is a two-dimensional layout system that handles both rows and columns simultaneously. It is the most powerful layout system in CSS, perfect for creating complex page layouts.

## Setting Up Grid

\`\`\`css
.container {
    display: grid;
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
    gap: 20px;
}
\`\`\`

## Defining Columns and Rows

### Flexible Columns with fr

The \`fr\` unit distributes available space proportionally:

\`\`\`css
grid-template-columns: 1fr 2fr 1fr;  /* 25% 50% 25% */
\`\`\`

### auto-fit and auto-fill

\`\`\`css
/* Responsive columns that wrap automatically */
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
\`\`\`

## Grid Gap

\`\`\`css
gap: 20px;
row-gap: 10px;
column-gap: 20px;
\`\`\`

## Grid Areas

Define a template for your layout using named areas:

\`\`\`css
.layout {
    display: grid;
    grid-template-columns: 250px 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        "header  header"
        "sidebar main"
        "footer  footer";
    gap: 10px;
    min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
\`\`\`

## Placing Items

### Line-Based Placement

\`\`\`css
.item {
    grid-column: 1 / 3;    /* Span from line 1 to line 3 */
    grid-row: 1 / 2;
}
\`\`\`

### span Keyword

\`\`\`css
.hero {
    grid-column: span 2;   /* Span 2 columns */
}
\`\`\`

## Alignment in Grid

\`\`\`css
.container {
    justify-items: center;
    align-items: center;
}

.item {
    justify-self: end;
    align-self: start;
}
\`\`\`

## Responsive Grid Without Media Queries

\`\`\`css
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
}
\`\`\`

CSS Grid and Flexbox are complementary. Grid excels at two-dimensional layouts (page layout, card grids), while Flexbox excels at one-dimensional layouts (navbars, row alignment).`, `/* CSS Grid Demo */

body { font-family: Arial, sans-serif; margin: 0; padding: 0; }

/* Page layout with grid areas */
.page-layout {
    display: grid;
    grid-template-columns: 250px 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        "header  header"
        "sidebar main"
        "footer  footer";
    min-height: 100vh;
}

.header { grid-area: header; background: #ff9800; color: white; padding: 20px; }
.sidebar { grid-area: sidebar; background: #333; color: white; padding: 20px; }
.main { grid-area: main; padding: 30px; background: #f5f5f5; }
.footer { grid-area: footer; background: #222; color: white; text-align: center; padding: 15px; }

/* Card grid */
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    padding: 20px;
}

.card {
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Spanning items */
.featured-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    padding: 20px;
}

.featured-grid .wide { grid-column: span 2; background: #ff9800; color: white; }
.featured-grid .tall { grid-row: span 2; background: #333; color: white; }

/* Dashboard layout */
.dashboard {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    padding: 20px;
}

.stat-card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.stat-card .number { font-size: 2rem; font-weight: bold; color: #ff9800; }

@media (max-width: 768px) {
    .page-layout {
        grid-template-columns: 1fr;
        grid-template-areas: "header" "main" "footer";
    }
    .sidebar { display: none; }
    .featured-grid { grid-template-columns: 1fr; }
    .featured-grid .wide { grid-column: span 1; }
    .dashboard { grid-template-columns: repeat(2, 1fr); }
}`, 'https://www.youtube.com/embed/yfoY53QXEnI', 2, JSON.stringify({
    description: "Create a responsive dashboard layout using CSS Grid with a header, sidebar, main content area with stat cards in a grid, and a footer. The layout should collapse to a single column on mobile.",
    hints: ["Use grid-template-areas for the page layout", "Use repeat(auto-fit, minmax(250px, 1fr)) for the stat cards", "Use a media query to hide the sidebar on mobile"],
    starterCode: "/* Dashboard Layout */\n.dashboard {\n    display: grid;\n    grid-template-columns: 250px 1fr;\n    grid-template-areas:\n        'header header'\n        'sidebar main'\n        'footer footer';\n    min-height: 100vh;\n}\n\n/* Card grid inside main */\n.stats {\n    display: grid;\n    /* Add responsive columns */\n    gap: 15px;\n}"
  }));

  insertQuiz(db, 8, 'CSS Responsive Quiz', 4);

  insertQuestion(db, 8, 'What does min-width: 768px mean in a media query?', JSON.stringify(['Apply styles when viewport is exactly 768px', 'Apply styles when viewport is 768px or wider', 'Apply styles when viewport is 768px or narrower', 'Apply styles only on tablets']), 1, 'min-width: 768px applies styles when the viewport is at least 768 pixels wide, covering tablets and larger screens.');
  insertQuestion(db, 8, 'Which CSS Grid function creates responsive columns without media queries?', JSON.stringify(['repeat(3, 1fr)', 'repeat(auto-fit, minmax(300px, 1fr))', 'grid-columns: auto', 'auto-columns()']), 1, 'repeat(auto-fit, minmax(300px, 1fr)) creates columns that are at least 300px wide and wrap responsively.');
  insertQuestion(db, 8, 'What does the fr unit represent in CSS Grid?', JSON.stringify(['Fixed ratio', 'Fraction of available space', 'First row', 'Flexible resize']), 1, 'fr stands for "fraction" — it distributes available space proportionally among grid tracks.');

  // ============================================================
  // 3. LEARN JAVASCRIPT
  // ============================================================
  insertCourse(db, 'Learn JavaScript', 'javascript', 'Master JavaScript programming from fundamentals to DOM manipulation and modern ES6+ features. Build interactive web applications.', 'code-square', '#f7df1e', 3, 15, 'en');

  // --- Topic: JS Basics ---
  insertTopic(db, 3, 'JS Basics', 1);

  insertLesson(db, 9, 'JS Introduction', `## What is JavaScript?

JavaScript (JS) is a versatile programming language that runs in web browsers, on servers (Node.js), in mobile apps, desktop applications, and even IoT devices. It is the only language that runs natively in browsers, making it essential for web development.

## Where JavaScript Runs

- **Browsers** — Chrome (V8), Firefox (SpiderMonkey), Safari (JavaScriptCore)
- **Servers** — Node.js, Deno, Bun
- **Mobile** — React Native, Ionic
- **Desktop** — Electron (VS Code, Discord, Slack are built with it)

## Your First JavaScript

\`\`\`html
<!-- Inline (Not Recommended) -->
<button onclick="alert('Hello!')">Click Me</button>

<!-- Internal Script -->
<script>
    console.log('Hello, World!');
</script>

<!-- External Script (Recommended) -->
<script src="app.js"></script>
\`\`\`

## Console Output

\`\`\`javascript
console.log('Hello, World!');     // Standard output
console.warn('Warning message');  // Yellow warning
console.error('Error message');   // Red error
console.table([{name: 'Alice', age: 25}]);
console.time('timer');
// ... code ...
console.timeEnd('timer');
\`\`\`

## Comments

\`\`\`javascript
// Single line comment

/*
   Multi-line comment
*/
\`\`\`

## Strict Mode

\`\`\`javascript
'use strict';
// Without strict mode, x = 10 creates a global variable
// With strict mode, it throws an error
\`\`\`

JavaScript is the backbone of interactive web development. Learning it opens doors to frontend, backend, mobile, and desktop development.`, `// app.js - Your first JavaScript file

'use strict';

// Console output methods
console.log('Welcome to LearnHub!');
console.warn('This is a warning');
console.error('This is an error');

// Arithmetic
const a = 10;
const b = 3;
console.log('Addition:', a + b);
console.log('Subtraction:', a - b);
console.log('Multiplication:', a * b);
console.log('Division:', a / b);
console.log('Modulus:', a % b);
console.log('Exponent:', a ** b);`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 1, null);

  insertLesson(db, 9, 'JS Variables', `## Variable Declaration

### let

\`let\` creates a block-scoped variable that can be reassigned:

\`\`\`javascript
let score = 0;
score = 10;       // Valid reassignment
score = score + 5; // Valid
\`\`\`

### const

\`const\` creates a block-scoped variable that **cannot be reassigned**:

\`\`\`javascript
const PI = 3.14159;
PI = 3.14;  // TypeError: Assignment to constant variable

// But objects and arrays CAN be mutated:
const user = { name: 'Alice' };
user.name = 'Bob';  // Valid
// user = {};       // TypeError
\`\`\`

### var (Legacy)

\`var\` is function-scoped and hoisted. Avoid it in modern code.

## Naming Conventions

| Convention | Example | Use Case |
|-----------|---------|----------|
| camelCase | \`firstName\` | Variables, functions |
| PascalCase | \`UserProfile\` | Classes, constructors |
| UPPER_SNAKE | \`MAX_SIZE\` | Constants |
| kebab-case | \`user-name\` | CSS classes, file names |

## Data Types

### Primitive Types

- **String** — \`'hello'\`, \`"hello"\`, \`\`hello\`\`
- **Number** — \`42\`, \`3.14\`, \`Infinity\`, \`NaN\`
- **Boolean** — \`true\`, \`false\`
- **undefined** — Variable declared but not assigned
- **null** — Intentional absence of value

### Reference Types

- **Object** — \`{ key: value }\`
- **Array** — \`[1, 2, 3]\`

## typeof Operator

\`\`\`javascript
typeof 'hello'    // 'string'
typeof 42         // 'number'
typeof true       // 'boolean'
typeof undefined  // 'undefined'
typeof null       // 'object' (known JS bug!)
typeof {}         // 'object'
typeof []         // 'object'
typeof function(){} // 'function'
\`\`\`

## Template Literals

\`\`\`javascript
const name = 'Alice';
const message = \\\`Hello, \\\${name}! Welcome to JavaScript.\\\`;
\`\`\`

## Type Conversion

\`\`\`javascript
String(42);         // '42'
Number('42');       // 42
Boolean(0);         // false
Boolean('hello');   // true
\`\`\``, `// Variables and Data Types Demo

'use strict';

let userName = 'Alice';
let userAge = 25;
let isLoggedIn = true;

userName = 'Bob';
console.log('Updated name:', userName);

const API_URL = 'https://api.example.com';
const MAX_USERS = 100;
console.log('API URL:', API_URL);

console.log('\\n--- Data Types ---');
console.log('String:', typeof 'hello');
console.log('Number:', typeof 42);
console.log('Boolean:', typeof true);
console.log('Undefined:', typeof undefined);
console.log('Null:', typeof null);

const firstName = 'John';
const lastName = 'Doe';
const fullName = \\\`\\\${firstName} \\\${lastName}\\\`;
console.log('\\nFull name:', fullName);

console.log('\\n--- Type Conversion ---');
console.log('Number("42"):', Number('42'));
console.log('String(42):', String(42));
console.log('Boolean(0):', Boolean(0));
console.log('Boolean("hello"):', Boolean('hello'));`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 2, null);

  insertLesson(db, 9, 'JS Data Types', `## Primitive Types Deep Dive

### Strings

\`\`\`javascript
const name = 'JavaScript';
console.log(name.length);           // 10
console.log(name.toUpperCase());   // 'JAVASCRIPT'
console.log(name.toLowerCase());   // 'javascript'
console.log(name.includes('Script')); // true
console.log(name.indexOf('Script'));  // 4
console.log(name.slice(0, 4));      // 'Java'
console.log(name.replace('Script', 'Lang')); // 'JavaLang'
console.log(name.trim());          // No whitespace to trim
\`\`\`

### Numbers

\`\`\`javascript
const int = 42;
const float = 3.14;
const exponential = 1e6;  // 1000000
const hex = 0xff;          // 255

Number.isInteger(42);      // true
(42).toFixed(2);           // '42.00'
\`\`\`

### Booleans and Truthy/Falsy

\`\`\`javascript
// Falsy values (evaluate to false in boolean context):
// false, 0, -0, 0n, '', null, undefined, NaN

// Truthy values (everything else):
// 'hello', 42, [], {}, true, -1, '0', 'false'
\`\`\`

## Reference Types

### Arrays

\`\`\`javascript
const fruits = ['apple', 'banana', 'cherry'];
console.log(fruits.length);      // 3
console.log(fruits[0]);         // 'apple'
console.log(fruits.includes('banana')); // true
\`\`\`

### Objects

\`\`\`javascript
const person = {
    name: 'Alice',
    age: 25,
    greet() {
        return \\\`Hi, I'm \\\${this.name}\\\`;
    }
};
console.log(person.name);    // 'Alice'
console.log(person.greet()); // "Hi, I'm Alice"
\`\`\`

## Null vs Undefined

- **\`undefined\`** — A variable declared but not assigned a value. JavaScript assigns this automatically.
- **\`null\`** — An intentional assignment of "no value." You use this deliberately.

## Equality Comparisons

\`\`\`javascript
// == (loose equality) - performs type coercion
5 == '5'      // true

// === (strict equality) - no type coercion (RECOMMENDED)
5 === '5'     // false
5 === 5       // true
\`\`\`

Always use \`===\` and \`!==\` to avoid unexpected type coercion bugs.`, `// Data Types Deep Dive

'use strict';

// String methods
const str = '  Hello, JavaScript!  ';
console.log('Original:', str);
console.log('Trimmed:', str.trim());
console.log('Upper:', str.trim().toUpperCase());
console.log('Slice(0,5):', str.trim().slice(0, 5));
console.log('Includes "Java":', str.includes('Java'));
console.log('Replace:', str.trim().replace('JavaScript', 'JS'));

// Number methods
const num = 42;
console.log('\\nNumber.isInteger(42):', Number.isInteger(num));
console.log('(3.14).toFixed(1):', (3.14).toFixed(1));
console.log('parseInt("42px"):', parseInt('42px'));
console.log('parseFloat("3.14em"):', parseFloat('3.14em'));

// Truthy and Falsy
console.log('\\n--- Falsy Values ---');
console.log('Boolean(false):', Boolean(false));
console.log('Boolean(0):', Boolean(0));
console.log('Boolean(""):', Boolean(''));
console.log('Boolean(null):', Boolean(null));
console.log('Boolean(undefined):', Boolean(undefined));
console.log('Boolean(NaN):', Boolean(NaN));

console.log('\\n--- Truthy Values ---');
console.log('Boolean("hello"):', Boolean('hello'));
console.log('Boolean(42):', Boolean(42));
console.log('Boolean([]):', Boolean([]));
console.log('Boolean({}):', Boolean({}));

// Equality
console.log('\\n--- Equality ---');
console.log('5 == "5":', 5 == '5');
console.log('5 === "5":', 5 === '5');
console.log('null == undefined:', null == undefined);
console.log('null === undefined:', null === undefined);`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 3, null);

  insertLesson(db, 9, 'JS Operators', `## Arithmetic Operators

\`\`\`javascript
const a = 10;
const b = 3;

console.log(a + b);   // 13 (addition)
console.log(a - b);   // 7 (subtraction)
console.log(a * b);   // 30 (multiplication)
console.log(a / b);   // 3.333... (division)
console.log(a % b);   // 1 (modulus/remainder)
console.log(a ** b);  // 1000 (exponentiation)
\`\`\`

## Assignment Operators

\`\`\`javascript
let x = 10;
x += 5;   // x = x + 5  (15)
x -= 3;   // x = x - 3  (12)
x *= 2;   // x = x * 2  (24)
x /= 4;   // x = x / 4  (6)
x %= 4;   // x = x % 4  (2)
x **= 3;  // x = x ** 3 (8)
\`\`\`

## Comparison Operators

\`\`\`javascript
// Equality (== vs ===)
5 == '5'     // true  (loose - type coercion)
5 === '5'    // false (strict - no coercion)

// Inequality
5 != '5'     // false (loose)
5 !== '5'    // true  (strict)

// Relational
5 > 3        // true
5 < 3        // false
5 >= 5       // true
5 <= 4       // false
\`\`\`

## Logical Operators

\`\`\`javascript
true && true    // true  (AND)
true && false   // false
true || false   // true  (OR)
false || false  // false
!true           // false (NOT)
\`\`\`

## Nullish Coalescing (??)

\`\`\`javascript
const input = null;
const value = input ?? 'default'; // 'default'
// Only treats null/undefined as falsy, NOT 0 or ''
\`\`\`

## Optional Chaining (?.)

\`\`\`javascript
const user = { address: { city: 'NYC' } };
const city = user?.address?.city; // 'NYC'
const zip = user?.address?.zip;   // undefined (no error!)
\`\`\`

## Template Literals

\`\`\`javascript
const name = 'Alice';
const age = 25;
const msg = \\\`Hello, \\\${name}! You are \\\${age} years old.\\\`;
\`\`\`

## Typeof Operator

\`\`\`javascript
typeof 'hello'    // 'string'
typeof 42         // 'number'
typeof true       // 'boolean'
typeof undefined  // 'undefined'
typeof null       // 'object' (bug!)
\`\`\``, `// Operators Demo

'use strict';

// Arithmetic
console.log('--- Arithmetic ---');
console.log('10 + 3 =', 10 + 3);
console.log('10 - 3 =', 10 - 3);
console.log('10 * 3 =', 10 * 3);
console.log('10 / 3 =', (10 / 3).toFixed(2));
console.log('10 % 3 =', 10 % 3);
console.log('10 ** 3 =', 10 ** 3);

// Assignment
let x = 10;
console.log('\\n--- Assignment ---');
console.log('x = 10');
x += 5; console.log('x += 5:', x);
x -= 3; console.log('x -= 3:', x);
x *= 2; console.log('x *= 2:', x);

// Comparison
console.log('\\n--- Comparison ---');
console.log('5 == "5":', 5 == '5');
console.log('5 === "5":', 5 === '5');
console.log('10 > 5:', 10 > 5);
console.log('10 <= 10:', 10 <= 10);

// Logical
console.log('\\n--- Logical ---');
console.log('true && false:', true && false);
console.log('true || false:', true || false);
console.log('!true:', !true);

// Nullish coalescing and optional chaining
console.log('\\n--- Advanced ---');
console.log('null ?? "default":', null ?? 'default');
console.log('0 ?? "default":', 0 ?? 'default');

const user = { profile: { name: 'Alice' } };
console.log('user?.profile?.name:', user?.profile?.name);
console.log('user?.profile?.age:', user?.profile?.age);`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 4, null);

  insertQuiz(db, 9, 'JS Basics Quiz', 1);

  insertQuestion(db, 9, 'What is the difference between let and const?', JSON.stringify(['let is global, const is local', 'let can be reassigned, const cannot', 'const is faster than let', 'They are exactly the same']), 1, 'let allows reassignment of values, while const cannot be reassigned after initialization. Both are block-scoped.');
  insertQuestion(db, 9, 'What does typeof null return?', JSON.stringify(['"null"', '"undefined"', '"object"', '"boolean"']), 2, 'typeof null returns "object" — this is a well-known bug in JavaScript that has existed since the language was created.');
  insertQuestion(db, 9, 'Which value is falsy in JavaScript?', JSON.stringify(['"0"', '[]', '0', '-1']), 2, '0 is a falsy value. Empty strings "", arrays [], and objects {} are truthy despite being "empty."');
  insertQuestion(db, 9, 'What is the result of 5 === "5"?', JSON.stringify(['true', 'false', 'TypeError', 'undefined']), 1, 'strict equality (===) does not perform type coercion, so number 5 is not equal to string "5".');

  // --- Topic: JS Control Flow ---
  insertTopic(db, 3, 'JS Control Flow', 2);

  insertLesson(db, 10, 'JS Conditionals', `## if/else Statements

\`\`\`javascript
const temperature = 25;

if (temperature > 30) {
    console.log('It is hot outside!');
} else if (temperature > 20) {
    console.log('It is nice outside!');
} else {
    console.log('It is cold outside!');
}
\`\`\`

## Nested Conditionals

\`\`\`javascript
const isLoggedIn = true;
const isAdmin = false;

if (isLoggedIn) {
    if (isAdmin) {
        console.log('Welcome, Admin!');
    } else {
        console.log('Welcome, User!');
    }
} else {
    console.log('Please log in.');
}
\`\`\`

## switch Statement

Use \`switch\` when comparing a single value against many possible cases:

\`\`\`javascript
const day = 'Monday';

switch (day) {
    case 'Monday':
    case 'Tuesday':
    case 'Wednesday':
    case 'Thursday':
    case 'Friday':
        console.log('Weekday');
        break;
    case 'Saturday':
    case 'Sunday':
        console.log('Weekend');
        break;
    default:
        console.log('Invalid day');
}
\`\`\`

## Ternary Operator

A shorthand for simple if/else statements:

\`\`\`javascript
const age = 20;
const canVote = age >= 18 ? 'Yes' : 'No';

// Equivalent to:
let canVote;
if (age >= 18) {
    canVote = 'Yes';
} else {
    canVote = 'No';
}
\`\`\`

## Truthy and Falsy Values

\`\`\`javascript
// Falsy values (8 total):
// false, 0, -0, 0n, '', null, undefined, NaN

// Everything else is truthy

const name = '';
if (name) {
    console.log('Has name');    // Won't run
} else {
    console.log('No name');     // This runs
}
\`\`\`

## Logical Short-Circuiting

\`\`\`javascript
// OR (||) - returns first truthy value
const name = user.name || 'Anonymous';

// AND (&&) - returns first falsy value or last value
const admin && admin.name; // Returns admin.name if admin exists

// Nullish Coalescing (??) - only null/undefined trigger default
const port = config.port ?? 3000; // 0 is not treated as missing
\`\`\`

## Best Practices

- Always use \`===\` (strict equality) in conditions, never \`==\`.
- Use \`switch\` when comparing against many discrete values.
- Use ternary operators only for simple, readable expressions.
- Use optional chaining (\`?.\`) to safely access nested properties.`, `// Conditionals Demo

'use strict';

const temperature = 28;
const hour = 14;
const isRaining = false;

// if/else
console.log('--- Temperature Check ---');
if (temperature > 30) {
    console.log('It is hot outside!');
} else if (temperature > 20) {
    console.log('Nice weather:', temperature + '°C');
} else {
    console.log('It is cold outside!');
}

// switch
console.log('\\n--- Day Type ---');
const dayOfWeek = new Date().getDay();
switch (dayOfWeek) {
    case 0: console.log('Sunday - Rest day'); break;
    case 6: console.log('Saturday - Weekend'); break;
    default: console.log('Weekday - Time to work'); break;
}

// Ternary
console.log('\\n--- Ternary ---');
const weather = isRaining ? 'Stay inside' : 'Go outside';
console.log(weather);

// Truthy/Falsy
console.log('\\n--- Truthy/Falsy ---');
const values = [0, '', null, undefined, NaN, 'hello', 42, [], {}];
values.forEach(v => {
    console.log(\`Boolean(\${JSON.stringify(v)}): \${Boolean(v)}\`);
});

// Short-circuiting
console.log('\\n--- Short-circuiting ---');
const username = '';
const displayName = username || 'Guest';
console.log('Display name:', displayName);

const settings = { theme: null };
const theme = settings.theme ?? 'light';
console.log('Theme:', theme); // 'light' (null triggers ??)

const config = { port: 0 };
const port = config.port ?? 3000;
console.log('Port:', port); // 0 (0 does not trigger ??)`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 1, null);

  insertLesson(db, 10, 'JS Loops', `## for Loop

\`\`\`javascript
for (let i = 0; i < 5; i++) {
    console.log(i); // 0, 1, 2, 3, 4
}
\`\`\`

## while Loop

\`\`\`javascript
let count = 0;
while (count < 5) {
    console.log(count);
    count++;
}
\`\`\`

## do...while Loop

Executes at least once before checking the condition:

\`\`\`javascript
let input;
do {
    input = 'yes'; // Simulating user input
    console.log('Processing...');
} while (input !== 'yes');
\`\`\`

## for...of Loop

Iterates over **values** of iterable objects (arrays, strings, Maps, Sets):

\`\`\`javascript
const fruits = ['apple', 'banana', 'cherry'];
for (const fruit of fruits) {
    console.log(fruit);
}

const word = 'Hello';
for (const char of word) {
    console.log(char);
}
\`\`\`

## for...in Loop

Iterates over **keys/indices** of an object:

\`\`\`javascript
const person = { name: 'Alice', age: 25, city: 'NYC' };
for (const key in person) {
    console.log(\`\${key}: \${person[key]}\`);
}
\`\`\`

**Important:** Use \`for...in\` for objects, \`for...of\` for arrays and iterables.

## break and continue

\`\`\`javascript
// break - exits the loop entirely
for (let i = 0; i < 10; i++) {
    if (i === 5) break;
    console.log(i); // 0, 1, 2, 3, 4
}

// continue - skips to the next iteration
for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) continue;
    console.log(i); // 1, 3, 5, 7, 9
}
\`\`\`

## Labeled Statements

\`\`\`javascript
outer: for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (i === 1 && j === 1) break outer;
        console.log(\`\${i},\${j}\`);
    }
}
\`\`\`

## Loop Performance Tips

- Prefer \`for...of\` over \`forEach\` when you need to \`break\` or \`await\`.
- Avoid modifying arrays while iterating — create new arrays instead.
- Use \`break\` early to avoid unnecessary iterations.`, `// Loops Demo

'use strict';

// for loop
console.log('--- for loop ---');
for (let i = 1; i <= 5; i++) {
    console.log(\`Iteration \${i}\`);
}

// while loop
console.log('\\n--- while loop ---');
let n = 10;
while (n > 0) {
    if (n === 3) { console.log('Almost done!'); }
    n--;
}

// for...of (arrays)
console.log('\\n--- for...of (array) ---');
const colors = ['red', 'green', 'blue'];
for (const color of colors) {
    console.log(\`Color: \${color}\`);
}

// for...of (string)
console.log('\\n--- for...of (string) ---');
for (const char of 'Learn') {
    console.log(char);
}

// for...in (object)
console.log('\\n--- for...in (object) ---');
const student = { name: 'Bob', grade: 'A', age: 22 };
for (const key in student) {
    console.log(\`\${key}: \${student[key]}\`);
}

// break and continue
console.log('\\n--- break at 5 ---');
for (let i = 0; i < 10; i++) {
    if (i === 5) break;
    console.log(i);
}

console.log('\\n--- skip even numbers ---');
for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) continue;
    console.log(i);
}`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 2, null);

  insertLesson(db, 10, 'JS Functions', `## Function Declaration

\`\`\`javascript
function greet(name) {
    return \\\`Hello, \\\${name}!\\\`;
}

console.log(greet('Alice')); // "Hello, Alice!"
\`\`\`

## Function Expression

\`\`\`javascript
const add = function(a, b) {
    return a + b;
};

console.log(add(3, 5)); // 8
\`\`\`

## Arrow Functions (ES6)

\`\`\`javascript
// Full syntax
const multiply = (a, b) => {
    return a * b;
};

// Implicit return (single expression)
const square = x => x * x;

// No parameters
const sayHello = () => 'Hello!';

console.log(multiply(3, 4)); // 12
console.log(square(5));       // 25
\`\`\`

## Parameters and Default Values

\`\`\`javascript
function createUser(name, role = 'student', active = true) {
    return { name, role, active };
}

createUser('Alice');            // { name: 'Alice', role: 'student', active: true }
createUser('Bob', 'admin');    // { name: 'Bob', role: 'admin', active: true }
\`\`\`

## Rest Parameters

\`\`\`javascript
function sum(...numbers) {
    return numbers.reduce((total, n) => total + n, 0);
}

sum(1, 2, 3, 4); // 10
\`\`\`

## Higher-Order Functions

Functions that take or return other functions:

\`\`\`javascript
function createMultiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15
\`\`\`

## IIFE (Immediately Invoked Function Expression)

\`\`\`javascript
(function() {
    const secret = 'I am private';
    console.log(secret);
})(); // Runs immediately
\`\`\`

## Callback Functions

\`\`\`javascript
function fetchData(callback) {
    const data = { id: 1, name: 'Alice' };
    callback(data);
}

fetchData(function(data) {
    console.log(data.name); // 'Alice'
});
\`\`\`

## Best Practices

- Use **arrow functions** for short callbacks and anonymous functions.
- Use **function declarations** for named, reusable functions (they are hoisted).
- Always use **default parameters** instead of manual checks.
- Keep functions **small** and **single-purpose** (SRP).`, `// Functions Demo

'use strict';

// Function declaration
function greet(name) {
    return \\\`Hello, \\\${name}!\\\`;
}
console.log(greet('Alice'));

// Arrow functions
const add = (a, b) => a + b;
const square = x => x * x;
const getGreeting = () => 'Welcome!';

console.log('Add:', add(3, 5));
console.log('Square:', square(4));
console.log('Greeting:', getGreeting());

// Default parameters
function createUser(name, role = 'student', active = true) {
    return { name, role, active };
}
console.log('\\nUser 1:', createUser('Alice'));
console.log('User 2:', createUser('Bob', 'admin'));

// Rest parameters
function sum(...numbers) {
    return numbers.reduce((total, n) => total + n, 0);
}
console.log('\\nSum:', sum(1, 2, 3, 4, 5));

// Higher-order functions
function createMultiplier(factor) {
    return number => number * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
console.log('\\nDouble 5:', double(5));
console.log('Triple 5:', triple(5));

// Callback pattern
function processArray(arr, callback) {
    return arr.map(callback);
}

const numbers = [1, 2, 3, 4];
const doubled = processArray(numbers, n => n * 2);
const squared = processArray(numbers, n => n ** 2);
console.log('\\nDoubled:', doubled);
console.log('Squared:', squared);`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 3, null);

  insertQuiz(db, 10, 'JS Control Flow Quiz', 2);

  insertQuestion(db, 10, 'What does the === operator do?', JSON.stringify(['Compares values with type coercion', 'Compares values without type coercion', 'Assigns a value', 'Checks if two variables point to the same object']), 1, 'The === operator performs strict equality comparison — it checks both value and type without performing any type coercion.');
  insertQuestion(db, 10, 'What is the difference between for...of and for...in?', JSON.stringify(['for...of iterates keys, for...in iterates values', 'for...of iterates values, for...in iterates keys', 'They are the same', 'for...in is for arrays, for...of is for objects']), 1, 'for...of iterates over values of iterables (arrays, strings), while for...in iterates over enumerable property keys (object properties).');
  insertQuestion(db, 10, 'What is the output of: let x = 5; x ?? "default"?', JSON.stringify(['"default"', '5', 'null', 'undefined']), 1, 'The nullish coalescing operator (??) returns the right operand only when the left is null or undefined. Since 5 is neither, it returns 5.');
  insertQuestion(db, 10, 'Which is the correct arrow function with implicit return?', JSON.stringify(['const f = (x) => { x * 2 }', 'const f = (x) => x * 2', 'const f = (x) => return x * 2', 'const f = x -> x * 2']), 1, 'Arrow functions with implicit return omit the curly braces and return keyword. The expression after => is automatically returned.');

  // --- Topic: JS Arrays & Objects ---
  insertTopic(db, 3, 'JS Arrays & Objects', 3);

  insertLesson(db, 11, 'JS Arrays', `## Creating Arrays

\`\`\`javascript
const fruits = ['apple', 'banana', 'cherry'];
const numbers = new Array(1, 2, 3, 4, 5);
const mixed = [1, 'hello', true, null, { name: 'Alice' }];
const empty = [];
\`\`\`

## Accessing Elements

\`\`\`javascript
const arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr[0]);    // 'a' (first element)
console.log(arr[2]);    // 'c' (third element)
console.log(arr.at(-1)); // 'e' (last element)
console.log(arr.length); // 5
\`\`\`

## Adding and Removing

\`\`\`javascript
const arr = [1, 2, 3];

// Add to end
arr.push(4);         // [1, 2, 3, 4]
arr.push(5, 6);     // [1, 2, 3, 4, 5, 6]

// Remove from end
const last = arr.pop();  // Returns 6, arr is [1, 2, 3, 4, 5]

// Add to beginning
arr.unshift(0);     // [0, 1, 2, 3, 4, 5]

// Remove from beginning
const first = arr.shift(); // Returns 0
\`\`\`

## splice (Add, Remove, Replace)

\`\`\`javascript
const arr = [1, 2, 3, 4, 5];

// Remove 2 elements starting at index 1
arr.splice(1, 2);     // [1, 4, 5] (removed [2, 3])

// Insert at index 1
arr.splice(1, 0, 'a', 'b'); // [1, 'a', 'b', 4, 5]

// Replace 1 element at index 2
arr.splice(2, 1, 'x'); // [1, 'a', 'x', 4, 5]
\`\`\`

## slice (Extract Portion)

\`\`\`javascript
const arr = [1, 2, 3, 4, 5];
const copy = arr.slice();       // Full copy [1, 2, 3, 4, 5]
const sub = arr.slice(1, 3);   // [2, 3] (index 1 to 2)
const fromEnd = arr.slice(-2); // [4, 5] (last 2 elements)
\`\`\`

## includes and indexOf

\`\`\`javascript
const arr = ['apple', 'banana', 'cherry'];
console.log(arr.includes('banana')); // true
console.log(arr.indexOf('cherry'));  // 2
console.log(arr.indexOf('grape'));   // -1 (not found)
\`\`\`

## Spread Operator

\`\`\`javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Copy array
const copy = [...arr1];

// Add elements
const extended = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]
\`\`\`

## Destructuring

\`\`\`javascript
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]

// Skip elements
const [, , third] = ['a', 'b', 'c']; // third = 'c'
\`\`\``, `// Arrays Demo

'use strict';

// Creating and accessing
const fruits = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
console.log('Fruits:', fruits);
console.log('First:', fruits[0]);
console.log('Last:', fruits.at(-1));
console.log('Length:', fruits.length);

// Adding and removing
console.log('\\n--- Push/Pop ---');
const stack = [1, 2, 3];
stack.push(4);
console.log('After push(4):', stack);
const popped = stack.pop();
console.log('Popped:', popped, '| Stack:', stack);

// Splice
console.log('\\n--- Splice ---');
const arr = ['a', 'b', 'c', 'd', 'e'];
const removed = arr.splice(1, 2);
console.log('Removed:', removed);
console.log('Array:', arr);
arr.splice(1, 0, 'x', 'y');
console.log('After insert:', arr);

// Slice
console.log('\\n--- Slice ---');
const original = [1, 2, 3, 4, 5];
const sliced = original.slice(1, 3);
console.log('Sliced(1,3):', sliced);
console.log('Original unchanged:', original);

// Spread
console.log('\\n--- Spread ---');
const nums1 = [1, 2, 3];
const nums2 = [4, 5, 6];
const combined = [...nums1, ...nums2];
console.log('Combined:', combined);

// Destructuring
console.log('\\n--- Destructuring ---');
const [a, b, ...rest] = [10, 20, 30, 40, 50];
console.log('a:', a, 'b:', b, 'rest:', rest);`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 1, null);

  insertLesson(db, 11, 'JS Array Methods', `## forEach

Executes a function for each element (no return value):

\`\`\`javascript
const fruits = ['apple', 'banana', 'cherry'];
fruits.forEach((fruit, index) => {
    console.log(\`\${index}: \${fruit}\`);
});
\`\`\`

## map

Creates a **new array** by transforming each element:

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8, 10]
\`\`\`

## filter

Creates a **new array** with elements that pass a test:

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
const evens = numbers.filter(n => n % 2 === 0);
// [2, 4, 6, 8]
\`\`\`

## reduce

Reduces an array to a single value:

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((accumulator, current) => {
    return accumulator + current;
}, 0); // 15
\`\`\`

## find

Returns the **first element** that matches a condition:

\`\`\`javascript
const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
];

const user = users.find(u => u.id === 2);
// { id: 2, name: 'Bob' }
\`\`\`

## findIndex

Returns the **index** of the first matching element (-1 if not found).

## sort

Sorts elements **in place** (modifies original array):

\`\`\`javascript
const numbers = [3, 1, 4, 1, 5, 9];
numbers.sort((a, b) => a - b); // Ascending: [1, 1, 3, 4, 5, 9]

const names = ['Charlie', 'Alice', 'Bob'];
names.sort(); // Alphabetical: ['Alice', 'Bob', 'Charlie']
\`\`\`

## some and every

\`\`\`javascript
const numbers = [2, 4, 6, 8, 10];
numbers.some(n => n > 8);  // true (at least one)
numbers.every(n => n > 0); // true (all positive)
numbers.every(n => n > 5); // false (not all > 5)
\`\`\`

## Chaining Methods

\`\`\`javascript
const result = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    .filter(n => n % 2 === 0)
    .map(n => n ** 2)
    .reduce((sum, n) => sum + n, 0);
// 220 (4 + 16 + 36 + 64 + 100)
\`\`\`

These functional array methods are the backbone of modern JavaScript. They make code concise, readable, and less error-prone compared to traditional for loops.`, `// Array Methods Demo

'use strict';

const students = [
    { name: 'Alice', grade: 92, age: 20 },
    { name: 'Bob', grade: 78, age: 22 },
    { name: 'Charlie', grade: 85, age: 21 },
    { name: 'Diana', grade: 95, age: 19 },
    { name: 'Eve', grade: 68, age: 23 }
];

// forEach
console.log('--- forEach ---');
students.forEach((s, i) => {
    console.log(\`\${i + 1}. \${s.name} (\${s.age})\`);
});

// map
console.log('\\n--- map ---');
const names = students.map(s => s.name);
console.log('Names:', names);

const summaries = students.map(s => ({
    name: s.name,
    passed: s.grade >= 70
}));
console.log('Summaries:', summaries);

// filter
console.log('\\n--- filter ---');
const honorRoll = students.filter(s => s.grade >= 85);
console.log('Honor roll:', honorRoll.map(s => s.name));

// reduce
console.log('\\n--- reduce ---');
const avgGrade = students.reduce((sum, s) => sum + s.grade, 0) / students.length;
console.log('Average grade:', avgGrade.toFixed(1));

// find
console.log('\\n--- find ---');
const topStudent = students.find(s => s.grade > 90);
console.log('Top student:', topStudent.name);

// sort
console.log('\\n--- sort ---');
const sorted = [...students].sort((a, b) => b.grade - a.grade);
console.log('By grade (desc):', sorted.map(s => s.name));

// Chaining
console.log('\\n--- Chaining ---');
const result = students
    .filter(s => s.grade >= 75)
    .map(s => s.name)
    .sort();
console.log('Filtered, mapped, sorted:', result);

// some / every
console.log('\\n--- some/every ---');
console.log('Anyone under 21?', students.some(s => s.age < 21));
console.log('All passed?', students.every(s => s.grade >= 70));`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 2, null);

  insertLesson(db, 11, 'JS Objects', `## Creating Objects

\`\`\`javascript
// Object literal (most common)
const person = {
    name: 'Alice',
    age: 25,
    city: 'New York'
};

// Constructor
const obj = new Object();
obj.name = 'Bob';

// Object.create
const proto = { greet() { return 'Hello'; } };
const obj2 = Object.create(proto);
\`\`\`

## Accessing Properties

\`\`\`javascript
const person = { name: 'Alice', age: 25 };

// Dot notation (preferred)
console.log(person.name);

// Bracket notation (required for dynamic keys)
console.log(person['age']);

const key = 'name';
console.log(person[key]); // 'Alice'
\`\`\`

## Adding and Modifying

\`\`\`javascript
const person = { name: 'Alice' };
person.age = 25;        // Add property
person.name = 'Bob';    // Modify property
delete person.age;      // Remove property
\`\`\`

## Object Methods

\`\`\`javascript
const calculator = {
    add(a, b) { return a + b; },
    subtract(a, b) { return a - b; },
    multiply(a, b) { return a * b; }
};

console.log(calculator.add(3, 5)); // 8
\`\`\`

## Destructuring

\`\`\`javascript
const { name, age, city = 'Unknown' } = person;
// city defaults to 'Unknown' if not present

// Renaming
const { name: fullName } = person;

// Rest
const { name: n, ...rest } = person;
\`\`\`

## Spread and Rest

\`\`\`javascript
// Spread - merge objects
const defaults = { theme: 'light', lang: 'en' };
const userPrefs = { theme: 'dark' };
const config = { ...defaults, ...userPrefs };
// { theme: 'dark', lang: 'en' }

// Rest - gather remaining properties
const { theme, ...otherPrefs } = config;
\`\`\`

## Useful Object Methods

\`\`\`javascript
const person = { name: 'Alice', age: 25, city: 'NYC' };

Object.keys(person);    // ['name', 'age', 'city']
Object.values(person);  // ['Alice', 25, 'NYC']
Object.entries(person); // [['name', 'Alice'], ['age', 25], ...]
Object.assign({}, person); // Shallow copy
Object.freeze(person);  // Prevent modifications
\`\`\`

## Optional Chaining

\`\`\`javascript
const user = { address: { city: 'NYC' } };
const zip = user?.address?.zip;      // undefined (no error)
const street = user?.address?.street ?? 'N/A'; // 'N/A'
\`\`\`

## Shorthand Properties and Methods

\`\`\`javascript
const name = 'Alice';
const age = 25;

// Shorthand property
const person = { name, age }; // Same as { name: name, age: age }

// Shorthand method
const obj = {
    greet() { return 'Hello'; }  // Same as greet: function()
};
\`\`\``, `// Objects Demo

'use strict';

// Creating and accessing
const student = {
    name: 'Alice',
    age: 20,
    grades: [90, 85, 92],
    address: {
        city: 'New York',
        zip: '10001'
    },
    greet() {
        return \\\`Hi, I'm \\\${this.name} from \\\${this.address.city}\\\`;
    }
};

console.log('Student:', student.name);
console.log('Greeting:', student.greet());

// Destructuring with defaults
const { name, age, gpa = 'N/A' } = student;
console.log('\\nDestructured:', name, age, gpa);

// Spread to copy/merge
const defaults = { theme: 'light', fontSize: 14, lang: 'en' };
const userPrefs = { theme: 'dark', fontSize: 16 };
const settings = { ...defaults, ...userPrefs };
console.log('\\nMerged settings:', settings);

// Object methods
console.log('\\n--- Object Methods ---');
console.log('Keys:', Object.keys(student));
console.log('Values (name, age):', Object.values({ name, age }));

// Optional chaining
console.log('\\n--- Optional Chaining ---');
console.log('City:', student?.address?.city);
console.log('Zip:', student?.address?.zip);
console.log('Country:', student?.address?.country ?? 'Unknown');

// Working with entries
console.log('\\n--- Object.entries ---');
const scores = { math: 95, science: 88, english: 92 };
Object.entries(scores).forEach(([subject, score]) => {
    console.log(\`\${subject}: \${score}\`);
});`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 3, JSON.stringify({
    description: "Build a student management system that uses objects to store student data and array methods to filter, sort, and transform the data. Create functions to add students, find top performers, and calculate grade statistics.",
    hints: ["Use object destructuring to extract properties", "Chain filter().map().reduce() for statistics", "Use spread operator to merge student profiles"],
    starterCode: "// Student Management System\nconst students = [];\n\nfunction addStudent(name, grades) {\n    // Add a new student object to the array\n}\n\nfunction getTopStudents(minGrade) {\n    // Filter and return students above minGrade\n}\n\nfunction getAverageGrade(student) {\n    // Calculate average using reduce\n}"
  }));

  insertQuiz(db, 11, 'JS Arrays & Objects Quiz', 3);

  insertQuestion(db, 11, 'What does the map() method return?', JSON.stringify(['undefined', 'The original array', 'A new array with transformed elements', 'A single value']), 2, 'map() always returns a new array with the same length as the original, where each element has been passed through the callback function.');
  insertQuestion(db, 11, 'How do you copy an object without referencing the original?', JSON.stringify(['const copy = obj', 'const copy = { obj }', 'const copy = Object.assign({}, obj)', 'const copy = obj.clone()']), 2, 'Object.assign({}, obj) creates a shallow copy. You can also use the spread operator: const copy = { ...obj };');
  insertQuestion(db, 11, 'What does Object.keys() return?', JSON.stringify(['An array of values', 'An array of key-value pairs', 'An array of keys', 'An object']), 2, 'Object.keys() returns an array of an object own enumerable property names (keys).');

  // --- Topic: JS DOM ---
  insertTopic(db, 3, 'JS DOM', 4);

  insertLesson(db, 12, 'DOM Introduction', `## What is the DOM?

The **Document Object Model (DOM)** is a programming interface for HTML documents. It represents the page as a tree of nodes where each HTML element becomes a JavaScript object. Through the DOM, you can access, modify, add, or remove HTML elements and their content using JavaScript.

## The DOM Tree

Every HTML document is parsed into a tree structure:
- The \`<html>\` element is the root
- \`<head>\` and \`<body>\` are children of \`<html>\`
- Every element, attribute, and piece of text is a node

## Selecting Elements

### getElementById

\`\`\`javascript
const header = document.getElementById('main-header');
\`\`\`

### querySelector

Selects the **first** matching element using CSS selectors:

\`\`\`javascript
const card = document.querySelector('.card');
const firstInput = document.querySelector('form input[type="email"]');
\`\`\`

### querySelectorAll

Selects **all** matching elements (returns a NodeList):

\`\`\`javascript
const allCards = document.querySelectorAll('.card');
allCards.forEach(card => {
    console.log(card.textContent);
});
\`\`\`

### getElementsByTagName and getElementsByClassName

\`\`\`javascript
const paragraphs = document.getElementsByTagName('p');
const items = document.getElementsByClassName('list-item');
\`\`\`

## Traversing the DOM

\`\`\`javascript
const parent = document.querySelector('.parent');
const children = parent.children;        // Direct children (HTMLCollection)
const firstChild = parent.firstElementChild;
const lastChild = parent.lastElementChild;
const next = parent.nextElementSibling;
const prev = parent.previousElementSibling;
const parentNode = parent.parentElement;
\`\`\`

## Why querySelector is Preferred

\`querySelector\` and \`querySelectorAll\` use standard CSS selectors, making them more flexible and consistent. They return static NodeLists that support \`forEach\` directly, unlike the live HTMLCollections from older methods.

The DOM is the bridge between HTML and JavaScript — understanding it is essential for any web development task involving interactivity.`, `// DOM Introduction Demo

// Selecting elements
console.log('--- Selecting Elements ---');
const h1 = document.querySelector('h1');
console.log('H1 text:', h1?.textContent);

const allParagraphs = document.querySelectorAll('p');
console.log('Paragraph count:', allParagraphs.length);

const firstCard = document.querySelector('.card');
console.log('First card:', firstCard?.className);

// Traversing
console.log('\\n--- Traversal ---');
const body = document.body;
console.log('Body children count:', body.children.length);

const main = document.querySelector('main');
if (main) {
    console.log('Main first child:', main.firstElementChild?.tagName);
    console.log('Main parent:', main.parentElement?.tagName);
}

// Creating elements dynamically
console.log('\\n--- Creating Elements ---');
const newDiv = document.createElement('div');
newDiv.textContent = 'I was created with JavaScript!';
newDiv.className = 'dynamic-element';
newDiv.style.cssText = 'padding: 10px; background: #e8f5e9; border-radius: 4px; margin: 10px;';
document.body.appendChild(newDiv);

// Working with attributes
console.log('\\n--- Attributes ---');
const link = document.querySelector('a');
if (link) {
    console.log('href:', link.getAttribute('href'));
    link.setAttribute('target', '_blank');
    console.log('Has target:', link.hasAttribute('target'));
}`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 1, null);

  insertLesson(db, 12, 'DOM Manipulation', `## Changing Content

### textContent

Gets or sets the plain text content of an element:

\`\`\`javascript
const heading = document.querySelector('h1');
heading.textContent = 'New Title';
\`\`\`

### innerHTML

Gets or sets the HTML content (use cautiously — potential XSS vulnerability):

\`\`\`javascript
const container = document.querySelector('.container');
container.innerHTML = '<p>New paragraph</p>';
\`\`\`

### innerText

Similar to textContent but considers CSS visibility.

## Changing Styles

\`\`\`javascript
const box = document.querySelector('.box');

// Direct style manipulation
box.style.backgroundColor = '#ff9800';
box.style.color = 'white';
box.style.padding = '20px';
box.style.borderRadius = '8px';
\`\`\`

## classList

The most efficient way to add, remove, and toggle CSS classes:

\`\`\`javascript
const element = document.querySelector('.card');

element.classList.add('active');
element.classList.remove('hidden');
element.classList.toggle('visible');
element.classList.replace('old-class', 'new-class');
element.classList.contains('active'); // true
\`\`\`

## Changing Attributes

\`\`\`javascript
const img = document.querySelector('img');
img.setAttribute('src', 'new-image.jpg');
img.setAttribute('alt', 'New description');
img.removeAttribute('disabled');

// Dataset (data-* attributes)
const card = document.querySelector('[data-id]');
console.log(card.dataset.id); // Value of data-id attribute
\`\`\`

## Adding and Removing Elements

\`\`\`javascript
// Create element
const newParagraph = document.createElement('p');
newParagraph.textContent = 'I am new here!';
newParagraph.classList.add('highlight');

// Insert elements
container.appendChild(newParagraph);            // At the end
container.prepend(newParagraph);               // At the beginning
container.insertBefore(newParagraph, refNode); // Before reference

// Remove elements
element.remove();                               // Modern way
element.parentNode.removeChild(element);        // Legacy way
\`\`\`

## Clone Elements

\`\`\`javascript
const original = document.querySelector('.card');
const clone = original.cloneNode(true); // true = deep clone
container.appendChild(clone);
\`\`\`

## Document Fragment

For performance, build elements in a fragment first, then add them all at once:

\`\`\`javascript
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
    const li = document.createElement('li');
    li.textContent = \`Item \${i}\`;
    fragment.appendChild(li);
}
document.querySelector('ul').appendChild(fragment);
\`\`\``, `// DOM Manipulation Demo

// Style manipulation
console.log('--- Style Manipulation ---');
const demoBox = document.createElement('div');
demoBox.textContent = 'Styled Element';
demoBox.style.cssText = 'padding: 20px; background: #ff9800; color: white; border-radius: 8px; margin: 10px; display: inline-block;';
document.body.appendChild(demoBox);

// classList
console.log('\\n--- classList ---');
const card = document.createElement('div');
card.className = 'card';
card.classList.add('featured', 'active');
console.log('Has featured:', card.classList.contains('featured'));
card.classList.remove('active');
card.classList.toggle('visible');
console.log('Classes:', card.className);

// Adding elements
console.log('\\n--- Adding Elements ---');
const list = document.createElement('ul');
list.style.cssText = 'padding: 20px; background: #f5f5f5; border-radius: 8px;';

const fragment = document.createDocumentFragment();
const items = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'];

items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    li.style.cssText = 'padding: 5px 0; list-style-type: none;';
    fragment.appendChild(li);
});
list.appendChild(fragment);
document.body.appendChild(list);

// Working with data attributes
console.log('\\n--- Data Attributes ---');
const product = document.createElement('div');
product.setAttribute('data-product-id', '42');
product.setAttribute('data-category', 'electronics');
console.log('Product ID:', product.dataset.productId);
console.log('Category:', product.dataset.category);`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 2, null);

  insertLesson(db, 12, 'DOM Events', `## addEventListener

The standard way to attach event handlers:

\`\`\`javascript
const button = document.querySelector('#myButton');

button.addEventListener('click', function(event) {
    console.log('Button clicked!');
    console.log('Target:', event.target);
    console.log('Type:', event.type);
});
\`\`\`

## Common Events

| Event | Description |
|-------|-------------|
| \`click\` | Element clicked |
| \`dblclick\` | Element double-clicked |
| \`mousedown/up\` | Mouse button pressed/released |
| \`mouseenter/leave\` | Mouse enters/leaves element |
| \`mousemove\` | Mouse moves over element |
| \`keydown/up\` | Keyboard key pressed/released |
| \`submit\` | Form submitted |
| \`input\` | Input value changes |
| \`change\` | Input loses focus with changed value |
| \`focus/blur\` | Element gains/loses focus |
| \`load\` | Page or resource loaded |
| \`scroll\` | Element or page scrolled |

## The Event Object

\`\`\`javascript
button.addEventListener('click', (event) => {
    event.preventDefault();     // Prevent default behavior
    event.stopPropagation();    // Stop event bubbling
    console.log(event.target);  // The element that triggered the event
    console.log(event.type);    // 'click'
    console.log(event.timeStamp); // Timestamp
});
\`\`\`

## Event Delegation

Instead of adding listeners to every child, add one listener to the parent:

\`\`\`javascript
document.querySelector('ul').addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        console.log('Clicked:', event.target.textContent);
    }
});
\`\`\`

This is more efficient and works with dynamically added elements.

## Form Events

\`\`\`javascript
const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    console.log({ name, email });
});
\`\`\`

## Keyboard Events

\`\`\`javascript
document.addEventListener('keydown', (event) => {
    console.log('Key:', event.key);
    console.log('Code:', event.code);

    if (event.key === 'Enter') {
        console.log('Enter was pressed!');
    }

    // Modifier keys
    if (event.ctrlKey || event.metaKey) {
        console.log('Ctrl/Cmd held');
    }
});
\`\`\`

## Removing Event Listeners

\`\`\`javascript
function handleClick() {
    console.log('Clicked!');
}

button.addEventListener('click', handleClick);
button.removeEventListener('click', handleClick); // Must pass same function reference
\`\`\`

## Passive Event Listeners

\`\`\`javascript
// Tells the browser the handler will never call preventDefault()
// Improves scroll performance
document.addEventListener('scroll', () => {
    console.log('Scrolling...');
}, { passive: true });
\`\`\``, `// DOM Events Demo

// Click event
console.log('--- Events ---');

const clickBtn = document.createElement('button');
clickBtn.textContent = 'Click Me!';
clickBtn.style.cssText = 'padding: 12px 24px; background: #ff9800; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; margin: 10px;';

let clickCount = 0;
clickBtn.addEventListener('click', () => {
    clickCount++;
    clickBtn.textContent = \`Clicked \\\${clickCount} times\`;
});
document.body.appendChild(clickBtn);

// Keyboard event
console.log('\\n--- Keyboard Events ---');
const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Type something and press Enter...';
input.style.cssText = 'padding: 10px; border: 2px solid #ddd; border-radius: 4px; margin: 10px; width: 300px; display: block;';
document.body.appendChild(input);

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        console.log('Enter pressed! Value:', input.value);
        input.value = '';
    }
});

// Event delegation
console.log('\\n--- Event Delegation ---');
const todoList = document.createElement('ul');
todoList.style.cssText = 'list-style: none; padding: 10px; background: #f5f5f5; border-radius: 8px; margin: 10px; width: 300px;';

['Learn HTML', 'Learn CSS', 'Learn JavaScript'].forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    li.style.cssText = 'padding: 8px; cursor: pointer; border-bottom: 1px solid #ddd;';
    todoList.appendChild(li);
});

// One listener on parent handles all children
todoList.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        event.target.style.textDecoration = 'line-through';
        event.target.style.color = '#999';
    }
});
document.body.appendChild(todoList);

// Form event
console.log('\\n--- Form Event ---');
const form = document.createElement('form');
form.innerHTML = \`
    <input type="text" name="username" placeholder="Username" style="padding:8px; margin:5px;">
    <input type="email" name="email" placeholder="Email" style="padding:8px; margin:5px;">
    <button type="submit" style="padding:8px 16px; background:#ff9800; color:white; border:none; border-radius:4px; cursor:pointer;">Submit</button>
\`;
form.style.cssText = 'margin: 10px; padding: 15px; background: #f9f9f9; border-radius: 8px;';
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    console.log('Form data:', Object.fromEntries(data));
});
document.body.appendChild(form);`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 3, null);

  insertQuiz(db, 12, 'JS DOM Quiz', 4);

  insertQuestion(db, 12, 'Which method returns the first element matching a CSS selector?', JSON.stringify(['getElementById', 'querySelector', 'querySelectorAll', 'getElementsByClassName']), 1, 'querySelector returns the first element that matches the specified CSS selector, while querySelectorAll returns all matches.');
  insertQuestion(db, 12, 'What is event delegation?', JSON.stringify(['Removing all event listeners', 'Adding one listener on a parent to handle events from children', 'Using the onclick attribute', 'Attaching events after DOM load']), 1, 'Event delegation uses a single event listener on a parent element to handle events from its children, leveraging event bubbling.');
  insertQuestion(db, 12, 'Which property is safest for setting text content?', JSON.stringify(['innerHTML', 'innerText', 'textContent', 'outerHTML']), 2, 'textContent is the safest because it does not parse HTML, preventing XSS attacks. innerHTML should be avoided with user-provided content.');
  insertQuestion(db, 12, 'How do you add a CSS class to an element?', JSON.stringify(['element.style = "class-name"', 'element.classList.add("class-name")', 'element.addClass("class-name")', 'element.class = "class-name"']), 1, 'classList.add() is the standard DOM API for adding CSS classes. You can add multiple classes: classList.add("a", "b").');

  // ============================================================
  // 4. LEARN PYTHON
  // ============================================================
  insertCourse(db, 'Learn Python', 'python', 'Learn Python programming from basics to advanced concepts. Build real-world projects with one of the most popular programming languages.', 'terminal', '#3776ab', 4, 12, 'en');

  // --- Topic: Python Basics ---
  insertTopic(db, 4, 'Python Basics', 1);

  insertLesson(db, 13, 'Python Introduction', `## What is Python?

Python is a high-level, interpreted programming language known for its **clean syntax** and **readability**. It was created by Guido van Rossum and first released in 1991. Python is used in web development, data science, machine learning, automation, scientific computing, and more.

## Why Python?

- **Easy to learn** — Clean, English-like syntax
- **Versatile** — Web, data, AI, automation, desktop, scripting
- **Huge ecosystem** — Thousands of libraries and frameworks
- **High demand** — One of the most sought-after skills in tech
- **Cross-platform** — Runs on Windows, Mac, and Linux

## Installing Python

Download Python from python.org (version 3.10+ recommended). During installation, check **"Add Python to PATH"**.

## Your First Program

\`\`\`python
# This is a comment
print("Hello, World!")
\`\`\`

## Running Python

- **Interactive mode:** Type \`python\` in the terminal
- **Script mode:** Save to a \`.py\` file and run \`python filename.py\`
- **Jupyter Notebook:** Great for data science and experimentation

## Comments

\`\`\`python
# This is a single-line comment

"""
This is a multi-line comment
(also known as a docstring)
"""
\`\`\`

## The print() Function

\`\`\`python
print("Hello, World!")         # String
print(42)                      # Number
print("Name:", "Alice")       # Multiple values
print("Score:", 95, sep=", ")  # Custom separator
print("No newline", end=" ")   # Custom end character
\`\`\`

Python's simplicity makes it an excellent first language. The philosophy is captured in \`import this\` — "There should be one obvious way to do it."`, `# Python Introduction - hello.py

# Basic output
print("Hello, World!")
print("Welcome to LearnHub!")

# Printing different data types
print("Name:", "Alice")
print("Age:", 25)
print("Score:", 95.5)

# Multiple values with separator
print("Python", "is", "awesome", sep="-")

# End character customization
print("Loading", end="...")
print("Done!")

# Multi-line output
print("Line 1")
print("Line 2")
print("Line 3")

# Printing calculations
print("2 + 3 =", 2 + 3)
print("10 * 5 =", 10 * 5)`, 'https://www.youtube.com/embed/_uQrJ0TkZlc', 1, null);

  insertLesson(db, 13, 'Python Variables', `## Variable Assignment

In Python, you don't declare variable types — Python infers them automatically.

\`\`\`python
name = "Alice"      # str
age = 25            # int
height = 5.6        # float
is_active = True    # bool
\`\`\`

## Naming Rules

- Start with a letter or underscore (\`_\`)
- Can contain letters, numbers, and underscores
- **Case-sensitive** (\`Name\` and \`name\` are different)
- Use **snake_case** by convention (\`first_name\`, \`user_age\`)
- Cannot use reserved keywords (\`if\`, \`for\`, \`class\`, etc.)

## Multiple Assignment

\`\`\`python
# Simultaneous assignment
x, y, z = 1, 2, 3

# Same value to multiple variables
a = b = c = 0

# Unpacking
coordinates = (10, 20, 30)
x, y, z = coordinates
\`\`\`

## Getting User Input

\`\`\`python
name = input("Enter your name: ")
age = int(input("Enter your age: "))  # Convert to integer
price = float(input("Enter price: "))  # Convert to float
\`\`\`

## Type Conversion

\`\`\`python
# String to number
num = int("42")        # 42
decimal = float("3.14")  # 3.14

# Number to string
text = str(42)         # "42"

# Check type
print(type(name))      # <class 'str'>
\`\`\`

## f-strings (Formatted Strings)

\`\`\`python
name = "Alice"
age = 25
score = 95.678

# Basic interpolation
print(f"Hello, {name}!")

# Expressions
print(f"Next year you'll be {age + 1}")

# Formatting
print(f"Score: {score:.1f}")     # 95.7
print(f"Name: {name:>10}")      # Right-aligned
print(f"Number: {42:05d}")      # 00042
\`\`\`

f-strings are the modern, preferred way to format strings in Python. They are readable, fast, and support complex expressions inside the braces.`, `# Variables and Input - calculator.py

# Variable assignment
name = "Alice"
age = 25
height = 5.6
is_student = True

print("Name:", name)
print("Type of name:", type(name))
print("Age:", age)
print("Type of age:", type(age))

# Multiple assignment
x, y, z = 10, 20, 30
print(f"\\nCoordinates: ({x}, {y}, {z})")

# f-strings
print(f"\\n--- f-string Formatting ---")
print(f"Hello, {name}!")
print(f"You are {age} years old")
print(f"Next year you'll be {age + 1}")

score = 95.678
print(f"Score: {score:.1f}")
print(f"Name: {name:>10}")
print(f"Padded: {42:05d}")

# Type conversion
print(f"\\n--- Type Conversion ---")
num_str = "42"
num_int = int(num_str)
print(f"String '{num_str}' -> int {num_int}")

pi_str = "3.14"
pi_float = float(pi_str)
print(f"String '{pi_str}' -> float {pi_float}")

num_back = str(42)
print(f"int 42 -> string '{num_back}'")

# Type checking
print(f"\\nType of {name}: {type(name)}")
print(f"Type of {age}: {type(age)}")
print(f"Type of {height}: {type(height)}")
print(f"Type of {is_student}: {type(is_student)}")`, 'https://www.youtube.com/embed/_uQrJ0TkZlc', 2, null);

  insertLesson(db, 13, 'Python Data Types', `## Numeric Types

### int (Integer)
Whole numbers without decimals: \`-3\`, \`0\`, \`42\`, \`1_000_000\`

### float (Floating-Point)
Decimal numbers: \`3.14\`, \`-0.5\`, \`2.0\`

### complex
Numbers with imaginary parts: \`3+4j\`

\`\`\`python
x = 10         # int
y = 3.14       # float
z = 1_000_000  # int with underscore for readability

# Type conversions
print(int(3.9))     # 3 (truncates, does not round)
print(float(42))    # 42.0
print(bool(0))      # False
print(bool(1))      # True
\`\`\`

## Strings (str)

\`\`\`python
name = "Alice"
message = 'Hello, World!'

# Multi-line strings
poem = """
Roses are red,
Violets are blue,
Python is awesome,
And so are you.
"""

# String methods
text = "  Hello, World!  "
print(text.strip())         # "Hello, World!"
print(text.lower())         # "  hello, world!  "
print(text.upper())         # "  HELLO, WORLD!  "
print(text.replace("World", "Python"))  # "  Hello, Python!  "
print(text.split(","))      # ['  Hello', ' World!  ']
print("hello".title())      # "Hello"
print("hello".capitalize()) # "Hello"
\`\`\`

## Booleans (bool)

\`\`\`python
is_active = True
has_permission = False

# In boolean context
print(bool(0))       # False
print(bool(""))      # False
print(bool([]))      # False
print(bool(None))    # False
print(bool(42))      # True
print(bool("hello")) # True
\`\`\`

## Lists

\`\`\`python
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", True, 3.14]
nested = [[1, 2], [3, 4], [5, 6]]
\`\`\`

## Tuples

\`\`\`python
coordinates = (10, 20)
colors = ("red", "green", "blue")
# Tuples are IMMUTABLE - cannot be changed after creation
\`\`\`

## Dictionaries

\`\`\`python
person = {
    "name": "Alice",
    "age": 25,
    "city": "New York"
}
\`\`\`

## Sets

\`\`\`python
unique_numbers = {1, 2, 3, 4, 5}
# Sets are unordered and cannot contain duplicates
\`\`\`

## Type Checking

\`\`\`python
print(type(42))          # <class 'int'>
print(isinstance(42, int))  # True
\`\`\``, `# Data Types Demo

print("--- Numeric Types ---")
x = 42
y = 3.14
z = 1_000_000
print(f"int: {x} (type: {type(x).__name__})")
print(f"float: {y} (type: {type(y).__name__})")
print(f"Large: {z:,}")

print("\\n--- Strings ---")
text = "  Hello, Python!  "
print(f"Original: '{text}'")
print(f"Stripped: '{text.strip()}'")
print(f"Upper: '{text.strip().upper()}'")
print(f"Replace: '{text.strip().replace('Python', 'World')}'")
print(f"Split: {text.strip().split(',')}")

# String slicing
word = "Python"
print(f"\\nWord: {word}")
print(f"First 3: {word[:3]}")
print(f"Last 3: {word[-3:]}")
print(f"Reversed: {word[::-1]}")

print("\\n--- Booleans ---")
values = [0, 1, -1, "", "hello", [], [1], None, True, False]
for v in values:
    print(f"bool({str(v):>8}): {bool(v)}")

print("\\n--- Lists ---")
fruits = ["apple", "banana", "cherry"]
print(f"Fruits: {fruits}")
print(f"First: {fruits[0]}")
print(f"Last: {fruits[-1]}")
fruits.append("date")
print(f"After append: {fruits}")

print("\\n--- Dictionaries ---")
person = {"name": "Alice", "age": 25, "city": "NYC"}
print(f"Person: {person}")
print(f"Name: {person['name']}")
person["email"] = "alice@example.com"
print(f"With email: {person}")

print("\\n--- Tuples ---")
point = (3, 4)
print(f"Point: {point}")
x, y = point
print(f"Unpacked: x={x}, y={y}")

print("\\n--- Sets ---")
nums = {1, 2, 3, 2, 1}
print(f"Set (duplicates removed): {nums}")
nums.add(4)
print(f"After add(4): {nums}")`, 'https://www.youtube.com/embed/_uQrJ0TkZlc', 3, null);

  insertLesson(db, 13, 'Python Operators', `## Arithmetic Operators

\`\`\`python
print(10 + 3)    # 13  (addition)
print(10 - 3)    # 7   (subtraction)
print(10 * 3)    # 30  (multiplication)
print(10 / 3)    # 3.333... (true division)
print(10 // 3)   # 3   (floor division)
print(10 % 3)    # 1   (modulus/remainder)
print(10 ** 3)   # 1000 (exponentiation)
\`\`\`

## Comparison Operators

\`\`\`python
print(5 == 5)    # True
print(5 != 3)    # True
print(5 > 3)     # True
print(5 < 3)     # False
print(5 >= 5)    # True
print(5 <= 4)    # False
\`\`\`

## Logical Operators

\`\`\`python
print(True and False)  # False
print(True or False)   # True
print(not True)        # False

# Short-circuit evaluation
x = 10
result = x > 5 and x < 20  # True
\`\`\`

## Membership Operators

\`\`\`python
fruits = ["apple", "banana", "cherry"]
print("apple" in fruits)       # True
print("grape" not in fruits)   # True

text = "Hello, World!"
print("World" in text)          # True
\`\`\`

## Identity Operators

\`\`\`python
a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b)   # True  (same value)
print(a is b)   # False (different objects)
print(a is c)   # True  (same object)

# Use 'is' with None
x = None
print(x is None)  # True
\`\`\`

## Bitwise Operators

\`\`\`python
print(5 & 3)   # 1  (AND)
print(5 | 3)   # 7  (OR)
print(5 ^ 3)   # 6  (XOR)
print(5 << 1)  # 10 (Left shift)
print(5 >> 1)  # 2  (Right shift)
\`\`\`

## Assignment Operators

\`\`\`python
x = 10
x += 5    # x = x + 5  (15)
x -= 3    # x = x - 3  (12)
x *= 2    # x = x * 2  (24)
x //= 5   # x = x // 5 (4)
x **= 3   # x = x ** 3 (64)
\`\`\`

## Operator Precedence

Python follows standard mathematical precedence:
1. Parentheses \`()\`
2. Exponentiation \`**\`
3. Unary \`+\`, \`-\`
4. Multiplication, Division, Floor Division, Modulus
5. Addition, Subtraction
6. Comparison operators
7. Not, And, Or`, `# Operators Demo

print("--- Arithmetic ---")
print(f"10 + 3 = {10 + 3}")
print(f"10 - 3 = {10 - 3}")
print(f"10 * 3 = {10 * 3}")
print(f"10 / 3 = {10 / 3:.2f}")
print(f"10 // 3 = {10 // 3}")
print(f"10 % 3 = {10 % 3}")
print(f"10 ** 3 = {10 ** 3}")

print("\\n--- Comparison ---")
print(f"5 == 5: {5 == 5}")
print(f"5 != 3: {5 != 3}")
print(f"5 > 3: {5 > 3}")
print(f"'hello' == 'Hello': {'hello' == 'Hello'}")

print("\\n--- Logical ---")
x = 15
print(f"x = {x}")
print(f"x > 10 and x < 20: {x > 10 and x < 20}")
print(f"x < 5 or x > 10: {x < 5 or x > 10}")
print(f"not (x > 10): {not (x > 10)}")

print("\\n--- Membership ---")
fruits = ["apple", "banana", "cherry"]
print(f"'banana' in fruits: {'banana' in fruits}")
print(f"'grape' not in fruits: {'grape' not in fruits}")
print(f"'Py' in 'Python': {'Py' in 'Python'}")

print("\\n--- Identity ---")
a = [1, 2, 3]
b = [1, 2, 3]
c = a
print(f"a == b: {a == b}")
print(f"a is b: {a is b}")
print(f"a is c: {a is c}")

x = None
print(f"x is None: {x is None}")

print("\\n--- Floor Division & Modulus ---")
print(f"17 // 5 = {17 // 5} (quotient)")
print(f"17 % 5 = {17 % 5} (remainder)")
print(f"17 / 5 = {17 / 5} (true division)")`, 'https://www.youtube.com/embed/_uQrJ0TkZlc', 4, null);

  insertQuiz(db, 13, 'Python Basics Quiz', 1);

  insertQuestion(db, 13, 'Which function is used to get user input in Python?', JSON.stringify(['input()', 'get_input()', 'read()', 'scan()']), 0, 'The input() function displays a prompt and reads a line of text from the user. It always returns a string.');
  insertQuestion(db, 13, 'What does f"Hello, {name}!" create?', JSON.stringify(['A regular string', 'A formatted string literal (f-string)', 'A function call', 'A regex pattern']), 1, 'f-strings (formatted string literals) allow you to embed expressions inside curly braces within a string prefixed with f.');
  insertQuestion(db, 13, 'What is the output of: 10 // 3?', JSON.stringify(['3.333', '3', '4', '3.0']), 1, 'Floor division (//) returns the largest integer less than or equal to the result. 10 // 3 = 3.');
  insertQuestion(db, 13, 'Which operator checks if two variables reference the same object?', JSON.stringify(['==', 'is', 'in', 'equals()']), 1, 'The "is" operator checks identity (same object in memory), while "==" checks equality (same value).');

  // --- Topic: Python Control Flow ---
  insertTopic(db, 4, 'Python Control Flow', 2);

  insertLesson(db, 14, 'Python Conditionals', `## if/elif/else

\`\`\`python
temperature = 25

if temperature > 30:
    print("It is hot!")
elif temperature > 20:
    print("It is nice!")
elif temperature > 10:
    print("It is cool!")
else:
    print("It is cold!")
\`\`\`

## Nested Conditionals

\`\`\`python
age = 25
has_id = True

if age >= 18:
    if has_id:
        print("Entry allowed")
    else:
        print("Need ID")
else:
    print("Too young")
\`\`\`

## match-case (Python 3.10+)

Python's pattern matching, similar to switch/case in other languages:

\`\`\`python
status = 404

match status:
    case 200:
        print("OK")
    case 301:
        print("Redirect")
    case 404:
        print("Not Found")
    case 500:
        print("Server Error")
    case _:
        print("Unknown status")
\`\`\`

## Conditional Expressions (Ternary)

\`\`\`python
age = 20
can_vote = "Yes" if age >= 18 else "No"
print(can_vote)  # "Yes"
\`\`\`

## Truthy and Falsy Values

\`\`\`python
# Falsy values:
# False, 0, 0.0, "", [], (), {}, set(), None

# Truthy values:
# Everything else

if []:
    print("truthy")
else:
    print("falsy")  # This prints
\`\`\`

## Chained Comparisons

\`\`\`python
x = 5
if 1 < x < 10:
    print("x is between 1 and 10")

# Equivalent to:
if 1 < x and x < 10:
    print("x is between 1 and 10")
\`\`\`

## The ternary with match-case

match-case supports **guards** for additional conditions:

\`\`\`python
point = (3, 4)

match point:
    case (0, 0):
        print("Origin")
    case (x, 0):
        print(f"On x-axis at {x}")
    case (0, y):
        print(f"On y-axis at {y}")
    case (x, y) if x == y:
        print(f"On diagonal at ({x}, {y})")
    case (x, y):
        print(f"Point at ({x}, {y})")
\`\`\``, `# Python Conditionals Demo

temperature = 25

if temperature > 30:
    print("It is hot!")
elif temperature > 20:
    print("It is nice!")
elif temperature > 10:
    print("It is cool!")
else:
    print("It is cold!")

# Nested conditionals
age = 25
has_id = True

if age >= 18:
    if has_id:
        print("Entry allowed")
    else:
        print("Need ID")
else:
    print("Too young")

# Ternary
can_vote = "Yes" if age >= 18 else "No"
print(can_vote)

# Chained comparisons
x = 5
if 1 < x < 10:
    print("x is between 1 and 10")`, 'https://www.youtube.com/embed/_uQrJ0TkZlc', 1, null);

  insertLesson(db, 14, 'Python Loops', `## for Loop

\`\`\`python
# Iterate over a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# Iterate over a range
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# Range with start, stop, step
for i in range(1, 10, 2):
    print(i)  # 1, 3, 5, 7, 9
\`\`\`

## while Loop

\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\`

## break and continue

\`\`\`python
# break - exits the loop
for i in range(10):
    if i == 5:
        break
    print(i)  # 0, 1, 2, 3, 4

# continue - skips to next iteration
for i in range(10):
    if i % 2 == 0:
        continue
    print(i)  # 1, 3, 5, 7, 9
\`\`\`

## enumerate()

\`\`\`python
fruits = ["apple", "banana", "cherry"]
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")
\`\`\`

## zip()

\`\`\`python
names = ["Alice", "Bob", "Charlie"]
scores = [95, 87, 92]
for name, score in zip(names, scores):
    print(f"{name}: {score}")
\`\`\`

## List Comprehensions

\`\`\`python
# Basic
squares = [x**2 for x in range(10)]

# With condition
evens = [x for x in range(20) if x % 2 == 0]

# Nested
pairs = [(x, y) for x in range(3) for y in range(3)]

# Dictionary comprehension
word_lengths = {word: len(word) for word in ["hello", "world"]}

# Set comprehension
unique_lengths = {len(word) for word in ["hello", "world", "hi"]}
\`\`\`

## for...else

Python allows an \`else\` clause on loops — it runs only if the loop completes without \`break\`:

\`\`\`python
for i in range(10):
    if i == 15:
        break
else:
    print("15 not found in range")  # This prints
\`\`\``, `# Python Loops Demo

fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

for i in range(5):
    print(i)

count = 0
while count < 5:
    print(count)
    count += 1

for i in range(10):
    if i == 5:
        break
    print(i)

squares = [x**2 for x in range(10)]
print(squares)`, 'https://www.youtube.com/embed/_uQrJ0TkZlc', 2, null);

  insertLesson(db, 14, 'Python Functions', `## Defining Functions

\`\`\`python
def greet(name):
    """Greet a person by name."""  # Docstring
    return f"Hello, {name}!"
\`\`\`

## Default Parameters

\`\`\`python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Alice"))           # "Hello, Alice!"
print(greet("Bob", "Hi"))      # "Hi, Bob!"
\`\`\`

## *args and **kwargs

\`\`\`python
def sum_all(*args):
    """Accept any number of positional arguments."""
    return sum(args)

print(sum_all(1, 2, 3, 4, 5))  # 15

def print_info(**kwargs):
    """Accept any number of keyword arguments."""
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=25, city="NYC")
\`\`\`

## Lambda Functions

\`\`\`python
# Anonymous one-line functions
square = lambda x: x ** 2
add = lambda a, b: a + b

print(square(5))   # 25
print(add(3, 4))   # 7

# Useful with higher-order functions
students = [("Alice", 92), ("Bob", 85), ("Charlie", 95)]
sorted_students = sorted(students, key=lambda s: s[1], reverse=True)
\`\`\`

## Scope (LEGB Rule)

Python looks up variables in this order:
1. **Local** — Inside the function
2. **Enclosing** — In the enclosing function (closures)
3. **Global** — At module level
4. **Built-in** — Python built-in names

\`\`\`python
x = "global"

def outer():
    x = "enclosing"
    
    def inner():
        x = "local"
        print(x)  # "local"
    
    inner()
    print(x)      # "enclosing"

outer()
print(x)          # "global"
\`\`\`

## Higher-Order Functions

\`\`\`python
# Functions that take or return other functions
def apply(func, value):
    return func(value)

result = apply(lambda x: x * 2, 5)  # 10
\`\`\`

## Decorators

\`\`\`python
import time

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"Time: {time.time() - start:.4f}s")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
\`\`\` `, `def greet(name):
    return f"Hello, {name}!"

def add(a, b=0):
    return a + b

print(greet("Alice"))
print(add(5, 3))
print(add(10))`, 'https://www.youtube.com/embed/_uQrJ0TkZlc', 3, null);

  insertQuiz(db, 14, 'Python Control Flow Quiz', 2);

  insertQuestion(db, 14, 'What does the enumerate() function return?', JSON.stringify(['A list of values', 'A list of (index, value) tuples', 'A dictionary', 'A set']), 1, 'enumerate() returns an iterator of tuples containing (index, value) pairs, starting from 0 by default.');
  insertQuestion(db, 14, 'What is the output of: [x**2 for x in range(5)]?', JSON.stringify(['[1, 4, 9, 16, 25]', '[0, 1, 4, 9, 16]', '[0, 2, 4, 6, 8]', 'Error']), 1, 'range(5) produces 0,1,2,3,4. Squaring each gives 0,1,4,9,16.');
  insertQuestion(db, 14, 'What does **kwargs allow a function to accept?', JSON.stringify(['A list of arguments', 'Any number of keyword arguments', 'Only string arguments', 'Exactly two arguments']), 1, '**kwargs allows a function to accept an arbitrary number of keyword arguments as a dictionary.');

  // --- Topic: Python Data Structures ---
  insertTopic(db, 4, 'Python Data Structures', 3);

  insertLesson(db, 15, 'Python Lists', `## Creating Lists

\`\`\`python
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", True, 3.14]
nested = [[1, 2], [3, 4], [5, 6]]
empty = []
\`\`\`

## Accessing Elements

\`\`\`python
fruits = ["apple", "banana", "cherry"]
print(fruits[0])    # "apple" (first)
print(fruits[-1])   # "cherry" (last)
print(fruits[1:3])  # ["banana", "cherry"] (slicing)
print(fruits[::2])  # ["apple", "cherry"] (every other)
\`\`\`

## Modifying Lists

\`\`\`python
fruits = ["apple", "banana", "cherry"]

# Append - add to end
fruits.append("date")

# Insert - add at specific index
fruits.insert(1, "avocado")

# Extend - add multiple elements
fruits.extend(["elderberry", "fig"])

# Remove by value
fruits.remove("banana")

# Remove by index
popped = fruits.pop()       # Removes and returns last
popped = fruits.pop(0)     # Removes and returns first

# Delete by index
del fruits[0]

# Clear entire list
fruits.clear()
\`\`\`

## Sorting

\`\`\`python
numbers = [3, 1, 4, 1, 5, 9, 2, 6]

# Sort in place
numbers.sort()
print(numbers)  # [1, 1, 2, 3, 4, 5, 6, 9]

# Sort in reverse
numbers.sort(reverse=True)

# Return new sorted list (original unchanged)
new_list = sorted(numbers)
\`\`\`

## List Operations

\`\`\`python
a = [1, 2, 3]
b = [4, 5, 6]

# Concatenation
c = a + b          # [1, 2, 3, 4, 5, 6]

# Repetition
d = a * 3          # [1, 2, 3, 1, 2, 3, 1, 2, 3]

# Length
print(len(a))      # 3

# Membership
print(2 in a)      # True

# Min/Max/Sum
print(min(a))      # 1
print(max(a))      # 3
print(sum(a))      # 6
\`\`\`

## List Comprehensions

\`\`\`python
# Basic syntax: [expression for item in iterable]
squares = [x**2 for x in range(10)]

# With condition
evens = [x for x in range(20) if x % 2 == 0]

# Nested
matrix = [[i*3+j+1 for j in range(3)] for i in range(3)]
# [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

# With function call
words = ["hello", "world"]
upper_words = [w.upper() for w in words]
\`\`\`

## Copying Lists

\`\`\`python
original = [1, 2, 3]

# These create SHALLOW copies:
copy1 = original.copy()
copy2 = original[:]
copy3 = list(original)

# This creates a REFERENCE (not a copy!):
same = original  # Changes to same affect original
\`\`\` `, `fruits = ["apple", "banana", "cherry"]
fruits.append("date")
print(fruits[0])
print(fruits[-1])
print(fruits[1:3])
print(len(fruits))`, 'https://www.youtube.com/embed/_uQrJ0TkZlc', 1, null);

  insertLesson(db, 15, 'Python Dictionaries', `## Creating Dictionaries

\`\`\`python
person = {
    "name": "Alice",
    "age": 25,
    "city": "New York"
}

# From list of tuples
data = dict([("a", 1), ("b", 2)])

# Using dict constructor
d = dict(name="Alice", age=25)

# Empty dict
empty = {}
\`\`\`

## Accessing Values

\`\`\`python
person = {"name": "Alice", "age": 25}

# Bracket notation (raises KeyError if missing)
print(person["name"])

# get() with default (returns default if missing)
print(person.get("email", "N/A"))
\`\`\`

## Modifying Dictionaries

\`\`\`python
person = {"name": "Alice"}

# Add/update
person["age"] = 25
person["city"] = "NYC"

# Update multiple keys
person.update({"email": "alice@example.com", "phone": "555-1234"})

# Remove
del person["phone"]
popped = person.pop("email")     # Remove and return
removed = person.pop("missing", None)  # Safe remove
\`\`\`

## Dictionary Methods

\`\`\`python
person = {"name": "Alice", "age": 25, "city": "NYC"}

person.keys()      # dict_keys(['name', 'age', 'city'])
person.values()    # dict_values(['Alice', 25, 'NYC'])
person.items()     # dict_items([('name', 'Alice'), ('age', 25), ...])

person.copy()      # Shallow copy
person.clear()     # Empty the dictionary
\`\`\`

## Iterating Dictionaries

\`\`\`python
person = {"name": "Alice", "age": 25}

# Iterate keys
for key in person:
    print(key, person[key])

# Iterate key-value pairs
for key, value in person.items():
    print(f"{key}: {value}")
\`\`\`

## Dictionary Comprehensions

\`\`\`python
# Create from two lists
names = ["Alice", "Bob", "Charlie"]
scores = [95, 87, 92]
grade_book = {name: score for name, score in zip(names, scores)}

# Filter
passing = {k: v for k, v in grade_book.items() if v >= 90}
\`\`\`

## Nested Dictionaries

\`\`\`python
students = {
    "alice": {"grade": 92, "age": 20},
    "bob": {"grade": 87, "age": 22},
    "charlie": {"grade": 95, "age": 21}
}

print(students["alice"]["grade"])  # 92
\`\`\`

## Defaultdict and Counter

\`\`\`python
from collections import defaultdict, Counter

# defaultdict - auto-creates missing keys
word_count = defaultdict(int)
for word in ["hello", "world", "hello"]:
    word_count[word] += 1

# Counter - count occurrences
counts = Counter(["apple", "banana", "apple", "cherry", "apple"])
print(counts["apple"])  # 3
\`\`\` `, `person = {"name": "Alice", "age": 25}
print(person["name"])
person["city"] = "NYC"
for key, value in person.items():
    print(f"{key}: {value}")`, 'https://www.youtube.com/embed/_uQrJ0TkZlc', 2, null);

  insertLesson(db, 15, 'Python Tuples & Sets', `## Tuples

Tuples are **immutable** ordered sequences. Once created, they cannot be changed.

\`\`\`python
# Creating tuples
point = (3, 4)
colors = ("red", "green", "blue")
single = (42,)      # Note: single-element tuple needs trailing comma
not_tuple = (42)    # This is just the number 42!

# Accessing
print(colors[0])     # "red"
print(colors[-1])    # "blue"
print(colors[1:3])   # ("green", "blue")

# Unpacking
x, y = point
first, *middle, last = (1, 2, 3, 4, 5)
\`\`\`

### When to Use Tuples

- **Fixed data** — Coordinates, RGB colors, database records
- **Dictionary keys** — Tuples can be dict keys (lists cannot)
- **Return multiple values** — \`return x, y\` returns a tuple
- **Unpacking** — \`a, b, c = some_tuple\`

## Sets

Sets are **unordered** collections of **unique** elements. They support mathematical set operations.

\`\`\`python
# Creating sets
fruits = {"apple", "banana", "cherry"}
numbers = set([1, 2, 3, 2, 1])  # {1, 2, 3}
empty_set = set()   # NOT {} which creates a dict!

# Adding and removing
fruits.add("date")
fruits.remove("banana")     # Raises KeyError if missing
fruits.discard("missing")   # Safe remove (no error)

# Set operations
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print(a | b)   # Union:        {1, 2, 3, 4, 5, 6}
print(a & b)   # Intersection: {3, 4}
print(a - b)   # Difference:   {1, 2}
print(a ^ b)   # Symmetric:    {1, 2, 5, 6}
\`\`\`

### Comparisons

\`\`\`python
a = {1, 2, 3}
b = {1, 2, 3, 4, 5}

print(a.issubset(b))     # True  (a is subset of b)
print(b.issuperset(a))   # True  (b is superset of a)
print(a.isdisjoint({7})) # True  (no common elements)
\`\`\`

### Set Comprehensions

\`\`\`python
# Remove duplicates from list
words = ["hello", "world", "hello", "hi", "world"]
unique_lengths = {len(word) for word in words}  # {5, 2}

# Filter unique
unique_words = {word.lower() for word in words}
\`\`\`

## When to Use Each

| Structure | Ordered | Mutable | Duplicates | Use Case |
|-----------|---------|---------|------------|----------|
| **List** | Yes | Yes | Yes | Collections of similar items |
| **Tuple** | Yes | No | Yes | Fixed data, dict keys |
| **Set** | No | Yes | No | Unique values, set operations |`, `my_tuple = (1, 2, 3)\nmy_set = {1, 2, 3, 2}\nprint(my_tuple)\nprint(my_set)\nprint(2 in my_set)`, 'https://www.youtube.com/embed/_uQrJ0TkZlc', 3, null);

  insertQuiz(db, 15, 'Python Data Structures Quiz', 3);

  insertQuestion(db, 15, 'What is the difference between a list and a tuple?', JSON.stringify(['Lists are faster', 'Lists are mutable, tuples are immutable', 'Tuples can contain duplicates, lists cannot', 'There is no difference']), 1, 'Lists are mutable (can be changed after creation), while tuples are immutable (cannot be changed). Tuples are also slightly faster and can be used as dictionary keys.');
  insertQuestion(db, 15, 'What does set({1,2,3}) & set({2,3,4}) return?', JSON.stringify(['{1, 4}', '{2, 3}', '{1, 2, 3, 4}', '{1, 2, 3, 4, 5}']), 1, 'The & operator returns the intersection — elements that exist in both sets. Both 2 and 3 appear in both sets.');
  insertQuestion(db, 15, 'How do you create an empty set (not a dict)?', JSON.stringify(['{}', 'set()', '[]', '()']), 1, 'set() creates an empty set. {} creates an empty dictionary. This is a common gotcha in Python.');

  // --- Topic: Python File & Modules ---
  insertTopic(db, 4, 'Python File & Modules', 4);

  insertLesson(db, 16, 'File Handling', `## Opening Files

\`\`\`python
# Basic syntax
file = open("data.txt", "r")
content = file.read()
file.close()
\`\`\`

## The with Statement (Recommended)

The \`with\` statement automatically closes the file, even if an error occurs:

\`\`\`python
with open("data.txt", "r") as file:
    content = file.read()
    print(content)
# File is automatically closed here
\`\`\`

## File Modes

| Mode | Description |
|------|-------------|
| \`"r"\` | Read (default) |
| \`"w"\` | Write (creates new or truncates existing) |
| \`"a"\` | Append (creates new or appends to existing) |
| \`"x"\` | Create (fails if file exists) |
| \`"b"\` | Binary mode (add to other modes: \`"rb"\`, \`"wb"\`) |
| \`"t"\` | Text mode (default, add to other modes: \`"rt"\`) |
| \`"+"\` | Read and write (add to other modes: \`"r+"\`, \`"w+"\`) |

## Reading Files

\`\`\`python
# Read entire file
with open("data.txt", "r") as file:
    content = file.read()

# Read line by line
with open("data.txt", "r") as file:
    for line in file:
        print(line.strip())  # strip() removes trailing newline

# Read all lines into a list
with open("data.txt", "r") as file:
    lines = file.readlines()
    for line in lines:
        print(line.strip())
\`\`\`

## Writing Files

\`\`\`python
# Write (creates new or overwrites)
with open("output.txt", "w") as file:
    file.write("Hello, World!\\n")
    file.write("Second line\\n")

# Append to existing file
with open("output.txt", "a") as file:
    file.write("Third line\\n")

# Write multiple lines
lines = ["Line 1\\n", "Line 2\\n", "Line 3\\n"]
with open("output.txt", "w") as file:
    file.writelines(lines)
\`\`\`

## Working with CSV

\`\`\`python
import csv

# Reading CSV
with open("data.csv", "r") as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)

# Writing CSV
with open("output.csv", "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["Name", "Age", "City"])
    writer.writerow(["Alice", 25, "NYC"])
\`\`\`

## JSON Files

\`\`\`python
import json

# Writing JSON
data = {"name": "Alice", "age": 25}
with open("data.json", "w") as file:
    json.dump(data, file, indent=2)

# Reading JSON
with open("data.json", "r") as file:
    data = json.load(file)
    print(data["name"])
\`\`\`

## Handling File Errors

\`\`\`python
try:
    with open("nonexistent.txt", "r") as file:
        content = file.read()
except FileNotFoundError:
    print("File not found!")
except PermissionError:
    print("No permission to read file!")
except IOError as e:
    print(f"IO error: {e}")
\`\`\` `, `with open("example.txt", "w") as f:
    f.write("Hello, World!")

with open("example.txt", "r") as f:
    content = f.read()
    print(content)`, 'https://www.youtube.com/embed/_uQrJ0TkZlc', 1, null);

  insertLesson(db, 16, 'Python Modules', `## Importing Modules

\`\`\`python
# Import entire module
import math
print(math.pi)

# Import specific items
from math import sqrt, pow
print(sqrt(16))

# Import with alias
import numpy as np
from datetime import datetime as dt

# Import all (avoid this)
from math import *
\`\`\`

## Common Built-in Modules

### math

\`\`\`python
import math
math.pi          # 3.141592653589793
math.e           # 2.718281828459045
math.sqrt(16)    # 4.0
math.ceil(3.2)   # 4
math.floor(3.8)  # 3
math.factorial(5) # 120
\`\`\`

### random

\`\`\`python
import random
random.random()           # Random float 0-1
random.randint(1, 10)    # Random int 1-10
random.choice(["a","b"]) # Random element
random.shuffle([1,2,3])  # Shuffle in place
random.sample(range(100), 5)  # 5 unique random numbers
\`\`\`

### datetime

\`\`\`python
from datetime import datetime, date, timedelta

now = datetime.now()
print(now.strftime("%Y-%m-%d %H:%M:%S"))

today = date.today()
tomorrow = today + timedelta(days=1)

# Parse string to date
birthday = datetime.strptime("1990-05-15", "%Y-%m-%d")
\`\`\`

### os

\`\`\`python
import os
os.getcwd()                    # Current directory
os.listdir(".")               # List files in directory
os.path.exists("file.txt")   # Check if file exists
os.makedirs("new_folder", exist_ok=True)  # Create directory
os.environ.get("HOME")       # Environment variable
\`\`\`

## Creating Your Own Modules

\`\`\`python
# mymodule.py
def greet(name):
    return f"Hello, {name}!"

PI = 3.14159

# main.py
from mymodule import greet, PI
print(greet("Alice"))
\`\`\`

## Packages

A package is a directory with an \`__init__.py\` file:

\`\`\`python
# mypackage/
#     __init__.py
#     module1.py
#     module2.py

from mypackage import module1
from mypackage.module2 import some_function
\`\`\`

## pip (Package Manager)

\`\`\`bash
pip install requests
pip install flask==2.0
pip uninstall old-package
pip list
pip freeze > requirements.txt
pip install -r requirements.txt
\`\`\` `, `import math
from datetime import datetime
print(math.pi)
print(datetime.now())`, 'https://www.youtube.com/embed/_uQrJ0TkZlc', 2, null);

  insertQuiz(db, 16, 'Python File & Modules Quiz', 4);

  insertQuestion(db, 16, 'Why is the with statement recommended for file handling?', JSON.stringify(['It is faster', 'It automatically closes the file', 'It creates backups', 'It encrypts the file']), 1, 'The with statement ensures the file is properly closed after the block executes, even if an exception occurs, preventing resource leaks.');
  insertQuestion(db, 16, 'What file mode creates a new file or fails if it already exists?', JSON.stringify(['"w"', '"a"', '"x"', '"r"']), 2, 'Mode "x" is exclusive creation — it creates a new file but raises a FileExistsError if the file already exists.');
  insertQuestion(db, 16, 'How do you import a specific function from a module?', JSON.stringify(['import module.function', 'from module import function', 'require module.function', 'include module.function']), 1, 'Use "from module import function" to import specific items. You can also alias: from math import sqrt as square_root.');

  // ============================================================
  // 5. LEARN SQL
  // ============================================================
  insertCourse(db, 'Learn SQL', 'sql', 'Master SQL database queries from basics to advanced. Learn to retrieve, insert, update, and manage data with confidence.', 'database', '#336791', 5, 10, 'en');

  // --- Topic: SQL Basics ---
  insertTopic(db, 5, 'SQL Basics', 1);

  insertLesson(db, 17, 'SQL Introduction', `## What is SQL?

SQL (Structured Query Language) is the standard language for managing and querying **relational databases**. Every major database system — MySQL, PostgreSQL, SQLite, SQL Server, Oracle — uses SQL as its core language.

## Key Concepts

### Databases and Tables

A **database** is a collection of organized data. A **table** is a collection of related data organized in rows and columns:

\`\`\`sql
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    age INT,
    enrollment_date DATE
);
\`\`\`

### Data Types

| Type | Description |
|------|-------------|
| \`INT\` | Whole numbers |
| \`VARCHAR(n)\` | Variable-length string (max n chars) |
| \`TEXT\` | Long text |
| \`DECIMAL(p,s)\` | Precise decimal numbers |
| \`DATE\` | Date (YYYY-MM-DD) |
| \`DATETIME\` | Date and time |
| \`BOOLEAN\` | True/False |
| \`FLOAT\` | Floating-point numbers |

## CRUD Operations

SQL operations follow the **CRUD** pattern:
- **C**reate — \`INSERT INTO\`
- **R**ead — \`SELECT\`
- **U**pdate — \`UPDATE ... SET\`
- **D**elete — \`DELETE FROM\`

## Basic SELECT

\`\`\`sql
-- Select all columns
SELECT * FROM students;

-- Select specific columns
SELECT name, email FROM students;

-- Select with alias
SELECT name AS student_name, age AS student_age FROM students;
\`\`\`

## INSERT

\`\`\`sql
-- Insert single row
INSERT INTO students (name, email, age, enrollment_date)
VALUES ('Alice', 'alice@email.com', 25, '2024-01-15');

-- Insert multiple rows
INSERT INTO students (name, email, age) VALUES
    ('Bob', 'bob@email.com', 22),
    ('Charlie', 'charlie@email.com', 28);
\`\`\`

## UPDATE

\`\`\`sql
UPDATE students
SET age = 26, email = 'alice_new@email.com'
WHERE id = 1;
\`\`\`

## DELETE

\`\`\`sql
DELETE FROM students WHERE id = 1;

-- Delete all rows (be careful!)
DELETE FROM students;
\`\`\`

## SQL Case Sensitivity

SQL keywords are case-insensitive (\`SELECT\` = \`select\`), but data values are usually case-sensitive. Convention is to write keywords in UPPERCASE for readability.`, `-- Creating a database and table
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    age INTEGER,
    grade VARCHAR(1),
    enrollment_date DATE
);

-- Insert sample data
INSERT INTO students (name, email, age, grade, enrollment_date) VALUES
    ('Alice Johnson', 'alice@email.com', 20, 'A', '2024-01-15'),
    ('Bob Smith', 'bob@email.com', 22, 'B', '2024-02-20'),
    ('Charlie Brown', 'charlie@email.com', 21, 'A', '2024-01-20'),
    ('Diana Ross', 'diana@email.com', 23, 'C', '2024-03-10'),
    ('Eve Wilson', 'eve@email.com', 19, 'B', '2024-02-28');

-- SELECT queries
SELECT * FROM students;

SELECT name, grade FROM students;

-- SELECT with WHERE
SELECT * FROM students WHERE grade = 'A';

SELECT * FROM students WHERE age >= 21;

-- UPDATE
UPDATE students SET grade = 'A-' WHERE name = 'Bob Smith';

-- DELETE
-- DELETE FROM students WHERE id = 5;`, `SELECT * FROM students;
SELECT name, age FROM students WHERE age > 20;
SELECT DISTINCT department FROM employees;`, 'https://www.youtube.com/embed/_uQrJ0TkZlc', 1, null);

  insertLesson(db, 17, 'SQL SELECT', `## SELECT with WHERE

\`\`\`sql
SELECT * FROM students WHERE age > 20;
SELECT * FROM students WHERE grade = 'A';
SELECT * FROM students WHERE name LIKE 'A%';  -- Starts with A
\`\`\`

## Comparison Operators

| Operator | Description |
|----------|-------------|
| \`=\` | Equal to |
| \`!=\` or \`<>\` | Not equal to |
| \`>\` | Greater than |
| \`<\` | Less than |
| \`>=\` | Greater than or equal |
| \`<=\` | Less than or equal |

## AND / OR

\`\`\`sql
SELECT * FROM students
WHERE age > 20 AND grade = 'A';

SELECT * FROM students
WHERE grade = 'A' OR grade = 'B';
\`\`\`

## LIKE Pattern Matching

\`\`\`sql
-- % matches any sequence of characters
SELECT * FROM students WHERE name LIKE 'A%';    -- Starts with A
SELECT * FROM students WHERE name LIKE '%son';  -- Ends with son
SELECT * FROM students WHERE name LIKE '%oh%';  -- Contains oh

-- _ matches a single character
SELECT * FROM students WHERE name LIKE '_ob';   -- 3 chars, ends with ob
\`\`\`

## IN and BETWEEN

\`\`\`sql
-- IN - match any value in a list
SELECT * FROM students WHERE grade IN ('A', 'B');

-- BETWEEN - match a range (inclusive)
SELECT * FROM students WHERE age BETWEEN 20 AND 25;

-- NOT BETWEEN
SELECT * FROM students WHERE age NOT BETWEEN 20 AND 25;
\`\`\`

## IS NULL / IS NOT NULL

\`\`\`sql
SELECT * FROM students WHERE email IS NULL;
SELECT * FROM students WHERE email IS NOT NULL;
\`\`\`

## ORDER BY

\`\`\`sql
SELECT * FROM students ORDER BY name ASC;      -- A-Z
SELECT * FROM students ORDER BY age DESC;      -- Z-A
SELECT * FROM students ORDER BY grade, name;   -- Multiple columns
\`\`\`

## LIMIT and OFFSET

\`\`\`sql
SELECT * FROM students LIMIT 3;          -- First 3 rows
SELECT * FROM students LIMIT 3 OFFSET 2; -- Skip 2, then 3 rows
SELECT * FROM students ORDER BY age DESC LIMIT 1; -- Oldest student
\`\`\`

## Aliases

\`\`\`sql
SELECT name AS student_name,
       age AS student_age
FROM students s
WHERE s.age > 20;
\`\`\` `, `SELECT name, age FROM students WHERE grade = 'A';
SELECT * FROM students ORDER BY age DESC;
SELECT * FROM students LIMIT 10 OFFSET 5;`, 'https://www.youtube.com/embed/_uQrJ0TkZlc', 2, null);

  insertLesson(db, 17, 'SQL INSERT UPDATE DELETE', `## INSERT INTO

\`\`\`sql
-- Insert with all columns
INSERT INTO students VALUES (6, 'Frank', 'frank@email.com', 24, 'B', '2024-04-01');

-- Insert with specified columns (recommended)
INSERT INTO students (name, email, age) VALUES
    ('Grace', 'grace@email.com', 20),
    ('Hank', 'hank@email.com', 26);

-- Insert from another table
INSERT INTO backup_students
SELECT * FROM students WHERE grade = 'A';
\`\`\`

## UPDATE

\`\`\`sql
-- Update single column
UPDATE students SET grade = 'A' WHERE name = 'Bob Smith';

-- Update multiple columns
UPDATE students
SET age = 26, email = 'alice_updated@email.com'
WHERE id = 1;

-- Update with condition
UPDATE students
SET grade = 'A'
WHERE age > 20 AND grade = 'B';

-- Update all rows (use with caution!)
UPDATE students SET enrollment_date = '2024-01-01';
\`\`\`

## DELETE

\`\`\`sql
-- Delete specific rows
DELETE FROM students WHERE id = 1;

-- Delete with condition
DELETE FROM students WHERE grade = 'C' AND age > 22;

-- Delete all rows
DELETE FROM students;

-- Delete with subquery
DELETE FROM students
WHERE id IN (SELECT id FROM inactive_students);
\`\`\`

## UPSERT (INSERT or UPDATE)

\`\`\`sql
-- SQLite
INSERT INTO students (name, email, age)
VALUES ('Alice', 'alice@email.com', 25)
ON CONFLICT(email)
DO UPDATE SET age = 25;

-- MySQL
INSERT INTO students (name, email, age)
VALUES ('Alice', 'alice@email.com', 25)
ON DUPLICATE KEY UPDATE age = 25;

-- PostgreSQL
INSERT INTO students (name, email, age)
VALUES ('Alice', 'alice@email.com', 25)
ON CONFLICT (email)
DO UPDATE SET age = EXCLUDED.age;
\`\`\`

## Transactions

\`\`\`sql
BEGIN TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- If everything is OK:
COMMIT;

-- If something went wrong:
-- ROLLBACK;
\`\`\`

## Best Practices

- **Always use WHERE** in UPDATE and DELETE to avoid modifying all rows
- **Back up data** before bulk operations
- **Use transactions** for multi-step operations
- **Test with SELECT first** to verify which rows will be affected`, `-- INSERT examples
INSERT INTO students (name, email, age, grade, enrollment_date) VALUES
    ('Frank Miller', 'frank@email.com', 24, 'B', '2024-04-01'),
    ('Grace Lee', 'grace@email.com', 20, 'A', '2024-03-15'),
    ('Hank Brown', 'hank@email.com', 26, 'C', '2024-02-10');

-- Verify insert
SELECT * FROM students ORDER BY id;

-- UPDATE examples
UPDATE students SET grade = 'A-' WHERE name = 'Bob Smith';
UPDATE students SET age = age + 1 WHERE name = 'Charlie Brown';

-- Verify update
SELECT name, age, grade FROM students;

-- DELETE examples
-- DELETE FROM students WHERE grade = 'C';
-- DELETE FROM students WHERE id = 7;

-- Always preview with SELECT first!
SELECT * FROM students WHERE grade = 'C';`, `INSERT INTO students (name, age, grade) VALUES ('Alice', 20, 'A');
UPDATE students SET grade = 'B' WHERE name = 'Alice';
DELETE FROM students WHERE id = 5;`, 'https://www.youtube.com/embed/_uQrJ0TkZlc', 3, null);

  insertQuiz(db, 17, 'SQL Basics Quiz', 1);

  insertQuestion(db, 17, 'Which SQL statement is used to retrieve data from a database?', JSON.stringify(['GET', 'SELECT', 'FETCH', 'RETRIEVE']), 1, 'SELECT is the SQL statement used to query and retrieve data from database tables.');
  insertQuestion(db, 17, 'What does the WHERE clause do?', JSON.stringify(['Sorts results', 'Filters rows based on conditions', 'Groups results', 'Deletes rows']), 1, 'The WHERE clause filters rows, returning only those that match the specified condition.');
  insertQuestion(db, 17, 'Which operator is used for pattern matching in SQL?', JSON.stringify(['MATCH', 'LIKE', 'FIND', 'SEARCH']), 1, 'LIKE is used with % (any sequence) and _ (single character) wildcards for pattern matching.');
  insertQuestion(db, 17, 'What happens if you run DELETE FROM students without a WHERE clause?', JSON.stringify(['Nothing', 'It deletes the table', 'It deletes all rows', 'It throws an error']), 2, 'DELETE without WHERE removes ALL rows from the table. Always use WHERE to target specific rows.');

  // --- Topic: SQL Intermediate ---
  insertTopic(db, 5, 'SQL Intermediate', 2);

  insertLesson(db, 18, 'SQL JOINs', `## What are JOINs?

JOINs combine rows from two or more tables based on a related column between them. They are one of the most powerful features of relational databases.

## INNER JOIN

Returns only rows that have matching values in **both** tables:

\`\`\`sql
SELECT students.name, enrollments.course_name
FROM students
INNER JOIN enrollments ON students.id = enrollments.student_id;
\`\`\`

## LEFT JOIN (LEFT OUTER JOIN)

Returns **all rows from the left table** and matching rows from the right. Non-matching right rows show NULL:

\`\`\`sql
SELECT students.name, enrollments.course_name
FROM students
LEFT JOIN enrollments ON students.id = enrollments.student_id;
\`\`\`

## RIGHT JOIN (RIGHT OUTER JOIN)

Returns **all rows from the right table** and matching rows from the left:

\`\`\`sql
SELECT students.name, enrollments.course_name
FROM students
RIGHT JOIN enrollments ON students.id = enrollments.student_id;
\`\`\`

## FULL OUTER JOIN

Returns **all rows from both tables**. Non-matching rows from either side show NULL:

\`\`\`sql
SELECT students.name, enrollments.course_name
FROM students
FULL OUTER JOIN enrollments ON students.id = enrollments.student_id;
\`\`\`

## Self JOIN

Join a table with itself:

\`\`\`sql
SELECT a.name AS employee, b.name AS manager
FROM employees a
INNER JOIN employees b ON a.manager_id = b.id;
\`\`\`

## Multiple JOINs

\`\`\`sql
SELECT s.name, c.course_name, t.teacher_name
FROM students s
INNER JOIN enrollments e ON s.id = e.student_id
INNER JOIN courses c ON e.course_id = c.id
INNER JOIN teachers t ON c.teacher_id = t.id;
\`\`\`

## Natural JOIN

Automatically joins on columns with the same name:

\`\`\`sql
SELECT * FROM students
NATURAL JOIN enrollments;
\`\`\`

## Cross JOIN

Returns the Cartesian product (every combination of rows):

\`\`\`sql
SELECT * FROM colors
CROSS JOIN sizes;
-- If colors has 5 rows and sizes has 3, result has 15 rows
\`\`\`

## JOIN Tips

- Always specify the join condition with \`ON\` (avoid natural joins in production)
- Use table aliases for readability when joining multiple tables
- Consider performance: indexes on join columns speed up queries significantly`, `SELECT s.name, e.department FROM students s INNER JOIN enrollments e ON s.id = e.student_id;
SELECT * FROM students LEFT JOIN enrollments ON students.id = enrollments.student_id;`, 'https://www.youtube.com/embed/_uQrJ0TkZlc', 1, null);

  insertLesson(db, 18, 'SQL Aggregates', `## Aggregate Functions

Aggregate functions perform calculations on a set of rows and return a single value.

### COUNT

\`\`\`sql
SELECT COUNT(*) FROM students;                    -- Total rows
SELECT COUNT(DISTINCT grade) FROM students;       -- Unique grades
SELECT COUNT(*) AS total FROM students WHERE age > 20;
\`\`\`

### SUM

\`\`\`sql
SELECT SUM(salary) FROM employees;
SELECT SUM(amount) FROM orders WHERE year = 2024;
\`\`\`

### AVG

\`\`\`sql
SELECT AVG(age) FROM students;
SELECT AVG(salary) AS avg_salary FROM employees WHERE dept = 'Engineering';
\`\`\`

### MIN / MAX

\`\`\`sql
SELECT MIN(age), MAX(age) FROM students;
SELECT MIN(salary), MAX(salary) FROM employees;
\`\`\`

## GROUP BY

Groups rows that have the same values in specified columns:

\`\`\`sql
-- Count students per grade
SELECT grade, COUNT(*) AS student_count
FROM students
GROUP BY grade;

-- Average age per department
SELECT department, AVG(age) AS avg_age
FROM employees
GROUP BY department;
\`\`\`

## HAVING

Filters groups (like WHERE, but for grouped data):

\`\`\`sql
-- Grades with more than 2 students
SELECT grade, COUNT(*) AS count
FROM students
GROUP BY grade
HAVING COUNT(*) > 2;

-- Departments with average salary above 70k
SELECT department, AVG(salary) AS avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > 70000;
\`\`\`

## WHERE vs HAVING

| Feature | WHERE | HAVING |
|---------|-------|--------|
| Filters | Individual rows | Groups |
| Used with | Before GROUP BY | After GROUP BY |
| Aggregate functions | Cannot use | Can use |

## Multiple Aggregate Functions

\`\`\`sql
SELECT
    grade,
    COUNT(*) AS total,
    AVG(age) AS avg_age,
    MIN(age) AS youngest,
    MAX(age) AS oldest
FROM students
GROUP BY grade
ORDER BY total DESC;
\`\`\`

## ROLLUP and CUBE

\`\`\`sql
-- ROLLUP adds subtotal rows
SELECT department, SUM(salary)
FROM employees
GROUP BY ROLLUP(department);
\`\`\` `, `SELECT department, COUNT(*) as count FROM employees GROUP BY department;
SELECT grade, AVG(score) FROM students GROUP BY grade HAVING AVG(score) > 80;`, 'https://www.youtube.com/embed/_uQrJ0TkZlc', 2, null);

  insertLesson(db, 18, 'SQL Subqueries', `## What is a Subquery?

A subquery (inner query) is a SELECT statement nested inside another SQL statement. It can appear in WHERE, FROM, or SELECT clauses.

## Subquery in WHERE

\`\`\`sql
-- Students older than the average age
SELECT name, age
FROM students
WHERE age > (SELECT AVG(age) FROM students);

-- Students enrolled in any course
SELECT name FROM students
WHERE id IN (SELECT student_id FROM enrollments);

-- Students with the highest grade
SELECT name FROM students
WHERE grade = (SELECT MAX(grade) FROM students);
\`\`\`

## Subquery in FROM

\`\`\`sql
-- Use a subquery as a derived table
SELECT dept, avg_salary
FROM (
    SELECT department AS dept, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department
) AS dept_averages
WHERE avg_salary > 70000;
\`\`\`

## Subquery in SELECT

\`\`\`sql
SELECT
    name,
    age,
    (SELECT AVG(age) FROM students) AS overall_avg,
    age - (SELECT AVG(age) FROM students) AS diff_from_avg
FROM students;
\`\`\`

## EXISTS

Checks if a subquery returns any rows (faster than IN for large datasets):

\`\`\`sql
SELECT name FROM students s
WHERE EXISTS (
    SELECT 1 FROM enrollments e
    WHERE e.student_id = s.id
);
\`\`\`

## Correlated Subqueries

References the outer query — runs once for each row:

\`\`\`sql
SELECT name, age
FROM students s1
WHERE age > (
    SELECT AVG(age)
    FROM students s2
    WHERE s2.grade = s1.grade  -- References outer query
);
\`\`\`

## Subquery vs JOIN

- **Subquery:** When you need to compare against a single value or check existence
- **JOIN:** When you need to combine columns from multiple tables in the result

## ANY / ALL

\`\`\`sql
-- ANY: true if condition matches any row
SELECT name FROM students
WHERE age > ANY (SELECT age FROM students WHERE grade = 'A');

-- ALL: true if condition matches all rows
SELECT name FROM students
WHERE age > ALL (SELECT age FROM students WHERE grade = 'C');
\`\`\` `, `SELECT name FROM students WHERE age > (SELECT AVG(age) FROM students);
SELECT * FROM students WHERE id IN (SELECT student_id FROM enrollments);`, 'https://www.youtube.com/embed/_uQrJ0TkZlc', 3, null);

  insertQuiz(db, 18, 'SQL Intermediate Quiz', 2);

  insertQuestion(db, 18, 'Which JOIN returns all rows from both tables?', JSON.stringify(['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN']), 3, 'FULL OUTER JOIN returns all rows from both tables, with NULL values where there is no match on either side.');
  insertQuestion(db, 18, 'What is the difference between WHERE and HAVING?', JSON.stringify(['WHERE filters rows, HAVING filters groups', 'WHERE is for INSERT, HAVING is for SELECT', 'There is no difference', 'HAVING is faster']), 0, 'WHERE filters individual rows before grouping, while HAVING filters groups after GROUP BY is applied.');
  insertQuestion(db, 18, 'Which aggregate function counts unique values?', JSON.stringify(['COUNT(*)', 'COUNT(column)', 'COUNT(DISTINCT column)', 'COUNT(ALL column)']), 2, 'COUNT(DISTINCT column) counts only unique non-NULL values in the specified column.');

  // --- Topic: SQL Advanced ---
  insertTopic(db, 5, 'SQL Advanced', 3);

  insertLesson(db, 19, 'SQL Indexes & Performance', `## What are Indexes?

An index is a data structure that improves the speed of data retrieval operations on a table. Think of it like a book's index — instead of reading every page, you look up the topic and go directly to the right page.

## Creating Indexes

\`\`\`sql
-- Single column index
CREATE INDEX idx_student_email ON students(email);

-- Composite index (multiple columns)
CREATE INDEX idx_student_name_grade ON students(name, grade);

-- Unique index (enforces uniqueness)
CREATE UNIQUE INDEX idx_student_email ON students(email);
\`\`\`

## When to Create Indexes

Create indexes on columns that are:
- Frequently used in \`WHERE\` clauses
- Used in \`JOIN\` conditions
- Used in \`ORDER BY\` or \`GROUP BY\`
- High-cardinality columns (many unique values)

## When NOT to Create Indexes

Avoid indexes on:
- Small tables (the overhead isn't worth it)
- Columns with low cardinality (e.g., boolean, gender)
- Columns that are frequently updated (each update must also update the index)
- Tables with heavy write operations

## Query Performance

\`\`\`sql
-- EXPLAIN shows the query execution plan
EXPLAIN SELECT * FROM students WHERE email = 'alice@email.com';

-- EXPLAIN ANALYZE shows actual execution details
EXPLAIN ANALYZE SELECT * FROM students WHERE grade = 'A';
\`\`\`

## Index Types

| Type | Description |
|------|-------------|
| **B-Tree** | Default. Good for equality and range queries |
| **Hash** | Fast equality lookups only |
| **GIN** | For arrays, full-text search, JSONB |
| **GiST** | For geometric and geographic data |

## Composite Index Order

The order of columns in a composite index matters:

\`\`\`sql
-- Good for: WHERE name = 'Alice' AND grade = 'A'
CREATE INDEX idx_name_grade ON students(name, grade);

-- Also works for: WHERE name = 'Alice' (uses first column)
-- Does NOT work well for: WHERE grade = 'A' (skips first column)
\`\`\`

## Optimizing Queries

- **Select only needed columns** — Avoid \`SELECT *\` in production
- **Use appropriate indexes** — Check with EXPLAIN
- **Avoid functions on indexed columns** — \`WHERE YEAR(date) = 2024\` won't use an index on \`date\`
- **Use LIMIT** when you don't need all results
- **Avoid leading wildcards** — \`LIKE '%value'\` can't use indexes effectively
- **Join on indexed columns** — Always index foreign keys`, `CREATE INDEX idx_name ON students(name);
SELECT * FROM students WHERE name = 'Alice';
EXPLAIN SELECT * FROM students WHERE name = 'Alice';`, 'https://www.youtube.com/embed/_uQrJ0TkZlc', 1, null);

  insertLesson(db, 19, 'SQL Views & Procedures', `## Views

A view is a virtual table based on a SELECT statement. It does not store data — it stores the query and executes it when accessed.

### Creating Views

\`\`\`sql
CREATE VIEW student_summary AS
SELECT
    s.name,
    s.grade,
    COUNT(e.course_id) AS courses_enrolled,
    AVG(e.score) AS avg_score
FROM students s
LEFT JOIN enrollments e ON s.id = e.student_id
GROUP BY s.id, s.name, s.grade;

-- Use the view like a table
SELECT * FROM student_summary WHERE grade = 'A';

-- Update or replace a view
CREATE OR REPLACE VIEW student_summary AS
SELECT
    s.name,
    s.grade,
    COUNT(e.course_id) AS courses_enrolled
FROM students s
LEFT JOIN enrollments e ON s.id = e.student_id
GROUP BY s.id, s.name, s.grade;
\`\`\`

### Drop View

\`\`\`sql
DROP VIEW IF EXISTS student_summary;
\`\`\`

## Stored Procedures

Stored procedures are precompiled SQL code stored in the database:

\`\`\`sql
-- MySQL syntax
DELIMITER //
CREATE PROCEDURE GetStudentsByGrade(IN grade_param VARCHAR(1))
BEGIN
    SELECT name, email, age
    FROM students
    WHERE grade = grade_param
    ORDER BY name;
END //
DELIMITER ;

-- Call the procedure
CALL GetStudentsByGrade('A');
\`\`\`

## Transactions

A transaction is a sequence of operations performed as a single logical unit. Either ALL operations succeed, or NONE of them do (ACID properties).

\`\`\`sql
BEGIN TRANSACTION;

-- Transfer $100 from Account A to B
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- Check if both updates succeeded
-- If yes:
COMMIT;

-- If anything went wrong:
ROLLBACK;
\`\`\`

### Transaction Properties (ACID)

| Property | Description |
|----------|-------------|
| **Atomicity** | All or nothing — operations complete or roll back entirely |
| **Consistency** | Database moves from one valid state to another |
| **Isolation** | Concurrent transactions don't interfere with each other |
| **Durability** | Committed changes are permanent (survive system failures) |

## Indexes and Performance

Views with complex joins can be slow. Use **materialized views** (PostgreSQL) or index the underlying tables for better performance.`, `CREATE VIEW student_grades AS SELECT name, grade FROM students;
SELECT * FROM student_grades WHERE grade = 'A';`, 'https://www.youtube.com/embed/_uQrJ0TkZlc', 2, null);

  insertLesson(db, 19, 'SQL Design & Normalization', `## What is Normalization?

Normalization is the process of organizing a database to reduce data redundancy and improve data integrity. The goal is to ensure that each piece of data is stored in only one place.

## Normal Forms

### First Normal Form (1NF)

Each cell contains a single value (no lists, no repeating groups):

| BAD (violates 1NF) | GOOD (follows 1NF) |
|---------------------|-------------------|
| Courses: "HTML, CSS" | One row per course |

\`\`\`sql
-- Bad: Multiple values in one column
CREATE TABLE students_bad (
    name VARCHAR(100),
    courses TEXT  -- "HTML, CSS, JavaScript"
);

-- Good: Separate table for courses
CREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE enrollments (
    student_id INT,
    course_name VARCHAR(100),
    FOREIGN KEY (student_id) REFERENCES students(id)
);
\`\`\`

### Second Normal Form (2NF)

Must be in 1NF AND every non-key column must depend on the **entire** primary key (relevant for composite keys).

### Third Normal Form (3NF)

Must be in 2NF AND no non-key column should depend on another non-key column (no transitive dependencies).

## Primary Keys

\`\`\`sql
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);
\`\`\`

## Foreign Keys

\`\`\`sql
CREATE TABLE enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);
\`\`\`

## Cascade Options

| Option | Behavior |
|--------|----------|
| \`CASCADE\` | Delete/UPDATE dependent rows |
| \`SET NULL\` | Set foreign key to NULL |
| \`SET DEFAULT\` | Set foreign key to default value |
| \`RESTRICT\` | Prevent delete/UPDATE if dependent rows exist |

## Best Practices

- Always define primary keys on every table
- Use meaningful, auto-incrementing integers for primary keys
- Add foreign key constraints to enforce referential integrity
- Index foreign key columns for JOIN performance
- Follow 3NF for most use cases (consider denormalization only for read-heavy analytics)`,
    `-- Creating normalized tables
CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    order_no INTEGER DEFAULT 0,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic_id INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    content TEXT,
    code TEXT,
    order_no INTEGER DEFAULT 0,
    FOREIGN KEY (topic_id) REFERENCES topics(id)
);

-- Insert sample data
INSERT INTO courses (title, slug, price) VALUES
    ('Learn HTML', 'html', 0),
    ('Learn CSS', 'css', 9),
    ('Learn JavaScript', 'javascript', 15);

INSERT INTO topics (course_id, title, order_no) VALUES
    (1, 'HTML Basics', 1),
    (1, 'HTML Text', 2),
    (2, 'CSS Basics', 1);

INSERT INTO lessons (topic_id, title, content, order_no) VALUES
    (1, 'HTML Introduction', 'Learn what HTML is and how to create your first page.', 1),
    (1, 'HTML Elements', 'Master headings, paragraphs, and other HTML elements.', 2);

-- Query with JOIN
SELECT c.title AS course, t.title AS topic, l.title AS lesson
FROM lessons l
JOIN topics t ON l.topic_id = t.id
JOIN courses c ON t.course_id = c.id
ORDER BY c.id, t.order_no, l.order_no;`, `CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE
);`, 'https://www.youtube.com/embed/_uQrJ0TkZlc', 3, null);

  insertQuiz(db, 19, 'SQL Advanced Quiz', 3);

  insertQuestion(db, 19, 'What is the purpose of a database index?', JSON.stringify(['To store data', 'To speed up data retrieval', 'To encrypt data', 'To create backups']), 1, 'Indexes improve query performance by creating a data structure that allows the database to find rows without scanning the entire table.');
  insertQuestion(db, 19, 'What does 3NF (Third Normal Form) eliminate?', JSON.stringify(['Primary keys', 'Repeating groups', 'Transitive dependencies', 'Foreign keys']), 2, '3NF eliminates transitive dependencies — where a non-key column depends on another non-key column rather than directly on the primary key.');
  insertQuestion(db, 19, 'What does ON DELETE CASCADE do?', JSON.stringify(['Prevents deletion', 'Deletes the parent row', 'Automatically deletes dependent child rows', 'Sets foreign key to NULL']), 2, 'ON DELETE CASCADE automatically deletes all rows in the child table that reference the deleted parent row.');

  // ============================================================
  // 6. LEARN REACT
  // ============================================================
  insertCourse(db, 'Learn React', 'react', 'Build modern, interactive user interfaces with React. Master components, hooks, state management, and performance optimization.', 'braces', '#61dafb', 6, 18, 'en');

  // --- Topic: React Basics ---
  insertTopic(db, 6, 'React Basics', 1);

  insertLesson(db, 20, 'React Introduction', `## What is React?

React is a **JavaScript library** for building user interfaces, created by Meta (Facebook). It allows you to build complex UIs from small, reusable pieces called **components**. React uses a virtual DOM for efficient updates and follows a declarative programming model.

## Why React?

- **Component-based** — Build encapsulated components that manage their own state
- **Declarative** — Describe what the UI should look like, React handles the DOM updates
- **Virtual DOM** — Efficiently updates only what changed (not the entire page)
- **Large ecosystem** — Massive community, thousands of libraries and tools
- **High demand** — One of the most sought-after skills in web development

## Setting Up React

### Using Vite (Recommended)

\`\`\`bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
\`\`\`

### Using create-react-app (Legacy)

\`\`\`bash
npx create-react-app my-app
cd my-app
npm start
\`\`\`

## Project Structure

\`\`\`
my-app/
  src/
    App.jsx        # Main application component
    main.jsx       # Entry point
    App.css        # Styles
  index.html       # Root HTML file
  package.json     # Dependencies and scripts
\`\`\`

## Your First Component

\`\`\`jsx
// App.jsx
function App() {
    return (
        <div>
            <h1>Hello, React!</h1>
            <p>Welcome to your first React application.</p>
        </div>
    );
}

export default App;
\`\`\`

## What is JSX?

JSX (JavaScript XML) is a syntax extension that lets you write HTML-like code inside JavaScript. Under the hood, JSX compiles to \`React.createElement()\` calls.

\`\`\`jsx
// JSX (what you write)
const element = <h1>Hello, World!</h1>;

// Equivalent JavaScript (what Babel compiles it to)
const element = React.createElement('h1', null, 'Hello, World!');
\`\`\`

**JSX Rules:**
- Must return a single root element (use \`<Fragment>\` or \`<>\` for multiple)
- All tags must be closed (\`<img />\`, \`<br />\`)
- Class becomes \`className\`
- Style accepts an object, not a string
- JavaScript expressions go inside curly braces \`{ }\``, `import React from 'react';
function App() {
  return <h1>Hello, React!</h1>;
}
export default App;`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 1, null);

  insertLesson(db, 20, 'React Components', `## Functional Components

Functional components are the modern way to write React components. They are JavaScript functions that return JSX:

\`\`\`jsx
function Welcome() {
    return <h1>Welcome to React!</h1>;
}

// Arrow function syntax
const Welcome = () => {
    return <h1>Welcome to React!</h1>;
};

// Implicit return (no curly braces needed for single expression)
const Welcome = () => <h1>Welcome to React!</h1>;
\`\`\`

## Props

Props (properties) are how you pass data from parent to child components:

\`\`\`jsx
function Greeting({ name, age }) {
    return (
        <div>
            <h2>Hello, {name}!</h2>
            <p>You are {age} years old.</p>
        </div>
    );
}

// Using the component
function App() {
    return (
        <div>
            <Greeting name="Alice" age={25} />
            <Greeting name="Bob" age={30} />
        </div>
    );
}
\`\`\`

## Props with Children

The \`children\` prop contains anything between the opening and closing tags:

\`\`\`jsx
function Card({ title, children }) {
    return (
        <div className="card">
            <h2>{title}</h2>
            {children}
        </div>
    );
}

// Usage
<Card title="My Card">
    <p>This is the card content.</p>
    <button>Click me</button>
</Card>
\`\`\`

## Component Composition

Combine small components to build complex UIs:

\`\`\`jsx
function App() {
    return (
        <Layout>
            <Header />
            <Main>
                <Article />
                <Sidebar />
            </Main>
            <Footer />
        </Layout>
    );
}
\`\`\`

## Props Validation (PropTypes)

\`\`\`jsx
import PropTypes from 'prop-types';

function UserCard({ name, age, isOnline }) {
    return (
        <div>
            <h3>{name}</h3>
            <p>Age: {age}</p>
            <p>Status: {isOnline ? 'Online' : 'Offline'}</p>
        </div>
    );
}

UserCard.propTypes = {
    name: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    isOnline: PropTypes.bool
};

UserCard.defaultProps = {
    isOnline: false
};
\`\`\`

## Best Practices

- **Name components with PascalCase** (\`UserProfile\`, not \`userProfile\`)
- **Keep components small and focused** — one responsibility per component
- **Extract reusable UI into components** — don't repeat yourself
- **Props are read-only** — never modify props inside a child component`, `// App.jsx - React Basics Demo

function Header() {
    return (
        <header style={{ background: '#61dafb', color: 'white', padding: '20px', textAlign: 'center' }}>
            <h1>React Basics Demo</h1>
        </header>
    );
}

function Greeting({ name, age }) {
    return (
        <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', margin: '10px' }}>
            <h3>Hello, {name}!</h3>
            <p>You are {age} years old.</p>
        </div>
    );
}

function Card({ title, children }) {
    return (
        <div style={{ border: '2px solid #61dafb', borderRadius: '12px', padding: '20px', margin: '10px' }}>
            <h2 style={{ color: '#61dafb', marginTop: 0 }}>{title}</h2>
            {children}
        </div>
    );
}

function App() {
    return (
        <div>
            <Header />
            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
                <Card title="Student Profiles">
                    <Greeting name="Alice" age={25} />
                    <Greeting name="Bob" age={30} />
                    <Greeting name="Charlie" age={22} />
                </Card>

                <Card title="About React">
                    <p>React is a JavaScript library for building user interfaces.</p>
                    <p>It uses components to create reusable UI pieces.</p>
                </Card>
            </main>
        </div>
    );
}

export default App;`, `function Greeting({ name }) {
  return <h2>Hello, {name}!</h2>;
}
function App() {
  return <Greeting name="Alice" />;
}`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 2, null);

  insertLesson(db, 20, 'JSX Deep Dive', `## Expressions in JSX

You can embed any JavaScript expression inside curly braces:

\`\`\`jsx
function App() {
    const name = "Alice";
    const items = ["apple", "banana", "cherry"];

    return (
        <div>
            <h1>Hello, {name}!</h1>
            <p>2 + 2 = {2 + 2}</p>
            <p>Today is {new Date().toLocaleDateString()}</p>
        </div>
    );
}
\`\`\`

## Fragments

Use fragments to group multiple elements without adding extra DOM nodes:

\`\`\`jsx
// Fragment syntax
function App() {
    return (
        <>
            <h1>Title</h1>
            <p>Paragraph</p>
        </>
    );
}
\`\`\`

## Conditional Rendering

\`\`\`jsx
function App() {
    const isLoggedIn = true;
    const items = [];

    return (
        <div>
            {/* Ternary operator */}
            {isLoggedIn ? <p>Welcome back!</p> : <p>Please log in.</p>}

            {/* Logical AND */}
            {isLoggedIn && <p>Dashboard content</p>}

            {/* Early return */}
            {items.length === 0 && <p>No items found.</p>}

            {/* Variable assignment */}
            {(() => {
                if (isLoggedIn) return <p>Logged in</p>;
                return <p>Not logged in</p>;
            })()}
        </div>
    );
}
\`\`\`

## Rendering Lists

\`\`\`jsx
function App() {
    const fruits = ['apple', 'banana', 'cherry'];

    return (
        <ul>
            {fruits.map((fruit, index) => (
                <li key={index}>{fruit}</li>
            ))}
        </ul>
    );
}
\`\`\`

### Keys

Keys help React identify which items have changed, been added, or removed. Always use a **stable, unique ID** — never use array indices as keys if the list can be reordered.

\`\`\`jsx
function UserList({ users }) {
    return (
        <ul>
            {users.map(user => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
}
\`\`\`

## Inline Styles

React accepts style as a JavaScript object (camelCase properties):

\`\`\`jsx
<div style={{ color: 'blue', fontSize: '18px', padding: '10px' }}>
    Styled content
</div>
\`\`\`

## className

Use \`className\` instead of \`class\`:

\`\`\`jsx
<div className="container active">Content</div>
\`\`\` `, `const element = <h1 className="title">Hello</h1>;
const items = [1, 2, 3].map(i => <li key={i}>{i}</li>);
const jsx = <div>{true && <span>Visible</span>}</div>;`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 3, null);

  insertQuiz(db, 20, 'React Basics Quiz', 1);

  insertQuestion(db, 20, 'What is JSX?', JSON.stringify(['A new programming language', 'A syntax extension for JavaScript that looks like HTML', 'A CSS framework', 'A testing library']), 1, 'JSX is a syntax extension that lets you write HTML-like code in JavaScript. It compiles to React.createElement() calls.');
  insertQuestion(db, 20, 'How do you pass data from a parent to a child component?', JSON.stringify(['Using state', 'Using props', 'Using context', 'Using refs']), 1, 'Props (properties) are passed from parent to child components. They are read-only in the child component.');
  insertQuestion(db, 20, 'What should you use as the key prop when rendering lists?', JSON.stringify(['Array index', 'A unique ID from your data', 'The item name', 'A random number']), 1, 'Always use a stable, unique ID from your data as the key. Array indices should only be used as a last resort.');
  insertQuestion(db, 20, 'What does the children prop contain?', JSON.stringify(['The component state', 'The component props', 'Anything between opening and closing tags', 'The parent component']), 2, 'The children prop contains whatever is placed between a component opening and closing tags, enabling composition patterns.');

  // --- Topic: React State & Effects ---
  insertTopic(db, 6, 'React State & Effects', 2);

  insertLesson(db, 21, 'useState Hook', `## What is State?

State is data that changes over time and controls what the component renders. The \`useState\` hook lets you add state to functional components.

## Basic useState

\`\`\`jsx
import { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
            <button onClick={() => setCount(count - 1)}>Decrement</button>
        </div>
    );
}
\`\`\`

## Updating State

\`\`\`jsx
function App() {
    const [count, setCount] = useState(0);

    // Direct value
    setCount(5);

    // Functional update (when new state depends on old state)
    setCount(prev => prev + 1);

    // Multiple state updates are batched
    function handleClick() {
        setCount(prev => prev + 1);
        setCount(prev => prev + 1);
        setCount(prev => prev + 1);
        // Result: count increases by 3 (not 1!)
    }
}
\`\`\`

## State with Objects

\`\`\`jsx
function UserForm() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        age: 0
    });

    const updateName = (name) => {
        // Always spread existing state to preserve other properties
        setUser(prev => ({ ...prev, name }));
    };

    const updateEmail = (email) => {
        setUser(prev => ({ ...prev, email }));
    };

    return (
        <form>
            <input value={user.name} onChange={e => updateName(e.target.value)} />
            <input value={user.email} onChange={e => updateEmail(e.target.value)} />
        </form>
    );
}
\`\`\`

## State with Arrays

\`\`\`jsx
function TodoList() {
    const [todos, setTodos] = useState([]);

    const addTodo = (text) => {
        setTodos(prev => [...prev, { id: Date.now(), text, done: false }]);
    };

    const toggleTodo = (id) => {
        setTodos(prev => prev.map(todo =>
            todo.id === id ? { ...todo, done: !todo.done } : todo
        ));
    };

    const removeTodo = (id) => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
    };
}
\`\`\`

## Lazy Initialization

\`\`\`jsx
// Expensive computation only runs on first render
const [state, setState] = useState(() => {
    return expensiveComputation();
});
\`\`\`

## Rules of Hooks

1. Only call hooks at the **top level** (not inside loops, conditions, or nested functions)
2. Only call hooks from **React functions** (components or custom hooks)`, `// useState Hook Demo

import { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '10px', textAlign: 'center' }}>
            <h3>Counter: {count}</h3>
            <button onClick={() => setCount(prev => prev + 1)} style={{ margin: '5px', padding: '10px 20px' }}>+</button>
            <button onClick={() => setCount(prev => prev - 1)} style={{ margin: '5px', padding: '10px 20px' }}>-</button>
            <button onClick={() => setCount(0)} style={{ margin: '5px', padding: '10px 20px' }}>Reset</button>
        </div>
    );
}

function TodoApp() {
    const [todos, setTodos] = useState([
        { id: 1, text: 'Learn React', done: true },
        { id: 2, text: 'Build a project', done: false }
    ]);
    const [input, setInput] = useState('');

    const addTodo = () => {
        if (!input.trim()) return;
        setTodos(prev => [...prev, { id: Date.now(), text: input, done: false }]);
        setInput('');
    };

    const toggleTodo = (id) => {
        setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    const removeTodo = (id) => {
        setTodos(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '10px' }}>
            <h3>Todo List ({todos.filter(t => !t.done).length} remaining)</h3>
            <div>
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Add a todo..."
                    onKeyDown={e => e.key === 'Enter' && addTodo()}
                    style={{ padding: '8px', marginRight: '8px', width: '250px' }} />
                <button onClick={addTodo}>Add</button>
            </div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {todos.map(todo => (
                    <li key={todo.id} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                        <span onClick={() => toggleTodo(todo.id)} style={{
                            textDecoration: todo.done ? 'line-through' : 'none',
                            cursor: 'pointer',
                            color: todo.done ? '#999' : '#333'
                        }}>
                            {todo.done ? '\u2611' : '\u2610'} {todo.text}
                        </span>
                        <button onClick={() => removeTodo(todo.id)} style={{ float: 'right' }}>X</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function App() {
    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h1>useState Hook Demo</h1>
            <Counter />
            <TodoApp />
        </div>
    );
}

export default App;`, `const [count, setCount] = useState(0);
return (
  <div>
    <p>{count}</p>
    <button onClick={() => setCount(count + 1)}>+</button>
  </div>
);`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 1, null);

  insertLesson(db, 21, 'useEffect Hook', `## What is useEffect?

\`useEffect\` handles **side effects** in functional components — operations that happen outside the rendering process, like API calls, subscriptions, DOM manipulation, and timers.

## Basic Syntax

\`\`\`jsx
import { useEffect, useState } from 'react';

function UserProfile({ userId }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Side effect: fetch user data
        fetch(\`/api/users/\${userId}\`)
            .then(res => res.json())
            .then(data => setUser(data));
    }, [userId]); // Dependency array

    if (!user) return <p>Loading...</p>;
    return <h2>{user.name}</h2>;
}
\`\`\`

## Dependency Array

The dependency array controls when the effect runs:

- **No array** — Runs after every render (usually not what you want)
- **Empty array \`[]\`** — Runs only once after initial render (like componentDidMount)
- **With dependencies \`[dep1, dep2]\`** — Runs when any dependency changes

\`\`\`jsx
// Runs once on mount
useEffect(() => {
    console.log('Component mounted');
}, []);

// Runs when count changes
useEffect(() => {
    document.title = \\\`Count: \\\${count}\\\`;
}, [count]);

// Runs after every render (use sparingly!)
useEffect(() => {
    console.log('Rendered');
});
\`\`\`

## Cleanup Function

Return a function from useEffect to clean up when the component unmounts or before the effect re-runs:

\`\`\`jsx
useEffect(() => {
    const timer = setInterval(() => {
        console.log('Tick');
    }, 1000);

    // Cleanup: clear the timer
    return () => clearInterval(timer);
}, []);
\`\`\`

## Common Patterns

### Fetching Data

\`\`\`jsx
function DataFetcher({ url }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchData() {
            try {
                const res = await fetch(url, { signal: controller.signal });
                const json = await res.json();
                setData(json);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchData();
        return () => controller.abort(); // Cleanup on unmount
    }, [url]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
\`\`\`

### Document Title

\`\`\`jsx
useEffect(() => {
    document.title = \\\`Count: \\\${count}\\\`;
}, [count]);
\`\`\`

### Window Event Listener

\`\`\`jsx
useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
}, []);
\`\`\` `, `useEffect(() => {
  document.title = \`Count: \${count}\`;
  return () => { /* cleanup */ };
}, [count]);`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 2, null);

  insertLesson(db, 21, 'useRef & useReducer', `## useRef

\`useRef\` creates a mutable reference that persists across renders without triggering re-renders. Two main uses: accessing DOM elements and storing values that don't affect rendering.

### DOM Access

\`\`\`jsx
import { useRef, useEffect } from 'react';

function TextInput() {
    const inputRef = useRef(null);

    const focusInput = () => {
        inputRef.current.focus();
    };

    return (
        <div>
            <input ref={inputRef} type="text" placeholder="Click button to focus" />
            <button onClick={focusInput}>Focus Input</button>
        </div>
    );
}
\`\`\`

### Storing Mutable Values

\`\`\`jsx
function Stopwatch() {
    const [time, setTime] = useState(0);
    const intervalRef = useRef(null);

    const start = () => {
        intervalRef.current = setInterval(() => {
            setTime(prev => prev + 1);
        }, 1000);
    };

    const stop = () => {
        clearInterval(intervalRef.current);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <div>
            <p>Time: {time}s</p>
            <button onClick={start}>Start</button>
            <button onClick={stop}>Stop</button>
        </div>
    );
}
\`\`\`

## useReducer

\`useReducer\` is an alternative to \`useState\` for complex state logic. It follows the Redux pattern: state + action -> new state.

\`\`\`jsx
import { useReducer } from 'react';

function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return { count: state.count + 1 };
        case 'decrement':
            return { count: state.count - 1 };
        case 'reset':
            return { count: 0 };
        default:
            throw new Error('Unknown action: ' + action.type);
    }
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, { count: 0 });

    return (
        <div>
            <p>Count: {state.count}</p>
            <button onClick={() => dispatch({ type: 'increment' })}>+</button>
            <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
            <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
        </div>
    );
}
\`\`\`

## useState vs useReducer

| Feature | useState | useReducer |
|---------|----------|------------|
| Simple state | Better | Overkill |
| Complex state | Gets messy | Better organized |
| Multiple related values | Scattered | Centralized |
| Testing | Harder | Easier (pure function) |
| Next state depends on prev | Functional update | Natural |,`, `const inputRef = useRef(null);
const [state, dispatch] = useReducer(reducer, initialState);
inputRef.current.focus();`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 3, null);

  insertQuiz(db, 21, 'React State & Effects Quiz', 2);

  insertQuestion(db, 21, 'What does the useState hook return?', JSON.stringify(['The current state value', 'An array with the state value and a setter function', 'An object with value and update methods', 'A promise']), 1, 'useState returns an array with two elements: the current state value and a function to update it. You destructure them: const [value, setValue] = useState(initial).');
  insertQuestion(db, 21, 'When does a useEffect with an empty dependency array run?', JSON.stringify(['After every render', 'Only once after the initial render', 'Never', 'Before the component renders']), 1, 'An empty dependency array [] means the effect has no dependencies, so it only runs once after the component first mounts.');
  insertQuestion(db, 21, 'What should useEffect return for cleanup?', JSON.stringify(['The new state', 'A function to clean up the effect', 'undefined', 'A boolean']), 1, 'useEffect should return a cleanup function that runs before the next effect execution and when the component unmounts.');

  // --- Topic: React Advanced ---
  insertTopic(db, 6, 'React Advanced', 3);

  insertLesson(db, 22, 'React Router', `## What is React Router?

React Router enables navigation between different views in a single-page application (SPA) without full page reloads. It maps URL paths to React components.

## Installation

\`\`\`bash
npm install react-router-dom
\`\`\`

## Basic Setup

\`\`\`jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/courses">Courses</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/courses" element={<Courses />} />
            </Routes>
        </BrowserRouter>
    );
}
\`\`\`

## Dynamic Routes with useParams

\`\`\`jsx
import { useParams } from 'react-router-dom';

function CoursePage() {
    const { courseId } = useParams();
    return <h2>Course: {courseId}</h2>;
}

// In Routes:
<Route path="/courses/:courseId" element={<CoursePage />} />

// URL: /courses/javascript -> courseId = "javascript"
\`\`\`

## Navigation with useNavigate

\`\`\`jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(credentials);
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* form fields */}
            <button type="submit">Login</button>
        </form>
    );
}
\`\`\`

## Programmatic Navigation

\`\`\`jsx
// Navigate to a path
navigate('/courses');

// Go back
navigate(-1);

// Go forward
navigate(1);

// Replace current history entry
navigate('/login', { replace: true });

// Pass state
navigate('/dashboard', { state: { from: 'login' } });

// Read state in target component
const location = useLocation();
console.log(location.state); // { from: 'login' }
\`\`\`

## Nested Routes

\`\`\`jsx
function Dashboard() {
    return (
        <div>
            <h1>Dashboard</h1>
            <nav>
                <Link to="profile">Profile</Link>
                <Link to="settings">Settings</Link>
            </nav>
            <Outlet /> {/* Child routes render here */}
        </div>
    );
}

<Routes>
    <Route path="/dashboard" element={<Dashboard />}>
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
    </Route>
</Routes>
\`\`\`

## 404 Page

\`\`\`jsx
<Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="*" element={<NotFound />} />
</Routes>
\`\`\``, `import { BrowserRouter, Routes, Route } from 'react-router-dom';
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
</BrowserRouter>`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 1, null);

  insertLesson(db, 22, 'Context API', `## What is Context?

The Context API provides a way to pass data through the component tree **without prop drilling** (passing props through intermediate components that don't need them). It creates a global state accessible by any component.

## Creating Context

\`\`\`jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

function App() {
    const [theme, setTheme] = useState('light');

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <div className={theme}>
                <Header />
                <Main />
                <Footer />
            </div>
        </ThemeContext.Provider>
    );
}
\`\`\`

## Consuming Context

### useContext Hook

\`\`\`jsx
function ThemeToggle() {
    const { theme, setTheme } = useContext(ThemeContext);

    return (
        <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
            Current theme: {theme}
        </button>
    );
}
\`\`\`

## Provider Pattern

Create a custom provider component for better organization:

\`\`\`jsx
function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (email, password) => {
        const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        setUser(data.user);
    };

    const logout = () => setUser(null);

    const value = { user, loading, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook
function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
\`\`\`

## Global State Pattern

\`\`\`jsx
// store/ThemeContext.jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be within ThemeProvider');
    return context;
}
\`\`\`

## When to Use Context

- **Theme** (dark/light mode)
- **Authentication** (current user, login/logout)
- **Language/Locale** (internationalization)
- **UI state** (sidebar open, modal visible)

**Don't use context** for rapidly changing data — it causes all consumers to re-render.`, `const ThemeContext = React.createContext('light');
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Child />
    </ThemeContext.Provider>
  );
}`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 2, null);

  insertLesson(db, 22, 'React Performance', `## React.memo

Prevents unnecessary re-renders by memoizing a component:

\`\`\`jsx
import { memo } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
    console.log('ExpensiveComponent rendered');
    return <div>{/* complex rendering */}</div>;
});

// Only re-renders when 'data' prop changes
\`\`\`

## useMemo

Memoizes a computed value so it only recalculates when dependencies change:

\`\`\`jsx
import { useMemo } from 'react';

function ProductList({ products, filter }) {
    const filteredProducts = useMemo(() => {
        console.log('Filtering products...');
        return products.filter(p => p.price >= filter.min && p.price <= filter.max);
    }, [products, filter.min, filter.max]);

    return filteredProducts.map(p => <Product key={p.id} product={p} />);
}
\`\`\`

## useCallback

Memoizes a function reference so it doesn't change on every render:

\`\`\`jsx
import { useCallback, useState, memo } from 'react';

const Button = memo(({ onClick, children }) => {
    console.log(\`Button "\${children}" rendered\`);
    return <button onClick={onClick}>{children}</button>;
});

function App() {
    const [count, setCount] = useState(0);

    // Without useCallback: new function reference on every render
    const handleClick = useCallback(() => {
        setCount(prev => prev + 1);
    }, []); // Empty deps = never changes

    return (
        <div>
            <p>Count: {count}</p>
            <Button onClick={handleClick}>Increment</Button>
        </div>
    );
}
\`\`\`

## Lazy Loading

Load components only when they are needed:

\`\`\`jsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));

function App() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </Suspense>
    );
}
\`\`\`

## Performance Tips

1. **Avoid inline object/array creation in JSX** — Creates new references every render
2. **Use React.memo** for pure components that receive the same props frequently
3. **Use useMemo** for expensive calculations
4. **Use useCallback** for event handlers passed to memoized children
5. **Use React.lazy** for code splitting and reducing initial bundle size
6. **Use key prop correctly** — Never use index for dynamic lists
7. **Avoid unnecessary state** — Derive values from existing state when possible
8. **Use Chrome DevTools Profiler** to identify performance bottlenecks`, `const MemoizedComponent = React.memo(MyComponent);
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 3, null);

  insertQuiz(db, 22, 'React Advanced Quiz', 3);

  insertQuestion(db, 22, 'What does React Router enable in a single-page application?', JSON.stringify(['Server-side rendering', 'Client-side navigation without full page reloads', 'Database connections', 'State management']), 1, 'React Router maps URL paths to React components, enabling navigation between views without full page reloads.');
  insertQuestion(db, 22, 'What problem does the Context API solve?', JSON.stringify(['Component styling', 'Prop drilling — passing data through intermediate components', 'API calls', 'Form validation']), 1, 'Context API provides a way to pass data through the component tree without having to pass props down manually at every level (prop drilling).');
  insertQuestion(db, 22, 'What does React.memo do?', JSON.stringify(['Memoizes component state', 'Prevents unnecessary re-renders when props have not changed', 'Creates a new component instance', 'Optimizes network requests']), 1, 'React.memo is a higher-order component that memoizes the rendered output, skipping re-renders if the props have not changed.');

  // ============================================================
  // 7. LEARN BOOTSTRAP
  // ============================================================
  insertCourse(db, 'Learn Bootstrap', 'bootstrap', 'Build responsive, mobile-first websites quickly with Bootstrap. Master the grid system, components, and utility classes.', 'phone', '#7952b3', 7, 0, 'en');

  // --- Topic: Bootstrap Basics ---
  insertTopic(db, 7, 'Bootstrap Basics', 1);

  insertLesson(db, 23, 'Bootstrap Introduction', `## What is Bootstrap?

Bootstrap is the world's most popular **CSS framework** for building responsive, mobile-first websites. It provides pre-built CSS classes, JavaScript components, and a grid system that makes rapid prototyping and development easy.

## Why Bootstrap?

- **Fast development** — Pre-built components and utilities
- **Responsive by default** — Mobile-first grid system
- **Cross-browser compatible** — Works on all modern browsers
- **Consistent design** — Professional-looking UI out of the box
- **Large community** — Extensive documentation and examples

## Setting Up Bootstrap

### Via CDN (Simplest)

\`\`\`html
<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet">

<!-- Bootstrap JS Bundle (includes Popper) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js">
</script>
\`\`\`

### Via npm

\`\`\`bash
npm install bootstrap
\`\`\`

\`\`\`jsx
import 'bootstrap/dist/css/bootstrap.min.css';
\`\`\`

## Your First Bootstrap Page

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet">
</head>
<body>
    <div class="container">
        <h1>Hello, Bootstrap!</h1>
        <p class="lead">This is a Bootstrap-styled paragraph.</p>
        <button class="btn btn-primary">Click Me</button>
    </div>
</body>
</html>
\`\`\`

## Utility Classes

Bootstrap provides many utility classes for quick styling:

| Class | Effect |
|-------|--------|
| \`text-center\` | Center text |
| \`text-primary\` | Blue text |
| \`bg-danger\` | Red background |
| \`mt-3\` | Top margin (size 3) |
| \`p-2\` | Padding (size 2) |
| \`fw-bold\` | Bold font weight |
| \`d-flex\` | Display flex |
| \`justify-content-center\` | Center flex items |
| \`w-100\` | Full width |
| \`rounded\` | Rounded corners |
| \`shadow\` | Box shadow |
| \`visible\` / \`d-none\` | Show / hide elements |`, `console.log('Bootstrap loaded');`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 1, null);

  insertLesson(db, 23, 'Bootstrap Grid', `## The Grid System

Bootstrap uses a **12-column flexbox grid system**. You create layouts by defining how many of the 12 columns each element should occupy.

## Container

\`\`\`html
<div class="container">Fixed-width, centered</div>
<div class="container-fluid">Full-width</div>
<div class="container-md">Responsive max-width</div>
\`\`\`

## Rows and Columns

\`\`\`html
<div class="container">
    <div class="row">
        <div class="col-4">4 columns</div>
        <div class="col-4">4 columns</div>
        <div class="col-4">4 columns</div>
    </div>
</div>
\`\`\`

## Responsive Breakpoints

| Class | Width | Target |
|-------|-------|--------|
| \`col-\` | < 576px | Extra small |
| \`col-sm-\` | >= 576px | Small |
| \`col-md-\` | >= 768px | Medium |
| \`col-lg-\` | >= 992px | Large |
| \`col-xl-\` | >= 1200px | Extra large |
| \`col-xxl-\` | >= 1400px | XXL |

## Responsive Layout

\`\`\`html
<div class="container">
    <div class="row">
        <!-- Stack on small, side-by-side on medium and up -->
        <div class="col-12 col-md-6">Left content</div>
        <div class="col-12 col-md-6">Right content</div>
    </div>
</div>
\`\`\`

## Auto-layout

\`\`\`html
<!-- Equal width columns that auto-fit -->
<div class="row">
    <div class="col">Auto 1</div>
    <div class="col">Auto 2</div>
    <div class="col">Auto 3</div>
</div>
\`\`\`

## Offset Columns

\`\`\`html
<!-- Center a 6-column element -->
<div class="row">
    <div class="col-6 offset-3">Centered</div>
</div>
\`\`\`

## Ordering

\`\`\`html
<div class="row">
    <div class="col-4 order-3">First (shows 3rd)</div>
    <div class="col-4 order-1">Second (shows 1st)</div>
    <div class="col-4 order-2">Third (shows 2nd)</div>
</div>
\`\`\` `, `<div class="container">
  <div class="row">
    <div class="col-md-4">Column 1</div>
    <div class="col-md-4">Column 2</div>
    <div class="col-md-4">Column 3</div>
  </div>
</div>`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 2, null);

  insertLesson(db, 23, 'Bootstrap Typography', `## Headings

Bootstrap styles all HTML headings (\`<h1>\` through \`<h6>\`) and adds classes for display headings:

\`\`\`html
<h1>h1. Bootstrap heading</h1>
<h2>h2. Bootstrap heading</h2>
<h3>h3. Bootstrap heading</h3>

<!-- Display headings for larger, more prominent headings -->
<h1 class="display-1">Display 1</h1>
<h1 class="display-2">Display 2</h1>
<h1 class="display-3">Display 3</h1>
\`\`\`

## Lead Paragraph

\`\`\`html
<p class="lead">
    This is a lead paragraph — it stands out from regular text
    with larger font size and lighter weight.
</p>
\`\`\`

## Blockquote

\`\`\`html
<blockquote class="blockquote">
    <p class="mb-0">The only way to do great work is to love what you do.</p>
    <footer class="blockquote-footer">Steve Jobs</footer>
</blockquote>
\`\`\`

## Text Utilities

| Class | Effect |
|-------|--------|
| \`text-start\` | Left align |
| \`text-center\` | Center align |
| \`text-end\` | Right align |
| \`text-wrap\` / \`text-nowrap\` | Wrap / no wrap |
| \`text-lowercase\` | Lowercase |
| \`text-uppercase\` | Uppercase |
| \`text-capitalize\` | Capitalize |
| \`text-truncate\` | Truncate with ellipsis |
| \`text-break\` | Break long words |

## Font Weight and Italic

\`\`\`html
<p class="fw-bold">Bold text</p>
<p class="fw-bolder">Bolder text</p>
<p class="fw-normal">Normal weight</p>
<p class="fw-light">Light weight</p>
<p class="fst-italic">Italic text</p>
\`\`\`

## Lists

\`\`\`html
<ul class="list-unstyled">
    <li>Unstyled list item</li>
    <li>No bullets or indentation</li>
</ul>

<ul class="list-inline">
    <li class="list-inline-item">Inline item 1</li>
    <li class="list-inline-item">Inline item 2</li>
    <li class="list-inline-item">Inline item 3</li>
</ul>
\`\`\` `, `<h1 class="display-1">Display 1</h1>
<p class="lead">Lead paragraph</p>
<small class="text-muted">Small muted text</small>`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 3, null);

  insertQuiz(db, 23, 'Bootstrap Basics Quiz', 1);

  insertQuestion(db, 23, 'How many columns does the Bootstrap grid system have?', JSON.stringify(['6', '8', '10', '12']), 3, 'Bootstrap uses a 12-column grid system. You can define how many of these 12 columns each element occupies.');
  insertQuestion(db, 23, 'What class makes a container full-width?', JSON.stringify(['container', 'container-fluid', 'container-full', 'container-wide']), 1, 'container-fluid makes the container span the full width of the viewport. Use container for a fixed-width centered container.');
  insertQuestion(db, 23, 'Which class creates a display heading?', JSON.stringify(['heading-display', 'display-1', 'title-large', 'text-display']), 1, 'Display heading classes (display-1 through display-6) create larger, more prominent headings than regular heading tags.');

  // --- Topic: Bootstrap Components ---
  insertTopic(db, 7, 'Bootstrap Components', 2);

  insertLesson(db, 24, 'Bootstrap Navbar', `## Navbar Structure

\`\`\`html
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
        <a class="navbar-brand" href="#">LearnHub</a>
        <button class="navbar-toggler" type="button"
                data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <a class="nav-link active" href="#">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Courses</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Pricing</a>
                </li>
            </ul>
            <form class="d-flex">
                <input class="form-control me-2" type="search" placeholder="Search">
                <button class="btn btn-outline-light" type="submit">Search</button>
            </form>
        </div>
    </div>
</nav>
\`\`\`

## Navbar Variants

\`\`\`html
<!-- Light navbar -->
<nav class="navbar navbar-expand-lg navbar-light bg-light">

<!-- Dark navbar -->
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">

<!-- Primary color -->
<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
\`\`\`

## Responsive Collapse

The \`navbar-toggler\` button and \`collapse navbar-collapse\` div work together to create a responsive hamburger menu on mobile:

- **\`navbar-expand-lg\`** — Navbar is horizontal on large screens, collapsed on smaller
- **\`navbar-expand-md\`** — Collapses below medium breakpoint
- **\`navbar-expand-sm\`** — Collapses below small breakpoint

## Navbar with Dropdown

\`\`\`html
<li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" href="#" role="button"
       data-bs-toggle="dropdown">Courses</a>
    <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="#">HTML</a></li>
        <li><a class="dropdown-item" href="#">CSS</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="#">JavaScript</a></li>
    </ul>
</li>
\`\`\` `, `<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <a class="navbar-brand" href="#">Logo</a>
  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
    <span class="navbar-toggler-icon"></span>
  </button>
</nav>`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 1, null);

  insertLesson(db, 24, 'Bootstrap Cards & Buttons', `## Cards

Cards are versatile content containers with header, body, and footer sections:

\`\`\`html
<div class="card" style="width: 18rem;">
    <img src="course.jpg" class="card-img-top" alt="Course">
    <div class="card-body">
        <h5 class="card-title">Learn HTML</h5>
        <p class="card-text">Master the building blocks of the web.</p>
        <a href="#" class="btn btn-primary">Start Course</a>
    </div>
    <div class="card-footer">
        <small class="text-muted">12 lessons · Free</small>
    </div>
</div>
\`\`\`

### Card Variants

\`\`\`html
<div class="card text-white bg-primary">Primary card</div>
<div class="card text-white bg-success">Success card</div>
<div class="card border-warning">Warning card</div>
<div class="card bg-light">Light card</div>
\`\`\`

### Card Group

\`\`\`html
<div class="card-group">
    <div class="card">...</div>
    <div class="card">...</div>
    <div class="card">...</div>
</div>
\`\`\`

## Buttons

\`\`\`html
<!-- Basic colors -->
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-warning">Warning</button>
<button class="btn btn-info">Info</button>
<button class="btn btn-light">Light</button>
<button class="btn btn-dark">Dark</button>
<button class="btn btn-link">Link</button>
\`\`\`

### Button Sizes

\`\`\`html
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary">Default</button>
<button class="btn btn-primary btn-lg">Large</button>
\`\`\`

### Outline Buttons

\`\`\`html
<button class="btn btn-outline-primary">Primary</button>
<button class="btn btn-outline-secondary">Secondary</button>
<button class="btn btn-outline-success">Success</button>
\`\`\`

### Button Groups

\`\`\`html
<div class="btn-group" role="group">
    <button class="btn btn-primary">Left</button>
    <button class="btn btn-primary">Middle</button>
    <button class="btn btn-primary">Right</button>
</div>
\`\`\`

## Badges

\`\`\`html
<span class="badge bg-primary">Primary</span>
<span class="badge bg-success">Success</span>
<span class="badge rounded-pill bg-danger">99+</span>
\`\`\``, `<div class="card" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">Title</h5>
    <p class="card-text">Text</p>
    <a href="#" class="btn btn-primary">Button</a>
  </div>
</div>`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 2, null);

  insertLesson(db, 24, 'Bootstrap Forms', `## Basic Form

\`\`\`html
<form>
    <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input type="text" class="form-control" id="name" placeholder="Enter name">
    </div>
    <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email">
    </div>
    <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" id="password">
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
</form>
\`\`\`

## Form Select

\`\`\`html
<select class="form-select">
    <option selected>Choose a course...</option>
    <option>HTML</option>
    <option>CSS</option>
    <option>JavaScript</option>
</select>
\`\`\`

## Input Groups

\`\`\`html
<div class="input-group mb-3">
    <span class="input-group-text">@</span>
    <input type="text" class="form-control" placeholder="Username">
</div>

<div class="input-group mb-3">
    <input type="text" class="form-control" placeholder="Email">
    <button class="btn btn-primary">Subscribe</button>
</div>
\`\`\`

## Form Validation

\`\`\`html
<form class="needs-validation" novalidate>
    <div class="mb-3">
        <label class="form-label">Email</label>
        <input type="email" class="form-control" required>
        <div class="valid-feedback">Looks good!</div>
        <div class="invalid-feedback">Please enter a valid email.</div>
    </div>
    <button class="btn btn-primary" type="submit">Submit</button>
</form>
\`\`\`

## Horizontal Forms

\`\`\`html
<form>
    <div class="row mb-3">
        <label class="col-sm-2 col-form-label">Email</label>
        <div class="col-sm-10">
            <input type="email" class="form-control">
        </div>
    </div>
</form>
\`\`\`

## Floating Labels

\`\`\`html
<div class="form-floating mb-3">
    <input type="email" class="form-control" id="floatingEmail" placeholder="Email">
    <label for="floatingEmail">Email address</label>
</div>
\`\`\` `, `<form>
  <div class="mb-3">
    <label class="form-label">Email</label>
    <input type="email" class="form-control">
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 3, null);

  insertQuiz(db, 24, 'Bootstrap Components Quiz', 2);

  insertQuestion(db, 24, 'What class makes a navbar responsive with a hamburger menu?', JSON.stringify(['navbar-responsive', 'navbar-expand-lg', 'navbar-toggle', 'navbar-mobile']), 1, 'navbar-expand-lg makes the navbar expand horizontally on large screens and collapse into a hamburger menu on smaller screens.');
  insertQuestion(db, 24, 'What class creates a primary-colored button?', JSON.stringify(['button-primary', 'btn-primary', 'btn-blue', 'btn-main']), 1, 'Bootstrap uses btn-primary for blue/primary colored buttons. All button styles start with the btn class prefix.');
  insertQuestion(db, 24, 'How do you add validation styling to a form input?', JSON.stringify(['Add class valid', 'Add class is-valid or is-invalid', 'Add class form-valid', 'Add data-validate attribute']), 1, 'Add is-valid for success styling or is-invalid for error styling. Bootstrap also supports custom validation with needs-validation and novalidate.');

  // --- Topic: Bootstrap Advanced ---
  insertTopic(db, 7, 'Bootstrap Advanced', 3);

  insertLesson(db, 25, 'Bootstrap Modal & Alerts', `## Modals

Modals are dialog boxes that appear on top of the page content:

\`\`\`html
<!-- Modal trigger button -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal"
        data-bs-target="#exampleModal">
    Open Modal
</button>

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Course Enrollment</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to enroll in this course?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary"
                        data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary">Enroll</button>
            </div>
        </div>
    </div>
</div>
\`\`\`

## Alerts

\`\`\`html
<div class="alert alert-success" role="alert">
    Course enrollment successful!
</div>
<div class="alert alert-danger alert-dismissible fade show" role="alert">
    Something went wrong!
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
\`\`\`

## Badges

\`\`\`html
<span class="badge bg-primary">New</span>
<span class="badge bg-success">Completed</span>
<span class="badge rounded-pill bg-danger">3</span>
<span class="badge bg-secondary">HTML</span>
\`\`\`

## Progress Bars

\`\`\`html
<div class="progress mb-3" style="height: 20px;">
    <div class="progress-bar bg-success" style="width: 75%"
         role="progressbar">75%</div>
</div>

<!-- Striped animated -->
<div class="progress">
    <div class="progress-bar progress-bar-striped progress-bar-animated"
         style="width: 50%"></div>
</div>
\`\`\`

## Spinners

\`\`\`html
<div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
</div>

<div class="spinner-grow text-success" role="status">
    <span class="visually-hidden">Loading...</span>
</div>
\`\`\` `, `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#myModal">Open</button>
<div class="modal fade" id="myModal">
  <div class="modal-dialog"><div class="modal-content"><div class="modal-body">Content</div></div></div>
</div>`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 1, null);

  insertLesson(db, 25, 'Bootstrap Utilities', `## Spacing Utilities

Bootstrap provides margin and padding utilities with a consistent naming pattern:

\`\`\`html
<!-- Format: {property}{side}-{size} -->
<!-- m = margin, p = padding -->
<!-- t/b/s/e/x/y/blank = top/bottom/start/end/horizontal/vertical/all -->
<!-- 0-5 = size (0 = 0, 1 = 0.25rem, 2 = 0.5rem, 3 = 1rem, 4 = 1.5rem, 5 = 3rem) -->

<div class="mt-3">Margin top 1rem</div>
<div class="p-2">Padding all sides 0.5rem</div>
<div class="mx-auto">Center horizontally</div>
<div class="mb-5">Margin bottom 3rem</div>
\`\`\`

## Display Utilities

\`\`\`html
<div class="d-none d-md-block">Hidden on mobile, visible on md+</div>
<div class="d-block d-lg-none">Visible on mobile, hidden on lg+</div>
<div class="d-flex">Display flex</div>
<div class="d-grid">Display grid</div>
<div class="d-inline">Inline</div>
<div class="d-inline-block">Inline block</div>
\`\`\`

## Flex Utilities

\`\`\`html
<div class="d-flex justify-content-between align-items-center">
    <span>Left</span>
    <span>Center</span>
    <span>Right</span>
</div>

<div class="d-flex flex-column flex-md-row">
    <div>Sidebar</div>
    <div>Main content</div>
</div>
\`\`\`

## Float Utilities

\`\`\`html
<div class="float-start">Floated left</div>
<div class="float-end">Floated right</div>
<div class="clearfix">Clearfix container</div>
\`\`\`

## Text and Background Colors

\`\`\`html
<p class="text-primary">Primary text</p>
<p class="text-danger">Danger text</p>
<p class="text-muted">Muted text</p>

<div class="bg-primary text-white p-3">Primary background</div>
<div class="bg-light p-3">Light background</div>
\`\`\`

## Border Utilities

\`\`\`html
<div class="border">Default border</div>
<div class="border-top border-primary">Top border primary</div>
<div class="rounded">Rounded corners</div>
<div class="rounded-circle">Circle (with equal width/height)</div>
\`\`\`

## Shadow Utilities

\`\`\`html
<div class="shadow">Standard shadow</div>
<div class="shadow-sm">Small shadow</div>
<div class="shadow-lg">Large shadow</div>
\`\`\`

## Visibility

\`\`\`html
<div class="visible">I am visible</div>
<div class="invisible">I am invisible (but takes space)</div>
\`\`\`

## Position Utilities

\`\`\`html
<div class="position-relative">Relative position</div>
<div class="position-absolute top-0 end-0">Absolute top-right</div>
<div class="position-fixed bottom-0 end-0 p-3">Fixed bottom-right</div>
\`\`\``, `<div class="m-3 p-2">Margin and padding</div>
<div class="d-flex justify-content-center">Flex centered</div>
<div class="text-center text-primary fw-bold">Styled text</div>`, 'https://www.youtube.com/embed/PkZNo7MFNFg', 2, null);

  insertQuiz(db, 25, 'Bootstrap Advanced Quiz', 3);

  insertQuestion(db, 25, 'What class creates a dismissible alert?', JSON.stringify(['alert-close', 'alert-dismissible with data-bs-dismiss', 'alert-x', 'alert-dismiss']), 1, 'Add the alert-dismissible class and a close button with data-bs-dismiss="alert" to make an alert dismissible.');
  insertQuestion(db, 25, 'What does the class d-none d-md-block do?', JSON.stringify(['Hides the element always', 'Hides on mobile, shows on medium and larger screens', 'Shows only on mobile', 'Makes the element transparent']), 1, 'd-none hides the element, d-md-block shows it as a block element on medium (768px+) screens and above.');
  insertQuestion(db, 25, 'What is the spacing for mt-3 in Bootstrap?', JSON.stringify(['0.25rem', '0.5rem', '1rem', '1.5rem']), 2, 'mt-3 = margin-top: 1rem (16px). Bootstrap spacing scale: 0=0, 1=0.25rem, 2=0.5rem, 3=1rem, 4=1.5rem, 5=3rem.');

  console.log('All courses seeded successfully!');
}

module.exports = { seedAllCourses };
