# CMS (Content Management System)

This directory contains the CMS functionality for managing content.

## Pages

### Dashboard (`/cms`)
- Overview of content statistics
- Quick actions for creating and managing content
- Recent content list with edit links

### Upload Page (`/cms/upload`)
**Features:**
- **Create new content:** Visit `/cms/upload` to create new content
- **Edit existing content:** Visit `/cms/upload?contentId=<id>` to edit existing content

**Query Parameters:**
- `contentId` (optional): When provided, the page will load the existing content for editing

**Usage Examples:**
```
# Create new content
/cms/upload

# Edit existing content
/cms/upload?contentId=1703123456789-abc123-def456
```

### List Page (`/cms/list`)
**Features:**
- View all content in a table format
- Search and filter functionality
- Edit and delete actions for each content item
- Status indicators (published, draft, archived)
- Tag display and view counts

**Table Columns:**
- Title, Status, Author, Tags, Views, Created Date, Updated Date, Actions

**Actions:**
- **Edit**: Navigate to upload page with contentId
- **Delete**: Delete content with confirmation dialog
- **Search**: Filter by title, author, or tags
- **Status Filter**: Filter by content status

## Form Fields

- **Title**: Required text field for content title
- **Tags**: Optional comma-separated tags
- **Status**: Content status (Draft, Published, or Archived when editing)
- **HTML Content**: Required textarea for the full HTML body

### Status Options
- **Draft**: Content is saved but not visible to public
- **Published**: Content is live and visible to public
- **Archived**: Content is hidden but preserved (only available when editing existing content)

## Server Actions

The CMS uses the following server actions:
- `createContentAction`: Creating new content
- `updateContentAction`: Updating existing content
- `getContentAction`: Fetching content for editing
- `deleteContentAction`: Deleting content
- `listContentAction`: Fetching content list

## Migration

The old `/upload` page now redirects to `/cms/upload` to maintain backward compatibility.