# MDX Components Usage Guide

This guide shows you how to use all the available components in your MDX blog.

## Media Components

### Image Component

```mdx
<MDXImage
  src="/images/my-image.jpg"
  alt="Description of the image"
  width={800}
  height={400}
  caption="This is an optional caption"
  rounded={true}
  shadow={true}
/>
```

**Props:**
- `src` (required): Image URL
- `alt` (required): Alt text for accessibility
- `width`: Image width (default: 800)
- `height`: Image height (default: 400)
- `caption`: Optional caption below the image
- `rounded`: Show rounded corners (default: true)
- `shadow`: Show shadow (default: true)

---

### Video Component

```mdx
<MDXVideo
  src="/videos/my-video.mp4"
  type="video/mp4"
  thumbnail="/images/video-thumbnail.jpg"
  caption="Video explanation of the concept"
  controls={true}
  autoplay={false}
  loop={false}
  muted={false}
/>
```

**Props:**
- `src` (required): Video URL
- `type`: Video MIME type (default: "video/mp4")
- `thumbnail`: Poster/preview image
- `caption`: Optional caption
- `controls`: Show player controls (default: true)
- `autoplay`: Auto-play on load (default: false)
- `loop`: Loop the video (default: false)
- `muted`: Mute by default (default: false)

---

### Embed Component

Embed external content from YouTube, Vimeo, CodePen, Twitter, and more.

#### YouTube Embed
```mdx
<MDXEmbed
  type="youtube"
  id="dQw4w9WgXcQ"
  caption="Check out this tutorial"
/>
```

#### Vimeo Embed
```mdx
<MDXEmbed
  type="vimeo"
  id="123456789"
/>
```

#### CodePen Embed
```mdx
<MDXEmbed
  type="codepen"
  id="username/pen/abc123"
  height={500}
/>
```

#### Custom iframe
```mdx
<MDXEmbed
  type="iframe"
  src="https://example.com/embed"
  width={100}
  height={600}
/>
```

---

## Information Components

### Callout Component

Display important information, warnings, tips, etc.

```mdx
<Callout type="info" title="Did you know?">
  This is an informational callout with a title.
</Callout>

<Callout type="warning" title="Warning">
  Be careful when doing this.
</Callout>

<Callout type="error">
  This will cause an error if you're not careful.
</Callout>

<Callout type="success">
  You've successfully completed the step!
</Callout>

<Callout type="tip" title="Pro Tip">
  Here's a helpful tip to make your life easier.
</Callout>
```

**Types:** `info`, `warning`, `error`, `success`, `tip`

---

## Advanced Components

### Code Block Component

Enhanced code display with line numbers and titles.

```mdx
<CodeBlock 
  language="javascript"
  title="example.js"
  showLineNumbers={true}
>
{`const greeting = "Hello, World!";
console.log(greeting);`}
</CodeBlock>
```

**Props:**
- `language`: Programming language (default: "plaintext")
- `title`: Optional file name or title
- `showLineNumbers`: Display line numbers (default: true)

---

### Comparison Table Component

Side-by-side comparison of features.

```mdx
<Comparison
  leftLabel="Option A"
  rightLabel="Option B"
  items={[
    {
      feature: "Price",
      left: "$100",
      right: "$150"
    },
    {
      feature: "Support",
      left: true,
      right: true
    },
    {
      feature: "Advanced Features",
      left: false,
      right: true
    },
    {
      feature: "Custom Setup",
      left: "Basic",
      right: "Full"
    }
  ]}
/>
```

**Props:**
- `leftLabel`: Title for left column
- `rightLabel`: Title for right column
- `items`: Array of comparison items
  - `feature`: Feature name
  - `left`: Value or boolean (true shows ✓, false shows ✗)
  - `right`: Value or boolean

---

## Standard MDX Elements

All standard markdown elements are styled and available:

### Headings
```mdx
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

### Lists
```mdx
- Bullet point 1
- Bullet point 2
  - Nested point
  - Another nested point

1. First item
2. Second item
3. Third item
```

### Code (Inline)
```mdx
Use `const` to declare a variable.
```

### Code Block (Language-specific)
````mdx
```javascript
const greeting = "Hello";
console.log(greeting);
```
````

### Blockquote
```mdx
> This is a blockquote. It's useful for highlighting
> important excerpts or quotes.
```

### Horizontal Line
```mdx
---
```

### Tables
```mdx
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

---

## Existing Components (Already Imported)

### Tabs
```mdx
<Tabs defaultValue="tab1">
  <TabsList>
    <Tab value="tab1">Tab 1</Tab>
    <Tab value="tab2">Tab 2</Tab>
  </TabsList>
  <TabsContent value="tab1">
    Content for tab 1
  </TabsContent>
  <TabsContent value="tab2">
    Content for tab 2
  </TabsContent>
</Tabs>
```

### Note
```mdx
<Note type="info">
  This is an information note.
</Note>

<Note type="warning">
  This is a warning note.
</Note>
```

### Folder Tree
```mdx
<FolderTree>
  <Folder element="src">
    <Folder element="components">
      <File>Button.tsx</File>
      <File>Card.tsx</File>
    </Folder>
    <File>index.ts</File>
  </Folder>
</FolderTree>
```

### Steps
```mdx
<Steps>
  <Step>
    <StepTitle>First Step</StepTitle>
    <StepContent>
      Do this first
    </StepContent>
  </Step>
  <Step>
    <StepTitle>Second Step</StepTitle>
    <StepContent>
      Then do this
    </StepContent>
  </Step>
</Steps>
```

---

## Best Practices

1. **Images**: Always provide alt text for accessibility
2. **Captions**: Use captions to explain context for media
3. **Callouts**: Use appropriate types for different message severities
4. **Code Blocks**: Always specify the language for syntax highlighting
5. **Responsive**: All components are fully responsive and work on mobile
6. **Dark Mode**: All components support light and dark modes

---

## Styling

All components automatically:
- Adapt to light/dark mode
- Support responsive sizing
- Include proper spacing and margins
- Use your configured color scheme
- Have hover and transition effects