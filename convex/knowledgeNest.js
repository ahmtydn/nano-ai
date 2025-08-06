import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Utility function to sanitize content for safe storage
function sanitizeText(text) {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .replace(/\\/g, '\\\\')   // Escape backslashes
    .replace(/"/g, '\\"')     // Escape quotes
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
    .trim();
}

// Generate upload URL for file storage
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx, args) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Upload file metadata to knowledge nest
export const uploadFileMetadata = mutation({
  args: {
    file_id: v.string(),
    subject: v.string(),
    filename: v.string(),
    file_size: v.number(),
    file_type: v.string(),
    description: v.optional(v.string()),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      if (!args.username) {
        return { success: false, message: "Username is required" };
      }

      // Get user's organization details
      const userOrg = await ctx.db
        .query("user_organizations")
        .withIndex("by_username", (q) => q.eq("username", args.username))
        .first();

      if (!userOrg || !userOrg.isActive) {
        return { success: false, message: "User organization not found or not active" };
      }

      // Get organization details
      const organization = await ctx.db.get(userOrg.organization_id);
      if (!organization || !organization.org_verified) {
        return { success: false, message: "Organization not found or not verified" };
      }

      // Insert file metadata with sanitized strings
      const fileRecord = await ctx.db.insert("knowledge_nest", {
        file_id: args.file_id,
        organization_id: userOrg.organization_id,
        semester: userOrg.semester,
        branch: userOrg.branch,
        uploaded_username: args.username,
        subject: sanitizeText(args.subject),
        filename: sanitizeText(args.filename),
        file_size: args.file_size,
        file_type: sanitizeText(args.file_type),
        upload_date: Date.now(),
        description: sanitizeText(args.description || ""),
        is_active: true,
      });

      return { 
        success: true, 
        message: "File uploaded successfully",
        fileId: fileRecord 
      };
    } catch (error) {
      console.error("Error uploading file metadata:", error);
      return { success: false, message: "Failed to upload file metadata" };
    }
  },
});

// Get user's organization and class details for auto-fill
export const getUserOrgDetails = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Get user's organization mapping
      const userOrg = await ctx.db
        .query("user_organizations")
        .withIndex("by_username", (q) => q.eq("username", args.username))
        .first();

      if (!userOrg || !userOrg.isActive) {
        return { success: false, message: "User organization not found or not active" };
      }

      // Get organization details
      const organization = await ctx.db.get(userOrg.organization_id);
      if (!organization || !organization.org_verified) {
        return { success: false, message: "Organization not found or not verified" };
      }

      return {
        success: true,
        data: {
          organization_id: userOrg.organization_id,
          org_name: organization.org_name,
          semester: userOrg.semester,
          branch: userOrg.branch,
          username: args.username,
        }
      };
    } catch (error) {
      console.error("Error fetching org details:", error);
      return { success: false, message: "Failed to fetch organization details" };
    }
  },
});

// Get files for user's organization and class
export const getKnowledgeNestFiles = query({
  args: {
    username: v.string(),
    subject: v.optional(v.string()),
    semester: v.optional(v.string()),
    branch: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      // Get user's organization details
      const userOrg = await ctx.db
        .query("user_organizations")
        .withIndex("by_username", (q) => q.eq("username", args.username))
        .first();

      if (!userOrg || !userOrg.isActive) {
        return { success: false, message: "User organization not found or not active" };
      }

      // Get organization details
      const organization = await ctx.db.get(userOrg.organization_id);
      if (!organization || !organization.org_verified) {
        return { success: false, message: "Organization not found or not verified" };
      }

      // Query files for the same organization, semester, and branch
      let filesQuery = ctx.db
        .query("knowledge_nest")
        .filter((q) => 
          q.and(
            q.eq(q.field("organization_id"), userOrg.organization_id),
            q.eq(q.field("semester"), userOrg.semester),
            q.eq(q.field("branch"), userOrg.branch),
            q.eq(q.field("is_active"), true)
          )
        );

      // Filter by subject if provided
      if (args.subject) {
        filesQuery = filesQuery.filter((q) => q.eq(q.field("subject"), args.subject));
      }

      const files = await filesQuery
        .order("desc")
        .collect();

      return {
        success: true,
        files: files,
        orgInfo: {
          org_name: organization.org_name,
          semester: userOrg.semester,
          branch: userOrg.branch,
        }
      };
    } catch (error) {
      console.error("Error fetching knowledge nest files:", error);
      return { success: false, message: "Failed to fetch files" };
    }
  },
});

// Delete file (soft delete)
export const deleteFile = mutation({
  args: {
    file_id: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Find the file record
      const fileRecord = await ctx.db
        .query("knowledge_nest")
        .filter((q) => q.eq(q.field("file_id"), args.file_id))
        .first();

      if (!fileRecord) {
        return { success: false, message: "File not found" };
      }

      // Check if user is the uploader
      if (fileRecord.uploaded_username !== args.username) {
        return { success: false, message: "Unauthorized to delete this file" };
      }

      // Soft delete
      await ctx.db.patch(fileRecord._id, {
        is_active: false,
      });

      return { success: true, message: "File deleted successfully" };
    } catch (error) {
      console.error("Error deleting file:", error);
      return { success: false, message: "Failed to delete file" };
    }
  },
});

