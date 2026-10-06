import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Check itinery directory (or fallback to itinerary if renamed)
let itineryDir = path.join(rootDir, 'itinery');
if (!fs.existsSync(itineryDir) && fs.existsSync(path.join(rootDir, 'itinerary'))) {
  itineryDir = path.join(rootDir, 'itinerary');
}

if (!fs.existsSync(itineryDir)) {
  fs.mkdirSync(itineryDir, { recursive: true });
}

function cleanTitle(str) {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\.md$/i, '')
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function stripMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/<[^>]*>/g, '')
    .trim();
}

function parseMarkdownFile(filePath, planId, relativeFile) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  let fileTitle = '';
  let currentSection = 'General Overview';
  const sections = [];
  const items = [];
  let itemCounter = 1;

  let currentSectionObj = {
    id: `section-0-general`,
    title: 'General Overview',
    items: [],
  };
  sections.push(currentSectionObj);

  let inFrontmatter = false;
  let frontmatterChecked = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Check for YAML frontmatter at start of file
    if (!frontmatterChecked && i === 0 && line === '---') {
      inFrontmatter = true;
      continue;
    }
    if (inFrontmatter) {
      if (line === '---') {
        inFrontmatter = false;
        frontmatterChecked = true;
      } else if (line.startsWith('title:')) {
        fileTitle = line.replace(/^title:\s*/, '').replace(/['"]/g, '').trim();
      }
      continue;
    }
    frontmatterChecked = true;

    // Check for H1 header if not already found
    if (!fileTitle && line.startsWith('# ')) {
      fileTitle = line.replace(/^#\s+/, '').trim();
      continue;
    }

    // Check for H1 (if fileTitle is already set), H2, H3, or H4 as section headings
    if (line.startsWith('## ') || line.startsWith('### ') || line.startsWith('#### ') || (fileTitle && line.startsWith('# '))) {
      const heading = line.replace(/^#{1,4}\s+/, '').trim();
      currentSection = heading;
      currentSectionObj = {
        id: `section-${sections.length + 1}-${heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        title: heading,
        items: [],
      };
      sections.push(currentSectionObj);
      continue;
    }

    // Check for bullet items: `- Name: Description` or `* Name: Description` or `- [ ] Name: Description`
    const bulletMatch = line.match(/^[-*]\s+(?:\[([ xX])\]\s+)?(.+)$/);
    if (bulletMatch) {
      const checkedMark = bulletMatch[1];
      const itemText = bulletMatch[2].trim();
      let name = itemText;
      let description = '';

      // Check if bold/italic colon pattern exists, e.g. **Name:** or **Name**: or *Name:* or *Name*:
      const styledColonMatch = itemText.match(/^(\*{1,2}|_{1,2})(.*?)(?::\1|\1:)\s*(.*)$/);
      if (styledColonMatch) {
        const delimiter = styledColonMatch[1];
        name = `${delimiter}${styledColonMatch[2]}${delimiter}`;
        description = styledColonMatch[3].trim();
      } else {
        const colonIndex = itemText.indexOf(':');
        if (colonIndex > 0 && colonIndex < itemText.length - 1) {
          name = itemText.substring(0, colonIndex).trim();
          description = itemText.substring(colonIndex + 1).trim();
        }
      }

      // Generate a stable item ID using plain stripped name
      const cleanName = stripMarkdown(name);
      const baseSlug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
      const itemId = `${planId}-${path.basename(relativeFile, '.md')}-${itemCounter++}-${baseSlug}`;

      const itemObj = {
        id: itemId,
        name,
        description,
        section: currentSection,
        file: relativeFile,
        initialChecked: checkedMark ? checkedMark.toLowerCase() === 'x' : false,
        raw: itemText,
      };

      items.push(itemObj);
      currentSectionObj.items.push(itemObj);
    }
  }

  // Filter out empty general overview section if it has no items and other sections exist
  const nonEmptySections = sections.filter(s => s.items.length > 0 || sections.length === 1);

  if (!fileTitle) {
    fileTitle = cleanTitle(path.basename(filePath, '.md'));
  }

  return {
    filename: path.basename(filePath),
    relativePath: relativeFile,
    title: fileTitle,
    rawContent: content,
    sections: nonEmptySections,
    items,
  };
}

function generatePlans() {
  console.log(`Scanning itineraries from: ${itineryDir}`);
  const entries = fs.readdirSync(itineryDir, { withFileTypes: true });

  const plans = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;

    const fullPath = path.join(itineryDir, entry.name);

    if (entry.isDirectory()) {
      // Travel plan directory containing one or more .md files
      const planSlug = entry.name;
      const planTitle = cleanTitle(entry.name);
      const mdFiles = fs
        .readdirSync(fullPath)
        .filter(f => f.endsWith('.md') && !f.startsWith('.'))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

      if (mdFiles.length === 0) continue;

      const parsedFiles = mdFiles.map(file => {
        const filePath = path.join(fullPath, file);
        return parseMarkdownFile(filePath, planSlug, `${planSlug}/${file}`);
      });

      const allItems = parsedFiles.flatMap(f => f.items);
      const allSections = parsedFiles.flatMap(f => f.sections);

      // Best title: directory name formatted nicely
      const mainTitle = planTitle;

      plans.push({
        id: planSlug,
        slug: planSlug,
        title: mainTitle,
        folder: planSlug,
        files: parsedFiles,
        totalItems: allItems.length,
        totalSections: allSections.length,
        items: allItems,
      });
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      // Standalone markdown file as a plan
      const planSlug = path.basename(entry.name, '.md');
      const parsedFile = parseMarkdownFile(fullPath, planSlug, entry.name);

      plans.push({
        id: planSlug,
        slug: planSlug,
        title: cleanTitle(planSlug),
        folder: '',
        files: [parsedFile],
        totalItems: parsedFile.items.length,
        totalSections: parsedFile.sections.length,
        items: parsedFile.items,
      });
    }
  }

  // Sort plans alphabetically by title
  plans.sort((a, b) => a.title.localeCompare(b.title));

  const outputDir = path.join(rootDir, 'src', 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'plans.json');
  fs.writeFileSync(outputPath, JSON.stringify(plans, null, 2), 'utf-8');

  console.log(`Successfully generated plans data! Found ${plans.length} plan(s).`);
  plans.forEach(p => {
    console.log(` - ${p.title} (${p.slug}): ${p.files.length} file(s), ${p.totalItems} places/items, ${p.totalSections} sections`);
  });
}

generatePlans();