// Get file download URL
export const getFileUrl = query({
  args: {
    file_id: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Get user's organization details
      const userOrg = await ctx.db
        .query("user_organizations")
        .withIndex("by_username", (q) => q.eq("username", args.username))
        .first();

      if (!userOrg || !userOrg.isActive) {
        return { success: false, message: "User organization not found or not active" };
      }

      // Get organization details
      const organization = await ctx.db.get(userOrg.organization_id);
      if (!organization || !organization.org_verified) {
        return { success: false, message: "Organization not found or not verified" };
      }

      // Find the file record and verify access
      const fileRecord = await ctx.db
        .query("knowledge_nest")
        .filter((q) => 
          q.and(
            q.eq(q.field("file_id"), args.file_id),
            q.eq(q.field("organization_id"), userOrg.organization_id),
            q.eq(q.field("semester"), userOrg.semester),
            q.eq(q.field("branch"), userOrg.branch),
            q.eq(q.field("is_active"), true)
          )
        )
        .first();

      if (!fileRecord) {
        return { success: false, message: "File not found or access denied" };
      }

      // Get the actual file URL from storage
      let fileUrl;
      try {
        fileUrl = await ctx.storage.getUrl(args.file_id);
        if (!fileUrl) {
          return { success: false, message: "File not found in storage - the file may have been deleted or corrupted" };
        }
      } catch (storageError) {
        console.error("Storage error:", storageError);
        return { success: false, message: "Unable to access file from storage. Please try downloading instead." };
      }

      return {
        success: true,
        url: fileUrl,
        filename: fileRecord.filename,
        file_type: fileRecord.file_type,
      };
    } catch (error) {
      console.error("Error getting file URL:", error);
      return { success: false, message: "Failed to get file URL. Please try again later." };
    }
  },
});

// Get subjects list for dropdown
export const getSubjects = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Get user's organization details
      const userOrg = await ctx.db
        .query("user_organizations")
        .withIndex("by_username", (q) => q.eq("username", args.username))
        .first();

      if (!userOrg || !userOrg.isActive) {
        return { success: false, message: "User organization not found or not active" };
      }

      // Get organization details
      const organization = await ctx.db.get(userOrg.organization_id);
      if (!organization || !organization.org_verified) {
        return { success: false, message: "Organization not found or not verified" };
      }

      // Get unique subjects from files in the same org, semester, and branch
      const files = await ctx.db
        .query("knowledge_nest")
        .filter((q) => 
          q.and(
            q.eq(q.field("organization_id"), userOrg.organization_id),
            q.eq(q.field("semester"), userOrg.semester),
            q.eq(q.field("branch"), userOrg.branch),
            q.eq(q.field("is_active"), true)
          )
        )
        .collect();

      const subjects = [...new Set(files.map(file => file.subject))];

      return {
        success: true,
        subjects: subjects,
      };
    } catch (error) {
      console.error("Error fetching subjects:", error);
      return { success: false, message: "Failed to fetch subjects" };
    }
  },
});

// Download file with proper access control
export const downloadFile = query({
  args: {
    file_id: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Get user's organization details
      const userOrg = await ctx.db
        .query("user_organizations")
        .withIndex("by_username", (q) => q.eq("username", args.username))
        .first();

      if (!userOrg || !userOrg.isActive) {
        return { success: false, message: "User organization not found or not active" };
      }

      // Get organization details
      const organization = await ctx.db.get(userOrg.organization_id);
      if (!organization || !organization.org_verified) {
        return { success: false, message: "Organization not found or not verified" };
      }

      // Find the file record and verify access
      const fileRecord = await ctx.db
        .query("knowledge_nest")
        .filter((q) => 
          q.and(
            q.eq(q.field("file_id"), args.file_id),
            q.eq(q.field("organization_id"), userOrg.organization_id),
            q.eq(q.field("semester"), userOrg.semester),
            q.eq(q.field("branch"), userOrg.branch),
            q.eq(q.field("is_active"), true)
          )
        )
        .first();

      if (!fileRecord) {
        return { success: false, message: "File not found or access denied" };
      }

      // Get the download URL - only handle real storage files
      let downloadUrl;
      
      // This should be a real storage ID, get the actual URL
      downloadUrl = await ctx.storage.getUrl(args.file_id);
      if (!downloadUrl) {
        return { success: false, message: "File not found in storage" };
      }

      // Log the download activity (optional)
      const downloadLog = {
        file_id: args.file_id,
        downloaded_by: args.username,
        download_date: Date.now(),
        filename: fileRecord.filename,
        uploader: fileRecord.uploaded_username,
      };

      return {
        success: true,
        downloadUrl: downloadUrl,
        filename: fileRecord.filename,
        file_type: fileRecord.file_type,
        file_size: fileRecord.file_size,
        message: "File ready for download"
      };
    } catch (error) {
      console.error("Error preparing file download:", error);
      return { success: false, message: "Failed to prepare file download" };
    }
  },
});
